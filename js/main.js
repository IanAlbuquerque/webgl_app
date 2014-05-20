define(['canvas-webgl-utility/canvas-webgl-utility'],
function(CanvasWebGLUtility)
{
	var primary_screen;
	var secondary_screen;
	
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
		var screen = primary_screen;
		
		clearScreen(screen)
		screen.pOrtho(-1,1,-1,1,-1,1);
		screen.mvLoadIdentity();
		screen.mvPushMatrix();
			drawAxis(screen);
		screen.mvPopMatrix();	
	}
	
	var second_display = function()
	{
		var screen = secondary_screen;
		
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
			var primary_canvas = document.getElementById("primary-canvas");
			primary_screen = new CanvasWebGLUtility(primary_canvas);
		
			var secondary_canvas = document.getElementById("secondary-canvas");
			secondary_screen = new CanvasWebGLUtility(secondary_canvas);
		}
		catch(e)
		{
			alert(e.name + " : " + e.message);
		}

		primary_screen.setDisplayFunction(display);
		primary_screen.initializeMainLoop();

		secondary_screen.setDisplayFunction(second_display);
		secondary_screen.initializeMainLoop();
	}
	
	return { main : main }
});
