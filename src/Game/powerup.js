Powerup.Inherits(GameObject);
function Powerup(type){
	this.typeMap = { "health": "img/health.png", "speed": "img/speed.png", "firerate": "img/firerate.png" };
	this.Inherits(GameObject, Math.floor(Math.random()*window.game.screen.getWidth()), 0, this.typeMap[type], "Powerup");
	this.track(this);
	this.kind = type;
	
	this.resolveCollisions = function(){
		for(var i = this.hit.length-1; i > -1; i--){
			if( this.hit[i].type == "Player" ){ 
				this.die();
			}
			this.hit.pop();
		}
	};
	
	this.move = function(){ this.y += 1; this.rect.move(this.x, this.y);};
	
	this.die = function(){ 
		this.unTrack(this); 
		window.game.soundManager.play("snd/powerup"); 
	};
	this.cleanup = function(){ this.unTrack(this); };
}