function Fleet( x, y, configuration, numShips, pattern, target){
	this.ships = [];
	this.trackedShips = [];
	
	this.shipWidth = window.game.screen.getImageWidth("img/enemy.png");
	this.shipHeight = window.game.screen.getImageHeight("img/enemy.png");
	
	this.x = x;
	this.y = y;
	
	this.pattern = pattern;
	
	this.target = target;
	
	this.init = function(config, x, y){
		var i = 0;
		for( ; i < numShips; i++ ){ 
			if( config == "horizontal" ){ this.ships.push( new Enemy(x + (this.shipWidth*i), y, "img/enemy.png", this) ); }
			if( config == "vertical" ){ this.ships.push( new Enemy(x, y + (this.shipHeight*i), "img/enemy.png", this) ); }
			this.ships[i].unTrack(this.ships[i]);
			this.ships[i].live = true;
			this.trackedShips.push(false);
		}
	};
	
	this.think = function(ship){
		if( ship === undefined){
			console.log("ah shit!");
		}
		if( this.pattern == "swayX" ){
			ship.y += ship.speed;
			ship.x = ship.origX + Math.round( 50*Math.sin( ship.y / 40 ) );
			ship.rect.move(ship.x, ship.y);
		}
		else if( this.pattern == "swayY" ){
			ship.x += ship.speed;
			ship.y = ship.origY + Math.round( 50*Math.sin( ship.x / 40 ) );
			ship.rect.move(ship.x, ship.y);
		}
		else if( this.pattern == "lineDown" ){
			ship.y += ship.speed;
			ship.rect.move(ship.x, ship.y);
		}
		else if( this.pattern == "lineRight" ){
			ship.x += ship.speed;
			ship.rect.move(ship.x, ship.y);
		}
		else if( this.pattern == "lineLeft" ){
			ship.x -= ship.speed;
			ship.rect.move(ship.x, ship.y);
		}
		else if( this.pattern == "randomWalk" ){
		
		}
		else if( this.pattern == "randomLine" ){
		
		}
		else if( this.pattern == "still" ){
		
		}
		if( this.trackedShips[this.ships.indexOf(ship)] ){
			ship.face(this.target);
			if( Math.random() < 0.005 ){ ship.shoot(); }
		}
	};
	
	this.remove = function(ship){ var ind = this.ships.indexOf(ship); this.ships.splice( ind, 1); this.trackedShips.splice(ind, 1); };
	this.hasShips = function(){ return (this.ships.length > 0); };
	
	this.update = function(){
		var i = 0;
		for( ; i < this.ships.length; i++){
			if( !this.trackedShips[i] ){ 
				this.think(this.ships[i]); 
				if( window.game.screen.inScreen(this.ships[i]) ){ 
					this.ships[i].track(this.ships[i]); 
					window.game.enemies.push(this.ships[i]); 
					this.trackedShips[i] = true;
				}
			}
		}
	};
	
	this.init(configuration, x, y);
}