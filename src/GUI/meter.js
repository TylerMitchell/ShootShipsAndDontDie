//Meter is canvas GUI object.
Meter.Inherits(GameObject);
function Meter( max, meterX, meterY, col, w, h, dir, imgsrc, imgX, imgY){
	this.canvas = document.createElement("canvas");
	this.canvas.height = h;
	this.canvas.width = w;
	this.context = this.canvas.getContext("2d");
	
	this.maximum = max;
	this.width = w;
	this.height = h;
	this.direction = dir;
	this.current = this.maximum;
	this.color = col;
	this.borderColor = '#FFFFFF';
	this.x = meterX;
	this.y = meterY;
	this.img = this.color+this.direction+( (this.x+1)*(this.y+1) );
	this.Inherits(GameObject, meterX, meterY, this.img, "Meter");
	
	this.fill = function(){ this.current = this.maximum; this.draw(); };
	this.setCurrent = function(cur){ this.current = cur; this.draw(); };
	this.subtract = function(amt){ this.current -= amt; this.draw(); };
	this.add = function(amt){ this.current += amt; this.draw(); };
	this.getCurrent = function(){ return this.current; };
	this.isMeterEmpty = function(){ 
		if( this.current <= 0 ){ return true; }
		else{ return false; }
	};
	this.setColor = function(col){ this.color = col; this.draw(); };
	this.setMax = function(max){ this.maximum = max; this.draw(); };
	this.setWidth = function(w){ this.width = w; this.canvas.width = w; this.draw(); };
	this.setHeight = function(h){ this.height = h; this.canvas.height = h; this.draw(); };
	this.setBorderColor = function(col){ this.borderColor = col; this.draw(); };
	this.setX = function(x){ this.x = x; this.draw(); };
	this.setY = function(y){ this.y = y; this.draw(); };
	
	//draw the meter to the local canvas. If there is a surrounding image that will be drawn by the Screen object.
	this.draw = function(){
		this.context.clearRect(0, 0, this.width, this.height);
		
		var percentFill = this.current / this.maximum;
		this.context.fillStyle = this.color;
		var x = this.x;
		var y = this.y;
		var maxX = this.x + this.width;
		var maxY = this.y + this.height;
		
		var w = this.width;
		var h = this.height;
		
		//Alter the shape of the drawn rectangle based on which direction the meter drains.
		if( this.direction == "left" ){ w = Math.round(this.width * percentFill); }
		else if( this.direction == "right" ){ w = Math.round(this.width * percentFill); x += this.width - w; }
		else if( this.direction == "up" ){ h = Math.round(this.height * percentFill); }
		else if( this.direction == "down" ){ h = Math.round(this.height * percentFill); y += this.height - h; }
		//don't let the rectangle get drawn past it's bounds
		if( w <= 0 ){ w = 0; }
		if( h <= 0 ){ h = 0; }
		if( x >= maxX ){ x = maxX; }
		if( y >= maxY ){ y = maxY; }
		//draw the rectangle
		this.context.fillRect(1, 1, w-1, h-1);
		this.context.strokeStyle = this.borderColor;
		this.context.strokeRect(0, 0, w, h);
	};
	
	window.game.screen.imageHandles[this.img] = this.canvas;
	
	this.add = function(){ window.game.screen.addObject(this); };
	this.remove = function(){ window.game.screen.removeObject(this); };
	
	this.draw();
	this.add();
}