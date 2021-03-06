/*
 * Logo de la Separation
 */
function Logo() {
	this.group = null; // Groupe Kinetic
	this.border = Math.floor(screenHeight / 20); // Largeur des lignes du logo (~20)
	
	this.width = 12 * this.border; // Largeur du logo
	this.height = 12 * this.border; // Hauteur du logo
	
	this.x = 0; // Position x
	this.y = 0; // Position y
	
	LogoConstruct(this);
}

LogoConstruct = function(logo) {
	logo.generate();
	logo.setCenterXY(screenWidth / 2, screenHeight / 2); // Par défaut on centre le logo
}

Logo.prototype.generate = function() {
	var border = this.border;
	var radius = 4 * border;
	var x = 6 * border;
	var y = 6 * border;
	var line_width = 3.5 * border;
	
	this.arc_up = new Kinetic.Shape({
		drawFunc: function(canvas) {
			var ctx = canvas.getContext();
			ctx.beginPath();
			// ctx.arc(x, y - border / 2, radius, Math.PI, 0);
			ctx.moveTo(x - line_width + border/2, y - border/2);
			ctx.bezierCurveTo(x - line_width + border/2, y - radius, x + line_width - border/2, y - radius, x + line_width - border/2, y - border/2);
			canvas.stroke(this);
		},
		stroke: '#FFF',
		strokeWidth: border,
    });
	
	this.arc_down = new Kinetic.Shape({
		drawFunc: function(canvas) {
			var ctx = canvas.getContext();
			ctx.beginPath();
			// ctx.arc(x, y + border / 2, radius, 0, Math.PI);
			ctx.moveTo(x + line_width - border/2, y + border/2);
			ctx.bezierCurveTo(x + line_width - border/2, y + radius, x - line_width + border/2, y + radius, x - line_width + border/2, y + border/2);
			canvas.stroke(this);
		},
		stroke: '#FFF',
		strokeWidth: border,
    });
	
	this.central_line = new Kinetic.Line({
		points: [x - line_width / 2, y, x + line_width / 2, y],
		stroke: "#FFF",
		strokeWidth: border,
    });
	
	this.group = this.group = new Kinetic.Group({
		width: border * 6,
		height: border * 6,
		offsetX: x,
		offsetY: y,
	});
	
	this.group.add(this.arc_up);
	this.group.add(this.arc_down);
	this.group.add(this.central_line);
	
	this.groupDestroy = function() {
		this.arc_up.destroy();
		this.arc_down.destroy();
		this.central_line.destroy();
		this.group.destroy();
	}
}

Logo.prototype.display = function(layer) {
	this.group.setX(this.getRealX());
	this.group.setY(this.getRealY());
	
	layer.add(this.group);
}

Logo.prototype.destroy = function() {
	this.groupDestroy();
}

Logo.prototype.animateIntro = function(handler) {

	var logo = this;
	var anim_duration = 2;
	
	rotation90();

	function rotation90() {
		new Kinetic.Tween({
			node: logo.getNode(),
			rotationDeg: 90,
			easing: Kinetic.Easings.EaseInOut,
			duration: anim_duration,
			onFinish: openLogo,
		}).play();
	}
	
	function openLogo() {
		new Kinetic.Tween({
			node: logo.getArcDown(),
			y: screenWidth / 2,
			easing: Kinetic.Easings.EaseIn,
			duration: anim_duration,
		}).play();
		new Kinetic.Tween({
			node: logo.getArcUp(),
			y: -screenWidth / 2,
			easing: Kinetic.Easings.EaseIn,
			duration: anim_duration,
		}).play();
		new Kinetic.Tween({
			node: logo.getCentralLine(),
			scaleX: 0,
			scaleY: 0,
			x: logo.getWidth() / 2,
			y: logo.getHeight() / 2,
			easing: Kinetic.Easings.EaseIn,
			duration: anim_duration,
			onFinish: finish,
		}).play();
	}
	
	function finish() {
		logo.groupDestroy();
		handler();
	}
}


// Set
Logo.prototype.setX = function(data) { this.x = data + this.getOffsetX(); }
Logo.prototype.setY = function(data) { this.y = data + this.getOffsetY(); }
Logo.prototype.setCenterXY = function(x, y) {
	this.setX(x - this.getWidth() / 2);
	this.setY(y - this.getHeight() / 2);
}
// Get
Logo.prototype.getX = function() { return this.x - this.getOffsetX(); }
Logo.prototype.getY = function() { return this.y - this.getOffsetY(); }
Logo.prototype.getRealX = function() { return this.x; }
Logo.prototype.getRealY = function() { return this.y; }
Logo.prototype.getOffsetX = function() { return this.group.getOffsetX(); }
Logo.prototype.getOffsetY = function() { return this.group.getOffsetY(); }
Logo.prototype.getWidth = function() { return this.width; }
Logo.prototype.getHeight = function() { return this.height; }
Logo.prototype.getNode = function() { return this.group; }
Logo.prototype.getArcUp = function() { return this.arc_up; }
Logo.prototype.getArcDown = function() { return this.arc_down; }
Logo.prototype.getCentralLine = function() { return this.central_line; }

scriptLoaded('scripts/libs/separation_toolkit/logo/logo.js');