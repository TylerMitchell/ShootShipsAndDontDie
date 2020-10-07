function Timer(){
	
	this.startTime = 0;
	this.pauseTime = 0;
	this.isPaused = false;
	this.elapsedPaused = 0;
	
	this.waitTime = 0;
	
	this.start = function(){ this.startTime = new Date().getTime(); };
	
	this.reset = function(){ this.startTime = new Date().getTime(); };
	
	this.pause = function(){ 
		if(this.isPaused){
			this.elapsedPaused += new Date().getTime() - this.pauseTime; 
			this.isPaused = false;
		}
		else{
			this.pauseTime = new Date().getTime();
			this.isPaused = true;
		}
	};
	
	this.unpause = function(){ this.pause(); };
	
	this.getElapsedTime = function(){
		return (new Date().getTime() - this.startTime) - this.elapsedPaused;
	};
	
	//duration is in milliseconds
	this.startWait = function( duration ){ this.waitTime = duration; this.start(); this.elapsedPaused = 0; };
	
	this.isWaitOver = function(){
		if( this.getElapsedTime() > this.waitTime ){ return true; }
		return false;
	};
	window.game.addTimer(this);
};