define(['canvas-webgl-utility/handlers/drawings-handler',
'canvas-webgl-utility/handlers/events-handler',
'canvas-webgl-utility/handlers/matrices-handler',
'canvas-webgl-utility/handlers/shaders-handler',
'canvas-webgl-utility/exceptions/canvas-webgl-context-not-found-exception',
'canvas-webgl-utility/utility/viewport'],
function(DrawingsHandler,EventsHandler,MatricesHandler,ShandersHandler,CanvasWebGLContextNotFoundException,Viewport)
{

	function CanvasWebGLUtility(_canvas)
	{
		var that = this;

		that.canvas = _canvas;
		
		that.viewport = new Viewport(that.canvas);
		
		that.shaders_handler = new ShandersHandler();
		
		try
		{
			that.webgl_context = that.canvas.getContext("webgl");
		}
		catch(exception)
		{
			throw new CanvasWebGLContextNotFoundException();
		}
		
		that.webgl_context.viewport(0, 0, that.webgl_context.drawingBufferWidth, that.webgl_context.drawingBufferHeight);
		
		try
		{
			that.shader_program = that.webgl_context.createProgram();
			that.shaders_handler.setUpShaderProgram(that.webgl_context,that.shader_program);
		}
		catch(exception)
		{
			throw exception;
		}
		
		that.drawings_handler = new DrawingsHandler();
		that.events_handler = new EventsHandler(that.viewport);
		that.matrices_handler = new MatricesHandler();

		that.pushVertex2d = that.drawings_handler.pushVertex2d;
		that.pushVertex3d = that.drawings_handler.pushVertex3d;
		that.setDrawingColor = that.drawings_handler.setDrawingColor;
		that.beginDrawing = function(primitive)
		{
			that.drawings_handler.setDrawingColor(that.webgl_context,that.shader_program,primitive);
		}
		that.endDrawing = function()
		{
			that.matrices_handler.setMatrixUniforms(that.webgl_context,that.shader_program);
			that.drawings_handler.endDrawing();
		}
		that.drawVertices3d = function(primitive,vertices,number_of_vertices)
		{
			that.matrices_handler.setMatrixUniforms(that.webgl_context,that.shader_program);
			that.drawings_handler.drawVertices3d(that.webgl_context,that.shader_program,primitive,vertices,number_of_vertices);
		}
		that.drawVertices2d = function(primitive,vertices,number_of_vertices)
		{
			that.matrices_handler.setMatrixUniforms(that.webgl_context,that.shader_program);
			that.drawings_handler.drawVertices2d(that.webgl_context,that.shader_program,primitive,vertices,number_of_vertices);
		}
		that.drawVerticesColor3d = function(primitive,vertices,colors,number_of_vertices)
		{
			that.matrices_handler.setMatrixUniforms(that.webgl_context,that.shader_program);
			that.drawings_handler.drawVerticesColor3d(that.webgl_context,that.shader_program,primitive,vertices,colors,number_of_vertices);
		}
		that.drawVerticesColor2d = function(primitive,vertices,colors,number_of_vertices)
		{
			that.matrices_handler.setMatrixUniforms(that.webgl_context,that.shader_program);
			that.drawings_handler.drawVerticesColor2d(that.webgl_context,that.shader_program,primitive,vertices,colors,number_of_vertices);
		}
		
		that.mvPushMatrix = that.matrices_handler.mvPushMatrix;
		that.mvPopMatrix = that.matrices_handler.mvPopMatrix;
		that.mvLoadIdentity = that.matrices_handler.mvLoadIdentity;
		that.pLoadIdentity = that.matrices_handler.pLoadIdentity;
		that.pSetPerspective = that.matrices_handler.pSetPerspective;
		that.mvTranslate = that.matrices_handler.mvTranslate;
		that.mvScale = that.matrices_handler.mvScale;
		that.mvRotate = that.matrices_handler.mvRotate;
		that.pOrtho = that.matrices_handler.pOrtho;
		
		that.setDisplayFunction = that.events_handler.setDisplayFunction;
		that.setLoopFunction = that.events_handler.setLoopFunction;
		that.postRedisplay = that.events_handler.postRedisplay;
		that.initializeMainLoop = that.events_handler.initializeMainLoop;
		that.setMouseButtonDownFunction = function(_mouse_button_down_function)
		{
			that.events_handler.setMouseButtonDownFunction(that.canvas,_mouse_button_down_function);
		}
		that.setMouseButtonUpFunction = that.events_handler.setMouseButtonUpFunction;
		that.setMouseMoveFunction = function(_mouse_move_function)
		{
			that.events_handler.setMouseMoveFunction(that.canvas,_mouse_move_function);
		}
		
		that.COLOR_BUFFER_BIT = that.webgl_context.COLOR_BUFFER_BIT;
		that.DEPTH_BUFFER_BIT = that.webgl_context.DEPTH_BUFFER_BIT;
		that.clear = function(clear_elements)
		{
			that.webgl_context.clear(clear_elements);
		}
		that.clearColor = function(color)
		{
			that.webgl_context.clearColor(color[0],color[1],color[2],color[3]);
		}
		that.LINES = that.webgl_context.LINES;
		that.LINE_STRIP = that.webgl_context.LINE_STRIP;
		that.POINTS = that.webgl_context.POINTS;
	}
	
	return CanvasWebGLUtility;
});

