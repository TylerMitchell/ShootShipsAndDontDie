function GameObject(startX, startY, imgHandle, type){
	this.x = startX;
	this.y = startY;
	this.img = imgHandle;
	this.type = type;
	
	this.rotation = 0;
	
	this.hit = [];
	
	this.live = true;
	
	this.rotate = function(dangle){ this.rotation += (dangle*Math.PI)/180; };
	this.orient = function(angle){ this.rotation = (angle*Math.PI)/180; };
	
	this.track = function(creator){
		this.rect = new Rect(this.y, this.y + window.game.screen.getImageHeight(imgHandle), this.x, this.x + window.game.screen.getImageWidth(imgHandle));
		window.game.screen.addObject( creator );
		window.game.collisionManager.add(creator);
	};
	
	this.unTrack = function(creator){ 
		if( this.live ){ 
			window.game.screen.removeObject(creator); 
			window.game.collisionManager.remove(creator); 
		}
		this.live = false; 
	};
	
	this.drawStart = function(creator){ window.game.screen.addObject(creator); };
	this.drawStop = function(creator){ window.game.screen.removeObject(creator); };
}