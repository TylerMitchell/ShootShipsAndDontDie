// Text is a canvas GUI object. Text object creates some text to be displayed on the cnavas.
Text.Inherits(GameObject);
function Text(x, y, txt, col, font, maxWidth){
	this.Inherits(GameObject, x, y, txt, "Text");
	this.canvas = document.createElement("canvas");
	this.canvas.height = 40;
	this.context = this.canvas.getContext("2d");
	this.text = txt;
	this.font = typeof font != "undefined" ? font : false;
	this.color = typeof col != "undefined" ? col : false;
	this.maxWidth = typeof maxWidth != "undefined" ? maxWidth : false;
	
	this.setText = function(ntxt){ this.text = ntxt; this.draw(); }
	this.setFont = function(nf){ this.font = nf; this.draw(); }
	this.setPosition = function(nx, ny){ this.x = nx; this.y = ny; this.draw(); }
	this.setColor = function(c){ this.color = c; this.draw(); }
	this.setMaxWidth = function(nw){ this.maxWidth = nw; this.draw(); }
	
	// This function draws the text to the local canvas
	this.draw = function(){
		this.canvas.width = this.context.measureText(this.text).width;
		this.context.font = this.font ? this.font : "30px sans-serif";
		this.context.fillStyle = this.color ? this.color : "#000000";
		this.context.textBaseline = 'top';
		this.context.fillText(this.text, 0, 0);
	}
	this.draw();
	//TODO: canvas won't resize the first time this is called for some reason, so I called it again. Figure out why.
	this.draw();
	
	//add the canvas to the list of things to be drawn by the Screen object.
	window.game.screen.imageHandles[this.text] = this.canvas;
	
	this.add = function(){ window.game.screen.addObject(this); };
	this.remove = function(){ window.game.screen.removeObject(this); };
	
	this.add();
}