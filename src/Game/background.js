Background.Inherits(GameObject);
function Background( startX, startY, imgHandle ){
	this.Inherits(GameObject, startX, startY, imgHandle, "Background");
	this.drawStart(this);
	
	this.cleanup = function(){ this.drawStop(this); };
}