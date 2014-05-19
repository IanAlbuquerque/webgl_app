define(['canvas-webgl-utility/canvas-webgl-utility'],
function(CanvasWebGLUtility)
{
	var canvasWebGLUtility;
	
	var drawAxis = function()
	{
		// X Axe
		canvasWebGLUtility.setDrawingColor([0,1,0,1]);
		canvasWebGLUtility.drawVertices2d(canvasWebGLUtility.webgl_context.LINES,[-1,0,1,0],2);
		
		//Y Axe
		canvasWebGLUtility.setDrawingColor([0,0,1,1]);
		canvasWebGLUtility.drawVertices2d(canvasWebGLUtility.webgl_context.LINES,[0,-1,0,1],2);
	}
	
	var display = function()
	{
		canvasWebGLUtility.webgl_context.clearColor(0.0, 0.0, 0.0, 1.0);
        	canvasWebGLUtility.webgl_context.clear(canvasWebGLUtility.webgl_context.COLOR_BUFFER_BIT | canvasWebGLUtility.webgl_context.DEPTH_BUFFER_BIT);

		canvasWebGLUtility.pOrtho(-1,1,-1,1,-1,1);
		canvasWebGLUtility.mvLoadIdentity();
			
		canvasWebGLUtility.mvPushMatrix();

			drawAxis();

		canvasWebGLUtility.mvPopMatrix();	
	}
	
	var loop = function(timeElapsed)
	{
	
	}
	
	var main = function()
	{
	
		var canvas = document.getElementById("main-canvas");
		canvasWebGLUtility = new CanvasWebGLUtility(canvas);

		
		canvasWebGLUtility.setDisplayFunction(display);
		canvasWebGLUtility.setLoopFunction(loop);
		canvasWebGLUtility.initializeMainLoop();
	}
	
	return { main : main }
});
