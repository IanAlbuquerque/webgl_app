define(['canvas-webgl-utility/drawings-handler',
	'canvas-webgl-utility/events-handler',
	'canvas-webgl-utility/matrices-handler',
	'canvas-webgl-utility/shaders-handler',
	'canvas-webgl-utility/exceptions/canvas-webgl-context-not-found-exception'],
function(DrawingsHandler,EventsHandler,MatricesHandler,ShandersHandler,CanvasWebGLContextNotFoundException)
{
	function Viewport(canvas)
	{
		var object = this;
		
		object.width = canvas.width;
		object.height = canvas.height;
		
		var canvasBoundingRectangle = canvas.getBoundingClientRect();
		
		object.top = canvasBoundingRectangle.top;
		object.bottom = canvasBoundingRectangle.bottom;
		object.left = canvasBoundingRectangle.left;
		object.right = canvasBoundingRectangle.right;
	}
	
	function CanvasWebGLUtility(_canvas)
	{
		var object = this;
		
		object.canvas = _canvas;
		
		object.viewport = new Viewport(object.canvas);
		
		object.shaders_handler = new ShandersHandler();
		
		try
		{
			object.webgl_context = object.canvas.getContext("webgl");
		}
		catch(exception)
		{
			throw new CanvasWebGLContextNotFoundException();
		}
		
		object.webgl_context.viewport(0, 0, object.webgl_context.drawingBufferWidth, object.webgl_context.drawingBufferHeight);
		
		try
		{
			object.shader_program = object.webgl_context.createProgram();
			object.shaders_handler.setUpShaderProgram(object.webgl_context,object.shader_program);
		}
		catch(exception)
		{
			throw exception;
		}
		
		object.drawings_handler = new DrawingsHandler();
		object.events_handler = new EventsHandler();
		object.matrices_handler = new MatricesHandler();
		object.drawVertex2d = object.drawings_handler.drawVertex2d;
		object.drawVertex3d = object.drawings_handler.drawVertex3d;
		object.setDrawingColor = object.drawings_handler.setDrawingColor;
		object.beginDrawing = function(primitive)
		{
			object.drawings_handler.setDrawingColor(object.webgl_context,object.shader_program,primitive);
		}
		object.endDrawing = function()
		{
			object.matrices_handler.setMatrixUniforms(object.webgl_context,object.shader_program);
			object.drawings_handler.endDrawing();
		}
		object.drawVertices3d = function(primitive,vertices,number_of_vertices)
		{
			object.matrices_handler.setMatrixUniforms(object.webgl_context,object.shader_program);
			object.drawings_handler.drawVertices3d(object.webgl_context,object.shader_program,primitive,vertices,number_of_vertices);
		}
		object.drawVertices2d = function(primitive,vertices,number_of_vertices)
		{
			object.matrices_handler.setMatrixUniforms(object.webgl_context,object.shader_program);
			object.drawings_handler.drawVertices2d(object.webgl_context,object.shader_program,primitive,vertices,number_of_vertices);
		}
		object.drawVerticesColor3d = function(primitive,vertices,colors,number_of_vertices)
		{
			object.matrices_handler.setMatrixUniforms(object.webgl_context,object.shader_program);
			object.drawings_handler.drawVerticesColor3d(object.webgl_context,object.shader_program,primitive,vertices,colors,number_of_vertices);
		}
		object.drawVerticesColor2d = function(primitive,vertices,colors,number_of_vertices)
		{
			object.matrices_handler.setMatrixUniforms(object.webgl_context,object.shader_program);
			object.drawings_handler.drawVerticesColor2d(object.webgl_context,object.shader_program,primitive,vertices,colors,number_of_vertices);
		}
		
		object.mvPushMatrix = object.matrices_handler.mvPushMatrix;
		object.mvPopMatrix = object.matrices_handler.mvPopMatrix;
		object.mvLoadIdentity = object.matrices_handler.mvLoadIdentity;
		object.pLoadIdentity = object.matrices_handler.pLoadIdentity;
		object.pSetPerspective = object.matrices_handler.pSetPerspective;
		object.mvTranslate = object.matrices_handler.mvTranslate;
		object.mvScale = object.matrices_handler.mvScale;
		object.mvRotate = object.matrices_handler.mvRotate;
		object.pOrtho = object.matrices_handler.pOrtho;
		
		object.setDisplayFunction = object.events_handler.setDisplayFunction;
		object.setLoopFunction = object.events_handler.setLoopFunction;
		object.postRedisplay = object.events_handler.postRedisplay;
		object.initializeMainLoop = object.events_handler.initializeMainLoop;
	}
	
	return CanvasWebGLUtility;
});
