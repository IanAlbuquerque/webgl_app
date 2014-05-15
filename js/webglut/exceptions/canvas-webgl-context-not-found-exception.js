define(function()
{
	function CanvasWebGLContextNotFoundException()
	{
	    this.name = "Canvas WebGL Context Not Found";
	    this.message = "It was not possible to retrieve a WebGL context from the requested canvas.";
	}
	
	return CanvasWebGLContextNotFoundException;
}
