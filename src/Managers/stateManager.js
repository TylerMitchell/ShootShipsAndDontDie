//TODO: Implement this
function StateManager(){
	this.states = [];
	this.currentState = -1;
	
	this.pause = function(){};
	this.resume = function(){};
	
	this.init = function(){ this.states[this.currentState].init(); };
	this.update = function(){ this.states[this.currentState].update(); };
	this.cleanup = function(){ this.states[this.currentState].cleanup(); };
	
	this.push = function(state){ this.states.push(state); };
	this.pop = function(){ this.states.pop(); };
	this.changeState = function(name){
		if( this.currentState != -1 ){ this.states[this.currentState].cleanup(); }
		for(var i = 0; i < this.states.length; i++){ if( this.states[i].name == name ){ this.currentState = i; } }
		this.states[this.currentState].init();
	};
	
	this.quit = function(){ this.states[this.currentState].cleanup(); };
}

function State(name){
	this.name = name;
	
	this.pause = 0;
	this.resume = 0;
	
	this.init = 0;
	this.update = 0;
	this.cleanup = 0;
}