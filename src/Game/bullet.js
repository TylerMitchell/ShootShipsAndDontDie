Bullet.Inherits(GameObject);
function Bullet( x, y, dx, dy, imgHandle, rotation, creator ){
	this.Inherits(GameObject, x, y, imgHandle, "Bullet");
	this.track(this);
	
	this.origX = x;
	this.origY = y;
	this.creator = creator;
	
	this.rotation = rotation;
	var c = Math.cos(this.rotation);
	var s = Math.sin(this.rotation);
	
	this.dx = dx;
	this.dy = dy;
	var tx = this.dx*c - this.dy*s;
	var ty = this.dx*s + this.dy*c;
	this.dx = tx;
	this.dy = ty;
	
	this.move = function(){ 
		this.x += this.dx;
		this.y += this.dy;
		this.rect.move(this.x, this.y); };
	
	this.resolveCollisions = function(){
		for(var i = this.hit.length-1; i > -1; i--){
			if( !(this.creator.type == "Enemy" && this.hit[i].type == "Enemy") &&
				!(this.creator.type == "Player" && this.hit[i].type == "Player") ){ this.die(); }
			this.hit.pop();
		}
	};
	
	this.die = function(){
		this.unTrack(this);
	};
}