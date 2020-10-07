Enemy.Inherits(GameObject);
function Enemy( startX, startY, imgHandle, fleet){
	this.Inherits(GameObject, startX, startY, imgHandle, "Enemy");
	this.track(this);
	
	this.origX = startX;
	this.origY = startY;
	
	this.fleet = fleet;
	this.speed = 1;
	this.fireRate = 2;
	
	this.shotTimer = new Timer();
	this.shotTimer.startWait(1000/this.fireRate);
	
	this.resolveCollisions = function(){
		for(var i = this.hit.length-1; i > -1; i--){
			if( this.hit[i].type == "Player" ) { this.die(); }
			if( this.hit[i].type == "Bullet" && this.hit[i].creator.type != "Enemy" ){ this.die(); }
			this.hit.pop();
		}
	};
	
	this.die = function(){
		//remove enemy from screen
		this.unTrack(this);
		window.game.addPoints(1);
		window.game.soundManager.play("snd/explode");
		if( this.fleet ){ this.fleet.remove(this); }
	};
	
	this.cleanup = function(){
		this.unTrack(this);
		if( this.fleet ){ this.fleet.remove(this); }
	};
	
	this.face = function(targ){
		//var dot = (targ.x*this.x)+(targ.y*this.y);
		//var mag = Math.sqrt( (targ.x*targ.x)+(targ.y*targ.y)+(this.x*this.x)+(this.y*this.y) );
		//this.rotation = (Math.acos(dot/mag)*(180/Math.PI))-90;
		this.rotation = Math.atan2(targ.y - this.y, targ.x - this.x)-(90*Math.PI/180);
	};
	
	this.shoot = function(){
		if( this.shotTimer.isWaitOver() ){
			var b = new Bullet( this.x, this.y, 0, 4, "img/bullet.png", this.rotation, this );
			window.game.bullets.push(b);
			this.shotTimer.startWait( 1000/this.fireRate );
			window.game.soundManager.play("snd/shoot");
		}
	};
	this.takeDamage = function(){};
	this.think = function(){
		if( this.fleet ){ this.fleet.think(this); }
		else{
			this.y += this.speed;
			this.rect.move(this.x, this.y);
		}
	};
}