Player.Inherits(GameObject);
function Player(startX, startY, imgHandle){
	this.Inherits(GameObject, startX, startY, imgHandle, "Player");
	this.track(this);
	this.speed = 3;
	this.health = 10;
	this.fireRate = 5; //in bullets/second
	this.shotTimer = new Timer();
	this.shotTimer.startWait( 1000/this.fireRate );
	
	this.registerInputs = function(){
		window.game.input.registerKey("K_RIGHT");
		window.game.input.registerKey("K_LEFT");
		window.game.input.registerKey("K_UP");
		window.game.input.registerKey("K_DOWN");
		window.game.input.registerKey("K_SPACE");
		window.game.input.registerKey("K_A");
		window.game.input.registerKey("K_S");
		window.game.input.registerKey("K_D");
		window.game.input.registerKey("K_W");
	};
	
	this.update = function(){
		//this.orient(45);
		this.readInput();
		this.resolveCollisions();
	};
	
	this.resolveCollisions = function(){
		for(var i = this.hit.length-1; i > -1; i--){
			if( this.hit[i].type == "Enemy" ){ this.health -= 2; }
			if( this.hit[i].type == "Powerup" ){ 
				if( this.hit[i].kind == "health" ){ this.health += 1; }
				if( this.hit[i].kind == "speed" ){ this.speed += 1; }
				if( this.hit[i].kind == "firerate" ){ this.fireRate += 1; }
			}
			if( this.hit[i].type == "Bullet" ){ if( this.hit[i].creator != this ){ this.health -= 1; } }
			if( this.health < 1 ){ this.die(); }
			window.game.healthBoard.setText("Health: " + this.health);
			this.hit.pop();
		}
	};
	
	this.die = function(){
		this.unTrack(this);
		window.game.soundManager.play("snd/explode");
		window.game.cleanup = true;
	};
	
	this.readInput = function(){
		
		if( window.game.input.checkKey("K_RIGHT") ){ 
			if( this.x < window.game.screen.getWidth() - window.game.screen.getImageWidth(imgHandle) ){ this.x += this.speed; } 
			this.rect.move(this.x, this.y);
		}
		if( window.game.input.checkKey("K_LEFT") ){ 
			if( this.x > 0 ){ this.x -= this.speed; } 
			this.rect.move(this.x, this.y);
		}
		if( window.game.input.checkKey("K_UP") ){ 
			if( this.y > 0 ){ this.y -= this.speed; } 
			this.rect.move(this.x, this.y);
		}
		if( window.game.input.checkKey("K_DOWN") ){ 
			if( this.y < window.game.screen.getHeight() - window.game.screen.getImageHeight(imgHandle)){ this.y += this.speed; } 
			this.rect.move(this.x, this.y);
		}
		if( window.game.input.checkKey("K_W") ){ this.orient(0); }
		if( window.game.input.checkKey("K_A") ){ this.orient(270); }
		if( window.game.input.checkKey("K_S") ){ this.orient(180); }
		if( window.game.input.checkKey("K_D") ){ this.orient(90); }
		
		if( window.game.input.checkKey("K_W") && window.game.input.checkKey("K_D") ){ this.orient(45); }
		if( window.game.input.checkKey("K_A") && window.game.input.checkKey("K_W") ){ this.orient(315); }
		if( window.game.input.checkKey("K_S") && window.game.input.checkKey("K_A") ){ this.orient(225); }
		if( window.game.input.checkKey("K_D") && window.game.input.checkKey("K_S") ){ this.orient(135); }
		if( window.game.input.checkKey("K_SPACE") ){ this.shoot(); }
	};
	
	this.shoot = function(){
		if( this.shotTimer.isWaitOver() ){
			var b = new Bullet( this.x, this.y, 0, -4, "img/bullet.png", this.rotation, this );
			window.game.bullets.push(b);
			this.shotTimer.startWait( 1000/this.fireRate );
			window.game.soundManager.play("snd/shoot");
		}
	};
}