define(['webglut/buffers',
	'webglut/drawings',
	'webglut/events',
	'webglut/matrices',
	'webglut/shader-handling',
	'webglut/exceptions/canvas-webgl-context-not-found-exception'],
function(Buffers,Drawings,Events,Matrices,ShanderHandling,CanvasWebGLContextNotFoundException)
{
	
	function Viewport(canvas)
	{
		this.width = canvas.width;
		this.height = canvas.height;
		
		var canvasBoundingRectangle = canvas.getBoundingClientRect();
		
		this.top = canvasBoundingRectangle.top;
		this.bottom = canvasBoundingRectangle.bottom;
		this.left = canvasBoundingRectangle.left;
		this.right = canvasBoundingRectangle.right;
	}
	
	function CanvasWebGLUtility(_canvas)
	{
		this.canvas = _canvas;
		
		this.viewport = new Viewport(_canvas);
		
		try
		{
			this.webgl_context = this.canvas.getContext("webgl");
		}
		catch(exception)
		{
			throw new CanvasWebGLContextNotFoundException();
			return;
		}
		
		try
		{
			this.shader_program = this.webgl_context.createProgram();
			ShanderHandling.setUpShaderProgram(this.webgl_context,this.shader_program);
		}
		catch(exception)
		{
			throw exception;
			return;
		}
		
	}
	
	return CanvasWebGLUtility;
}
