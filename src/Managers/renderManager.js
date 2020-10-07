function RenderManager(width, height){
	//setup canvas and context
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = height;
	this.ctx = this.canvas.getContext("2d");
	document.getElementById("canvasTarget").appendChild(this.canvas);
	
	this.rect = new Rect(0, height, 0, width);
	
	this.drawObjects = [];
	this.imageHandles = {};
	
	this.getImageWidth = function(key){ return this.imageHandles[key].width; };
	this.getImageHeight = function(key){ return this.imageHandles[key].height; };
	this.getImage = function(key){ return this.imageHandles[key]; };
	
	this.getWidth = function(){ return this.canvas.width; };
	this.getHeight = function(){ return this.canvas.height; };
	
	this.addObject = function(obj){ 
		this.drawObjects.push(obj); 
	};
	this.removeObject = function(obj){ 
		var ind = this.drawObjects.indexOf(obj);
		if(ind == -1){ alert("FUCK!!!"); };
		this.drawObjects.splice(ind, 1); 
	};
	
	this.inScreen = function(obj){ return window.game.collisionManager.AABB(this.rect, obj.rect); };
	
	this.draw = function(){
		var i = 0;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for( ; i < this.drawObjects.length; i++ ){
			var obj = this.drawObjects[i];
			if( this.drawObjects[i].hasOwnProperty("rotation") && this.drawObjects[i].rotation != 0 ){ 
				this.ctx.save();
				this.ctx.translate( (this.imageHandles[obj.img].width / 2)+obj.x, (this.imageHandles[obj.img].height / 2)+obj.y );
				this.ctx.rotate(this.drawObjects[i].rotation);
				this.ctx.translate( -(this.imageHandles[obj.img].width / 2), -(this.imageHandles[obj.img].height / 2) );
				this.ctx.drawImage( this.imageHandles[obj.img], 0, 0 );
				this.ctx.restore();
			}
			else{ this.ctx.drawImage( this.imageHandles[obj.img], obj.x, obj.y ); }
		}
	};
}