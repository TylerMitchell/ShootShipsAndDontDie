function CollisionManager(){
	
	this.objects = [];
	
	this.add = function(obj){ this.objects.push(obj); };
	this.remove = function(obj){ this.objects.splice(this.objects.indexOf(obj), 1); };
	
	this.check = function(){
		//bubblecheck for now
		var i = 0;
		var j = 1;
		for( ; i < this.objects.length; i++){
			j = i+1;
			for( ; j < this.objects.length; j++){
				if( this.AABB( this.objects[i].rect, this.objects[j].rect ) ){
					//alert colliding objects
					this.objects[i].hit.push(this.objects[j]);
					this.objects[j].hit.push(this.objects[i]);
				}
			}
		}
	};
	
	this.broadPhase = function(){};
	
	this.AABB = function(r1,r2){
		return !(r1.left > r2.right ||
				r1.bottom < r2.top ||
				r1.top > r2.bottom ||
				r1.right < r2.left)
	};
	
	this.circle = function(c1,c2){
		var dist = c1.r + c2.r;
		var dx = c1.cx - c2.cx;
		var dy = c1.cy - c2.cy;
		dist *= dist;
		dx *= dx;
		dy *= dy;
		if( dist > (dx+dy) ){ return true; }
		return false;
	};
	
	this.circleRect = function(c, r){
		
	};
}