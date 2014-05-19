define(['canvas-webgl-utility/canvas-webgl-utility'],
function(CanvasWebGLUtility)
{
	var main_screen;
	var second_screen;
	
	var drawAxis = function()
	{
		// X Axe
		main_screen.setDrawingColor([0,1,0,1]);
		main_screen.drawVertices2d(main_screen.webgl_context.LINES,[-1,0,1,0],2);
		
		//Y Axe
		main_screen.setDrawingColor([0,0,1,1]);
		main_screen.drawVertices2d(main_screen.webgl_context.LINES,[0,-1,0,1],2);
	}
	
	var drawAxis2 = function()
	{
		// X Axe
		second_screen.setDrawingColor([0,1,0,1]);
		second_screen.drawVertices2d(second_screen.webgl_context.LINES,[-1,0,1,0],2);
		
		//Y Axe
		second_screen.setDrawingColor([0,0,1,1]);
		second_screen.drawVertices2d(second_screen.webgl_context.LINES,[0,-1,0,1],2);
	}
	
	var display = function()
	{
		main_screen.webgl_context.clearColor(0.0, 0.0, 0.0, 1.0);
        	main_screen.webgl_context.clear(main_screen.webgl_context.COLOR_BUFFER_BIT | main_screen.webgl_context.DEPTH_BUFFER_BIT);

		main_screen.pOrtho(-1,1,-1,1,-1,1);
		main_screen.mvLoadIdentity();
			
		main_screen.mvPushMatrix();

			drawAxis();

		main_screen.mvPopMatrix();	
	}
	
	var display2 = function()
	{
		second_screen.webgl_context.clearColor(0.0, 0.0, 0.0, 1.0);
        	second_screen.webgl_context.clear(second_screen.webgl_context.COLOR_BUFFER_BIT | second_screen.webgl_context.DEPTH_BUFFER_BIT);

		second_screen.pOrtho(-1,1,-1,1,-1,1);
		second_screen.mvLoadIdentity();
			
		second_screen.mvPushMatrix();
		second_screen.mvRotate(30,[0,0,1]);

			drawAxis2();

		second_screen.mvPopMatrix();	
	}
	
	var loop = function(timeElapsed)
	{
	
	}
	
	var main = function()
	{
	
		var canvas = document.getElementById("main-canvas");
		main_screen = new CanvasWebGLUtility(canvas);
		
		var canvas2 = document.getElementById("second-canvas");
		second_screen = new CanvasWebGLUtility(canvas2);

		main_screen.setDisplayFunction(display);
		main_screen.setLoopFunction(loop);
		main_screen.initializeMainLoop();

		second_screen.setDisplayFunction(display2);
		second_screen.setLoopFunction(loop);
		second_screen.initializeMainLoop();
	}
	
	return { main : main }
});
