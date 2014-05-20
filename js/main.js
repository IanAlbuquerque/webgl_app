define(['canvas-webgl-utility/canvas-webgl-utility'],
function(CanvasWebGLUtility)
{
	var main_screen;
	var second_screen;
	
	var drawAxis = function(screen)
	{
		screen.setDrawingColor([0,1,0,1]);
		screen.drawVertices2d(screen.LINES,[-1,0,1,0],2);
		
		screen.setDrawingColor([0,0,1,1]);
		screen.drawVertices2d(screen.LINES,[0,-1,0,1],2);
	}

	var clearScreen = function(screen)
	{
		screen.clearColor(0.0, 0.0, 0.0, 1.0);
        	screen.clear(screen.COLOR_BUFFER_BIT | screen.DEPTH_BUFFER_BIT);
	}
	
	var display = function()
	{
		var screen = main_screen;
		
		clearScreen(screen)
		screen.pOrtho(-1,1,-1,1,-1,1);
		screen.mvLoadIdentity();
		screen.mvPushMatrix();
			drawAxis(screen);
		screen.mvPopMatrix();	
	}
	
	var second_display = function()
	{
		var screen = second_screen;
		
		clearScreen(screen)
		screen.pOrtho(-1,1,-1,1,-1,1);
		screen.mvLoadIdentity();
		screen.mvPushMatrix();
			screen.mvRotate(Math.PI/4,[0,0,1]);
			drawAxis(screen);
		screen.mvPopMatrix();	
	}
	
	var main = function()
	{
	
		try
		{
			var canvas = document.getElementById("main-canvas");
			main_screen = new CanvasWebGLUtility(canvas);
		
			var canvas2 = document.getElementById("second-canvas");
			second_screen = new CanvasWebGLUtility(canvas2);
		}
		catch(e)
		{
			alert(e.name + " : " + e.message);
		}

		main_screen.setDisplayFunction(display);
		main_screen.initializeMainLoop();

		second_screen.setDisplayFunction(second_display);
		second_screen.initializeMainLoop();
	}
	
	return { main : main }
});
