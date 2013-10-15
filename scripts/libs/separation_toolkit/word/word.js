word_active = false;

/**
	Class Word
*/
function Word(value, next_value, police) {
	this.x = 0; // Position x en pixel
	this.y = 0; // Position y en pixel
	
	this.size = 24; // Taille de la police en pixel
	this.cst = fontConst['24px']; // Constantes en fonction de la taille
	
	this.police = (police == undefined) ? this.cst.police.name : police; // Police
	this.fontSize = this.cst.car.size; // Hauteur du mot en pixel
	this.color = this.cst.car.color; // Couleur
	
	this.value = value; // Valeur du mot actuel
	this.next_value = (next_value == undefined) ? value : next_value; // Valeur du mot après transformation
	this.font = null; // Groupe Kinetic qui sera affiché
	this.animation = null; // Fonction de callback pour l'animation ('Animation.x')
	this.inAnimation = false;
	
	this.active = false; // Booléen pour savoir si il est mis en avant
	this.activeX = 0;
	this.activeY = 0;
	this.scale = 1; // Zoom de la police (100% = 1)
	
	this.gesture = null;
	
	WordConstruct(this);
}

/*
	Constructeur
*/
function WordConstruct(word) {
	word.generate();
}

Word.prototype.generate = function() {
	switch(this.police)
	{
		case 'coupable_haut':
			this.font = new Word_DemiHaut({
				value: this.value,
				next_value: this.next_value,
				fontSize: this.fontSize,
				police: this.police,
				color: this.color,
				cst: this.cst,
			});
		break;
		case 'coupable_bas':
			this.font = new Word_DemiBas({
				value: this.value,
				next_value: this.next_value,
				fontSize: this.fontSize,
				police: this.police,
				color: this.color,
				cst: this.cst,
			});
		break;
		default:
			alert('Police inconnue : ' + this.police);
		break;
	}
	this.font.group.setScaleX(this.scale);
	this.font.group.setScaleY(this.scale);
}

Word.prototype.display = function(layer) {
	this.font.group.setX(this.getX());
	this.font.group.setY(this.getY());

	layer.add(this.font.group);
}

Word.prototype.animate = function() {
	if(!this.inAnimation && (!word_active || this.active))
	{
		this.inAnimation = true;
		this.animation(this);
	}
}

Word.prototype.animationFinished = function() {
	this.inAnimation = false;
	var temp = this.next_value;
	this.next_value = this.value;
	this.value = temp;
	
	this.font.destroy();
	
	this.generate();
	this.display(mainLayer);
}

Word.prototype.setAnimation = function(type) {
	switch(this.police) {
		case 'coupable_haut':
			if(type == 'rTl')
				this.animation = Animation.downCutLeft;
			else
				this.animation = Animation.downCutRight;
		break;
		case 'coupable_bas':
			if(type == 'rTl')
				this.animation = Animation.upCutLeft;
			else
				this.animation = Animation.upCutRight;
		break;
		default:
			alert('Police inconnue : ' + this.police);
		break;
	}
}

// Fonctions pour la gestuelle
Word.prototype.addGesture = function() {
	switch(this.police)
	{
		case 'coupable_haut':
		case 'coupable_bas':
			var word = this;
			this.gesture = new Array();
			this.gesture[0] = new Separation.cut({
				x: this.getX() - this.getWidth() / 4,
				y:	this.getY() - this.getHeight() / 2,
				width: this.getWidth() * 1.5,
				height: this.getHeight() * 2,
			}, 'lTr');
			this.gesture[0].on(function(){
				word.setAnimation('lTr');
				word.animate();
			});
			this.gesture[1] = new Separation.cut({
				x: this.getX() - this.getWidth() / 4,
				y:	this.getY() - this.getHeight() / 2,
				width: this.getWidth() * 1.5,
				height: this.getHeight() * 2,
			}, 'rTl');
			this.gesture[1].on(function(){
				word.setAnimation('rTl');
				word.animate();
			});
		break;
		default:
			alert('Police inconnue : ' + this.police);
		break;
	}
}

Word.prototype.onTap = function(handler) {
	this.tap = new Separation.tap({
		x: this.getX() - this.getWidth() / 4,
		y: this.getY() - this.getHeight() / 2,
		width: this.getWidth() * 1.5,
		height: this.getHeight() * 2,
	});
	
	this.tap.on(handler);
}

/*Word.prototype.activeOnTap = function() {
	word = this;
	this.onTap(function(){word.activate()});
}*/

	
// Fonctions de mise en avant
Word.prototype.activate = function() {
	this.active = true;
	word_active = true;
	
	var all_words = this.font.group.getParent().getChildren();
	for(var i = 0; i < all_words.length ; i++)
	{
		if(all_words[i] != this.font.group) { 
			Effects.setDark(all_words[i]); 
		}
	}
	
	this.zoom(Word_cst.zoom.recit);
	
	/*stage.on(events['click'], function() {
		
	});*/
}

Word.prototype.disable = function() {
	this.active = false;
	word_active = false;
	
	var all_words = this.font.group.getParent().getChildren();
	//stage.off("dbltap");
	for(var i = 0; i < all_words.length ; i++)
	{
		if(all_words[i] != this.font.group) { 
			Effects.setLight(all_words[i]);
		}
	}
	
	this.zoomOut();
	/*if(inTuto == true || currentStoryType == StoryType['alter']) {
		node_unzoom(wordGroup, previousPos.x, previousPos.y);
	}
	else {
		alert("story type continue");
	}*/
}

Word.prototype.zoom = function(scaleTo) {
	this.scale = scaleTo;

	this.activeX = (screenWidth - this.getWidth()) / 2;
	this.activeY = (screenHeight - this.getHeight()) / 2;
	
	var word = this;
	
	new Kinetic.Tween({
		node: this.font.group,
		scaleX: scaleTo,
		scaleY: scaleTo,
		x: this.activeX,
		y: this.activeY,
		duration: Word_cst.duration.zoom,
		onFinish: function(){ word.addGesture(); },
	}).play();
}
	
Word.prototype.zoomOut = function() {
	this.scale = 1;
	
	var x = (screenWidth - this.getWidth()) / 2;
	var y = (screenHeight - this.getHeight()) / 2;
	
	new Kinetic.Tween({
		node: this.font.group,
		scaleX: 1,
		scaleY: 1,
		x: this.x,
		y: this.y,
		duration: Word_cst.duration.zoomout,
	}).play();
}

// Get
Word.prototype.getX = function() { if(!this.active) return this.x; else return this.activeX; }
Word.prototype.getY = function() { if(!this.active) return this.y; else return this.activeY; }
Word.prototype.getWidth = function() { return this.font.group.getWidth() * this.scale; }
Word.prototype.getHeight = function() { return this.cst.car.height * this.scale; }
Word.prototype.getScale = function(data) { return this.scale; }
// Set
Word.prototype.setX = function(data) { this.x = data; }
Word.prototype.setY = function(data) { this.y = data; }
Word.prototype.setCenterX = function(data) { this.x = data - this.getWidth() / 2; }
Word.prototype.setCenterY = function(data) { this.y = data - this.getHeight() / 2; }