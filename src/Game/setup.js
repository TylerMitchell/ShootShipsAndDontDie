//decide whether to use setTimeout or requestAnimationFrame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

//Some sugar to simulate classical inheritance
Object.prototype.Inherits = function( parent )
{
	if( arguments.length > 1 )
	{
		parent.apply( this, Array.prototype.slice.call( arguments, 1 ) );
	}
	else
	{
		parent.call( this );
	}
}

Function.prototype.Inherits = function( parent )
{
	this.prototype = new parent();
	this.prototype.constructor = this;
}
