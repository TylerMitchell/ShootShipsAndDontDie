function Rect(t,b,l,r){
	this.top = t;
	this.bottom = b;
	this.left = l;
	this.right = r;
	
	this.move = function( l, t ){
		var dl = l - this.left;
		var dt = t - this.top;
		this.top += dt;
		this.bottom += dt;
		this.left += dl;
		this.right += dl;
	};
}