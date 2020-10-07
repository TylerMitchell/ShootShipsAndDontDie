//TODO: This needs to be implemented
function ObjectPool(){
	this.pools = {};
	
	this.makePool = function( type, num, args ){
		this.pools[type] = [];
		for(var i = 0; i < num; i++){
			this.pools[type].push( new type() );
		}
	};
	
	this.get = function(type){
	};
	
	this.organize = function(){};
};