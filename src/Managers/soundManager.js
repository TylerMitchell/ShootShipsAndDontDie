/*
	The SoundManager class holds all the audio files in the game and controls them.
*/
function SoundManager(){
	
	//This object associates file names with actual sound objects. It is filled by the loader.
	this.soundHandles = {};
	
	//Holds the names of sound files that are were paused.
	this.wasPlaying = [];
	
	this.play = function(key, type){
		if(type == "loop"){ this.soundHandles[key].loop = true; }
		this.soundHandles[key].currentTime = 0;
		this.soundHandles[key].play();
	};
	
	this.pause = function(key){ this.soundHandles[key].pause(); };
	this.unpause = function(key){ this.soundHandles[key].play(); };
	this.mute = function(key){ this.soundHandles[key].muted = !this.soundHandles[key].muted; };
	
	//pauseAll and unpauseAll are generally only called when the game is put in a paused state.
	this.pauseAll = function(){
		for( var s in this.soundHandles ){
			if( this.soundHandles.hasOwnProperty(s) && !this.soundHandles[s].paused ){ 
				this.soundHandles[s].pause(); this.wasPlaying.push(s); 
			}
		}
	};
	
	this.unpauseAll = function(){
		for( var s = 0; s < this.wasPlaying.length; s++ ){
			this.soundHandles[this.wasPlaying[s]].play(); 
		}
		this.wasPlaying = [];
	};
}