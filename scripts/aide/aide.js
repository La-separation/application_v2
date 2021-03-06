/**
        Namespace Aide
*/
var Aide = {};

var word_centrale = null;
var word_coupable = null;

Aide.start = function() {
	Destroy.all();
	Gui.homeBtn();

	Aide.coupable();
}

Aide.coupable = function() {
	Destroy.all();
	Gui.homeBtn();
	
	word_coupable = new Word('Separation', 'Perception', 0);
	var center = [screenWidth/2, screenHeight/2];
	
	word_coupable.setCenterX(center[0]);
	word_coupable.setCenterY(center[1]);
	word_coupable.display(mainLayer);
	word_coupable.activeOnTap();
	word_coupable.setDone('zoomOut', Aide.ombre);
	
	mainLayer.draw();
	actionLayer.draw();
}

Aide.destroy = function() {
	Destroy.objet(word_centrale);
	Destroy.objet(word_coupable);
}

Aide.ombre = function() {
	Destroy.all();
	Gui.homeBtn();
	
	var imgs = new Array();
	var center = [screenWidth/2, screenHeight/2];
	
	imgs[0] = new Image();
	imgs[1] = new Image();
	
	var CYGNE = null;
	var OMBRE = null;
	
	imgs[0].onload = function() {
		OMBRE = new Kinetic.Image({
			x: center[0] - 771/8,
			y: center[1] - 267/8,
			image: imgs[0],
			width: 771,
			height: 267,
			scaleX: 0.25,
			scaleY: 0.25,
		});
		setTimeout(function() {
			mainLayer.add(OMBRE);
			mainLayer.draw();
		}, 20);
	}
	imgs[1].onload = function() {
		CYGNE = new Kinetic.Image({
			x: center[0] - 771/8,
			y: center[1] - 267/8 - 2,
			image: imgs[1],
			width: 771,
			height: 267,
			scaleX: 0.25,
			scaleY: 0.25,
		});
		mainLayer.add(CYGNE);
		mainLayer.draw();
	}
	
	if(appOnDevice()) {
		var path = location.pathname;
		var tab = path.split("/");
		imgs[0].src = path.replace(tab[tab.length-1], "imgs/aide/OMBRE.jpg");
		imgs[1].src = path.replace(tab[tab.length-1], "imgs/aide/CYGNE.jpg");
	}
	else {
		imgs[0].src = "imgs/aide/OMBRE.jpg";
		imgs[1].src = "imgs/aide/CYGNE.jpg";
	}
	
	function cut_fonction() {
		var gesture = new Separation.cut({
			x: center[0] - 771/4,
			y:	center[1] - 267/4,
			width: 771 / 2,
			height: 267 / 2,
		});
		gesture.on(function(){
			if(OMBRE.getOpacity() > 0) {
				new Kinetic.Tween({
					node: OMBRE,
					opacity: 0,
					duration: Word_cst.duration.zoom,
				}).play();
			}
			else {
				new Kinetic.Tween({
					node: OMBRE,
					opacity: 1,
					duration: Word_cst.duration.zoom,
				}).play();
			}
		});
		
		stage.on(events['dbltap'], function() {
			new Kinetic.Tween({
				node: CYGNE,
				x: center[0] - 771/8,
				y: center[1] - 267/8 - 2,
				scaleX: 0.25,
				scaleY: 0.25,
				duration: Word_cst.duration.zoom,
			}).play();
			new Kinetic.Tween({
				node: OMBRE,
				x: center[0] - 771/8,
				y: center[1] - 267/8 - 2,
				scaleX: 0.25,
				scaleY: 0.25,
				duration: Word_cst.duration.zoom,
				onFinish: function() {
					stage.off(events['dbltap']);
					Aide.centrale();
				}}).play();
		});
	}
	
	var tap = new Kinetic.Rect({
		listening : true,
		x: center[0] - 771/8,
		y: center[1] - 267/8,
		width: 771 / 4,
		height: 267 / 4,
		opacity: 0,
	});
	tap.on(events['tap'], function(){
		new Kinetic.Tween({
			node: CYGNE,
			scaleX: 0.5,
			scaleY: 0.5,
			x: center[0] - 771/4,
			y: center[1] - 267/4 - 4,
			duration: Word_cst.duration.zoom,
		}).play();
		new Kinetic.Tween({
			node: OMBRE,
			scaleX: 0.5,
			scaleY: 0.5,
			x: center[0] - 771/4,
			y: center[1] - 267/4,
			duration: Word_cst.duration.zoom,
			onFinish: cut_fonction,
		}).play();
	});
	actionLayer.add(tap);
	actionLayer.draw();	
}

Aide.centrale = function() {
	Destroy.all();
	Gui.homeBtn();
	
	word_centrale = new Word('SABRE', 'SACRE', 2);
	var center = [screenWidth/2, screenHeight/2];
	
	word_centrale.setCenterX(center[0]);
	word_centrale.setCenterY(center[1]);
	word_centrale.display(mainLayer);
	word_centrale.activeOnTap();
	word_centrale.setDone('zoomOut', Menu.start);
	
	mainLayer.draw();
	actionLayer.draw();
}

scriptLoaded('scripts/aide/aide.js');
