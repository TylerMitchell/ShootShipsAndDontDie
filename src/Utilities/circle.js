function Circle(cx,cy,r){
	this.cx = cx;
	this.cy = cy;
	this.r = r;
	
	this.move = function( l, t ){
		this.cx = l+this.r;
		this.cy = t-this.r;
	};
}