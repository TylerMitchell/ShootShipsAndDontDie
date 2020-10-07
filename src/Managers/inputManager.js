function InputManager(){

	this.keys = { "K_A" : 65, "K_B" : 66, "K_C" : 67, "K_D" : 68, "K_E" : 69, "K_F" : 70, "K_G" : 71,
				  "K_H" : 72, "K_I" : 73, "K_J" : 74, "K_K" : 75, "K_L" : 76, "K_M" : 77, "K_N" : 78,
				  "K_O" : 79, "K_P" : 80, "K_Q" : 81, "K_R" : 82, "K_S" : 83, "K_T" : 84, "K_U" : 85,
				  "K_V" : 86, "K_W" : 87, "K_X" : 88, "K_Y" : 89, "K_Z" : 90,
				  "K_LEFT" : 37, "K_RIGHT" : 39, "K_UP" : 38, "K_DOWN" : 40, "K_SPACE" : 32, "K_CTRL" : 17, "K_ENTER" : 13
	};
	
	this.mouse = {
		"screenLeft" : 0,
		"screenTop" : 0,
		"posX" : 0,
		"posY" : 0,
		"absoluteX" : 0,
		"absoluteY" : 0,
		"mouseIsDown" : false
	};
	
	this.registerMouse = function(){
		document.addEventListener( "mousemove", function(){ 
			return function(event){
					this.mouse["posX"] = event.clientX - this.mouse["screenLeft"];
					this.mouse["posY"] = event.clientY - this.mouse["screenTop"];
					this.mouse["absoluteX"] = event.clientX;
					this.mouse["absoluteY"] = event.clientY;
					//Mouse["camX"] = Mouse["posX"] + cam.cameraOffsetX;
					//Mouse["camY"] = Mouse["posY"] + cam.cameraOffsetY;
				}; 
		}().bind(this), false );
		
		document.addEventListener( "mousedown", function(){ 
			return function(event){
				this.mouse["mouseIsDown"] = true;
			}; 
		}().bind(this), false );
		
		document.addEventListener( "mouseup", function(){ 
			return function(event){
					this.mouse["mouseIsDown"] = false;
					//s.inputMan.clickCheck();
			}; 
		}().bind(this), false );
		
		this.calculateOffsets();
	};
	
	this.registeredKeys = [];
	this.pressedKeys = {};
	
	//toggle is an optional parameter which counts the key as held down until it is pressed again
	this.registerKey = function(key, toggle){ 
		if(typeof toggle === "undefined"){ toggle = false; }
		this.registeredKeys.push(key); this.pressedKeys[key] = [false, toggle, true]; 
	};
	
	this.unregisterKey = function(key){
		this.registeredKeys.splice(key, 1);
		delete this.pressedKeys[key];
	};
	
	this.getMouse = function(){ return this.mouse; };
	this.checkKey = function(key){ return this.pressedKeys[key][0]; };
	
	this.keysdown = function(e){
		var i = 0;
		for( ; i < this.registeredKeys.length; i++ ){
			if( this.keys[ this.registeredKeys[i] ] == e.keyCode ){ 
				if( this.pressedKeys[ this.registeredKeys[i] ][2] ){ this.pressedKeys[ this.registeredKeys[i] ][0] = true; }
				if( this.pressedKeys[ this.registeredKeys[i] ][1] ){ 
					this.pressedKeys[ this.registeredKeys[i] ][2] = !this.pressedKeys[ this.registeredKeys[i] ][2]; 
				}
			}
		}
	};
	
	this.keysup = function(e){
		var i = 0;
		for( ; i < this.registeredKeys.length; i++ ){
			if( this.keys[ this.registeredKeys[i] ] == e.keyCode ){ 
				if( this.pressedKeys[ this.registeredKeys[i] ][2] ){ this.pressedKeys[ this.registeredKeys[i] ][0] = false; }
			}
		}
	};
	
	this.calculateOffsets = function() {
			var canv = window.game.screen.canvas;
			this.mouse["canvasLeft"] = 0;
			this.mouse["canvasTop"] = 0;
			if (canv.offsetParent) {
				do {
					this.mouse["canvasLeft"] += canv.offsetLeft;
					this.mouse["canvasTop"] += canv.offsetTop;
				} while (canv = canv.offsetParent); //if the assignment is successfull the loop will continue
			}
		}
	
	document.addEventListener("keydown", this.keysdown.bind(this) );
	document.addEventListener("keyup", this.keysup.bind(this) );
}