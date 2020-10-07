/*
	TODO: Implement Object Pooling
	TODO: Implement QuadTree collision broadphase
	TODO: Implement State Manager
	TODO: Abstract the asset loading code in the Game object into an AssetManager class.
	TODO: Add bullet hell boss fights at specified scores.
	TODO: Make it so that enemies don't fly over eachother.
*/

function AssetManager(){


	this.load = function( images, sounds ){
		var handleToImage = {};
		var handleToSound = {};
		var len = images.length;
		
		var txt = new Text(300, 200, "Game Loading...");
		var meter = new Meter(99, 150, 240, "#FF0000", 300, 40, "left");
		meter.setCurrent(0);
		window.game.screen.draw();
		
		for( var a = 0; a < len; a++ ){
			var t = new Image();
			t.onload = (function(len){ 
				total = 0;
				return function(){
					total++;
					meter.setCurrent( total*(99/(images.length+sounds.length) ) );
					window.game.screen.draw();
					if( total == len ){ 
						window.game.imagesLoaded = true; 
						if( window.game.soundsLoaded ){ 
							txt.remove();
							meter.remove();
							window.game.start(); 
						}
					}
				}
			})(len);
			t.src = images[a];
			handleToImage[ images[a] ] = t;
		}
		len += sounds.length;
		for( var s = 0; s < sounds.length; s++ ){
			var t = new Audio();
			var ext = t.canPlayType('audio/mpeg;');
			if( t.canPlayType('audio/ogg; codecs="vorbis"') == "probably" ){ ext = ".ogg"; }
			else if( t.canPlayType("audio/mpeg;") == "probably" ){ ext = ".mp3"; }
			if( ext != ".ogg" || ".mp3" ){
				if( t.canPlayType('audio/ogg; codecs="vorbis"') == "maybe" ){ ext = ".ogg"; }
				else if( t.canPlayType("audio/mpeg;") == "maybe" ){ ext = ".mp3"; }
			}
			t.addEventListener("canplaythrough", (function(len){ 
				total = 0;
				return function(){
					total++;
					meter.setCurrent( total*(99/(images.length+sounds.length) ) );
					window.game.screen.draw();
					if( total == len ){ 
						window.game.soundsLoaded = true; 
						if( game.imagesLoaded ){ 
							txt.remove();
							meter.remove();
							window.game.start(); 
						}
					}
				}
			})(len));
			t.src = sounds[s] + ext;
			t.load();
			handleToSound[ sounds[s] ] = t;
		}
		for (var img in window.game.screen.imageHandles) { 
			if( window.game.screen.imageHandles.hasOwnProperty(img) ){ handleToImage[img] = window.game.screen.imageHandles[img]; }
		}
		window.game.screen.imageHandles = handleToImage;
		window.game.soundManager.soundHandles = handleToSound;
	};
	
}

function Game(){
	this.imagesLoaded = 0;
	this.soundsLoaded = 0;
	
	this.input = new InputManager();
	this.collisionManager = new CollisionManager();
	
	this.input.registerKey("K_P", true);
	this.input.registerKey("K_M", true);
	this.input.registerKey("K_ENTER");
	this.muteToggle = false;
	
	this.screen = new RenderManager( 600, 400 );
	this.soundManager = new SoundManager();
	this.assetManager = new AssetManager();
	this.player = 0;
	this.numEnemies = 10;
	this.enemies = [];
	this.fleets = [];
	this.bullets = [];
	this.powerups = [];
	this.timers = [];
	this.paused = false;
	
	this.fleetOptions = {
		configs : [["vertical", 0.5], ["horizontal", 1]],
		patterns : [["swayX", 0.1, [0, 1]], ["swayY", 0.2, [1, 0]], ["lineDown", 0.6, [0, 1]], ["lineRight", 0.8, [1, 0]], ["lineLeft", 1, [-1, 0]]]
	};
	
	this.powerupOptions = ["health","speed","firerate"];
	this.numFleets = 2;
	
	this.background = 0;
	
	this.score = 0;
	this.scoreBoard = 0;
	
	this.healthBoard = 0;
	this.healthMeter = 0;
	
	this.state = "Title";
	this.transitionTimer = 0;
	this.cleanup = false;
	
	//this is called by the init function once all assets are laoded.
	this.start = function(){ 
		this.transitionTimer = new Timer();
		this.background = new Background(0, 0, "img/titleScreen.png");
		requestAnimFrame( this.mainLoop.bind(this) );
	};
	
	//increments the score and redraws the scoreboard
	this.addPoints = function(p){ 
		this.score += p; 
		this.scoreBoard.setText("Score: " + this.score); 
		if( this.score % 20 == 0 ){ this.powerups.push( new Powerup( this.powerupOptions[ Math.floor( Math.random()*this.powerupOptions.length ) ] ) ); }
		if( this.score > 74 && this.score % 25 == 0 ){ this.numFleets = Math.floor(this.score / 25); }
	};
	
	this.addTimer = function( timer ){ this.timers.push(timer); };
	
	this.removeEnemy = function(enemy){ this.enemies.splice(this.enemies.indexOf(enemy), 1); };
	this.removeBullet = function(bullet){ this.bullets.splice(this.bullets.indexOf(bullet), 1); };
	this.removeFleet = function(fleet){ this.fleets.splice(this.fleets.indexOf(fleet), 1); };
	
	this.pauseGame = function(){
		if( !this.paused ){
			var i = 0;
			for( ; i < this.timers.length; i++ ){
				this.timers[i].pause();
			}
			this.soundManager.pauseAll();
			this.paused = true;
		}
	};
	this.unpauseGame = function(){
		if( this.paused ){
			var i = 0;
			for( ; i < this.timers.length; i++ ){
				this.timers[i].unpause();
			}
			this.soundManager.unpauseAll();
			this.paused = false;
		}
	};
	
	//This is called first and loads all the assets and sends them to their proper managers.
	this.init = function( images, sounds ){
		this.assetManager.load(images, sounds);
	};
	
	//once objects leave the screen they never come back on,
	//so this function checks that and gets rid of all the associated data when an object leaves the screen.
	this.screenTest = function(){
		var i = 0;
		for( ; i < this.bullets.length; i++){
			if( !this.screen.inScreen( this.bullets[i] ) ){ this.bullets[i].die(); }
		}
		i = 0;
		for( ; i < this.enemies.length; i++){
			if( !this.screen.inScreen( this.enemies[i] ) ){ this.enemies[i].cleanup(); }
		}
		i = 0;
		for( ; i < this.powerups.length; i++){
			if( !this.screen.inScreen( this.powerups[i] ) ){ this.powerups[i].cleanup(); }
		}
	};
	
	this.updateBullets = function(){
		var i = 0;
		for( ; i < this.bullets.length; i++){
			this.bullets[i].move();
			this.bullets[i].resolveCollisions();
		}
		i = 0;
		for( ; i < this.bullets.length; i++){
			if( !this.bullets[i].live ){ 
				this.removeBullet( this.bullets[i] ); 
			}
		}
	};
	
	this.updateEnemies = function(){
		var i = 0;
		for( ; i < this.enemies.length; i++){
			this.enemies[i].think();
			this.enemies[i].resolveCollisions();
		}
		var i = 0;
		for( ; i < this.enemies.length; i++){
			if( !this.enemies[i].live ){ this.removeEnemy( this.enemies[i] ); }
		}
	};
	
	this.updatePowerups = function(){
		var i = 0;
		for( ; i < this.powerups.length; i++){
			this.powerups[i].move();
			this.powerups[i].resolveCollisions();
		}
	};
	
	this.updateFleets = function(){
		var i = 0;
		for( ; i < this.fleets.length; i++){
			this.fleets[i].update();
			if( !this.fleets[i].hasShips() ){ this.removeFleet( this.fleets[i] ); }
		}
	};
	
	//This is where fleets are created and their movement patterns are chosen.
	this.enemyGenerator = function(){
		if( this.fleets.length < this.numFleets ){
			var rand = function(max){ return Math.floor( Math.random()*max ) };
			var findChoice = function(arr){ 
				var i = 0
				var total = 0; 
				var r = Math.random(); 
				for( ; i < arr.length; i++ ){
					total = arr[i][1];
					if(r < total){ return arr[i][0]; }
				} 
			};
			var conf = findChoice( this.fleetOptions.configs );
			var pat = findChoice( this.fleetOptions.patterns );
			var ships = rand(3)+3;
			var x = 0;
			var y = 0;
			var fleetWidth = (this.screen.getImageWidth("img/enemy.png")*ships);
			var fleetHeight = (this.screen.getImageHeight("img/enemy.png")*ships);
			for(var i = 0; i < this.fleetOptions.patterns.length; i++){ 
				if( this.fleetOptions.patterns[i][0] == pat ){ 
					if( this.fleetOptions.patterns[i][2][0] == 1 ){ 
						x = -1*(this.screen.getImageWidth("img/enemy.png")*ships);
						y = rand( this.screen.getHeight() - fleetHeight);
					} 
					if( this.fleetOptions.patterns[i][2][0] == -1 ){ 
						x = this.screen.getWidth();
						y = rand( this.screen.getHeight() - fleetHeight);
					} 
					if( this.fleetOptions.patterns[i][2][1] == 1 ){ 
						x = rand( this.screen.getWidth() - fleetWidth );
						y = -1*(this.screen.getImageHeight("img/enemy.png")*ships);;
					} 
				} 
			}
			this.fleets.push( new Fleet( x, y, conf, ships, pat, this.player) );
		}
	};
	
	//this is called every frame. It is my temporary state manager. Needs to be refactored.
	this.mainLoop = function(){
		requestAnimFrame( this.mainLoop.bind(this) );
		if( this.state == "Title" ){ this.titleState(); }
		else if( this.state == "Instructions" ){ this.instructionsState(); }
		else if( this.state == "Main" ){ this.mainState(); }
		else if( this.state == "Credits" ){ this.creditsState(); }
	};
	
	this.titleState = function(){
		this.screen.draw();
		if( this.input.checkKey("K_ENTER") && this.transitionTimer.isWaitOver() ){ 
			this.background.cleanup();
			this.background = new Background(0, 0, "img/instructionsScreen.png");
			this.transitionTimer.startWait(1000); 
			this.state = "Instructions"; 
		}
	};
	
	this.instructionsState = function(){
		this.screen.draw();
		if( this.input.checkKey("K_ENTER") && this.transitionTimer.isWaitOver() ){ 
			this.background.cleanup();
			this.background = new Background(0, 0, "img/background.png");
			var i = 0;
		
			this.score = 0;
			this.scoreBoard = new Text(0, 0, "Score: " + this.score);
			
			this.numFleets = 2;
			this.player = new Player( 300, 350, "img/player.png" );
			this.player.registerInputs();
			
			this.healthBoard = new Text(450, 0, "Health: " + this.player.health);
			
			this.soundManager.play("snd/background", "loop");
			this.state = "Main"; 
			this.input.registerMouse();
		}
	};
	
	this.mainState = function(){
		//move this kind of toggle to input manager
		if( this.input.checkKey("K_M") ){ 
			if( !this.muteToggle ){ this.soundManager.mute("snd/background"); this.muteToggle = !this.muteToggle; }
		}
		else{ if( this.muteToggle ){ this.soundManager.mute("snd/background"); this.muteToggle = !this.muteToggle; } }
		
		if( this.input.checkKey("K_P") ){ this.pauseGame();}
		else{ this.unpauseGame(); }
		if( !this.paused ){
			this.enemyGenerator();
			this.player.update();
			this.screenTest();
			this.updateBullets();
			this.updateEnemies();
			this.updateFleets();
			this.updatePowerups();
			this.collisionManager.check();
			this.screen.draw();
		}
		if( this.cleanup ){ this.mainCleanup(); }
	};
	
	this.mainCleanup = function(){
		var i = 0;
		for( ; i < this.enemies.length; i++){ this.enemies[i].cleanup(); }
		this.enemies = [];
		i = 0;
		for( ; i < this.bullets.length; i++){ this.bullets[i].unTrack(this.bullets[i]); }
		this.bullets = [];
		this.timers = [];
		this.soundManager.pause("snd/background");
		this.state = "Credits";
		this.background.cleanup();
		this.background = new Background(0, 0, "img/creditsScreen.png");
		this.finalText = new Text(200, 350, "Final Score: " + this.score);
		this.cleanup = false;
	};
	
	this.creditsState = function(){
		this.screen.draw();
		if( this.input.checkKey("K_ENTER") ){ 
			this.transitionTimer.startWait(1000); this.state = "Title";
			this.background.cleanup();
			this.finalText.remove();
			this.background = new Background(0, 0, "img/titleScreen.png");
		}
	};
}

window.onload = function(){
	var images = ["img/player.png", "img/enemy.png", "img/bullet.png", 
				  "img/speed.png", "img/health.png", "img/firerate.png",
				  "img/titleScreen.png", "img/instructionsScreen.png", "img/creditsScreen.png", "img/background.png"];
	var sounds = ["snd/shoot", "snd/explode", "snd/powerup", "snd/background"];
	window.game = new Game();
	window.game.init( images, sounds );
};
