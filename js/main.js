define(['canvas-webgl-utility/canvas-webgl-utility',
	'app-classes/function-r2',
	'app-classes/implicit-curve'],
function(CanvasWebGLUtility,FunctionR2,ImplicitCurve)
{
	var primary_screen;
	var secondary_screen;

	var my_function = new FunctionR2(-1,1,"Math.sin(x*50)*x");
	var my_function_disc_points = 1000;
	var my_function_drawing_vertices = my_function.generateDrawingVertices(my_function_disc_points);

	var my_implicit_curve = new ImplicitCurve(-1,1,-1,1,"x*x+2*y*y-0.5");
	var my_implicit_curve_disc_points = 15;
	var my_implicit_curve_drawing_vertices = my_implicit_curve.generateDrawingVertices(my_implicit_curve_disc_points,my_implicit_curve_disc_points);
	
	var secondary_screen_angle=20;

	function drawAxis(screen)
	{
		screen.setDrawingColor([0,1,0,1]);
		screen.drawVertices2d(screen.LINES,[-1,0,1,0],2);
		
		screen.setDrawingColor([0,0,1,1]);
		screen.drawVertices2d(screen.LINES,[0,-1,0,1],2);
	}

	function clearScreen(screen)
	{
		screen.clearColor([0.0, 0.0, 0.0, 1.0]);
        screen.clear(screen.COLOR_BUFFER_BIT | screen.DEPTH_BUFFER_BIT);
	}
	
	function drawMyFunction(screen)
	{
		var discretization_number_of_points = 100;
		screen.setDrawingColor([1,0,0,1]);
		screen.drawVertices2d(screen.LINE_STRIP,my_function_drawing_vertices,my_function_disc_points);
	}
	
	function drawMyImplicitCurve(screen)
	{
		var discretization_number_of_points = 10;
		screen.setDrawingColor([1,0,1,1]);
		screen.drawVertices2d(screen.LINES,my_implicit_curve_drawing_vertices,my_implicit_curve_disc_points*my_implicit_curve_disc_points);
	}

	function primary_display()
	{
		var screen = primary_screen;
		clearScreen(screen)
		screen.pOrtho(-1,1,-1,1,-1,1);
		screen.mvLoadIdentity();
		screen.mvPushMatrix();
			drawAxis(screen);
			drawMyFunction(screen);
			drawMyImplicitCurve(screen);
		screen.mvPopMatrix();	
	}
	
	function secondary_display()
	{
		var screen = secondary_screen;
		clearScreen(screen)
		screen.pOrtho(-1,1,-1,1,-1,1);
		screen.mvLoadIdentity();
		screen.mvPushMatrix();
			screen.mvPushMatrix();
				screen.mvRotate(-secondary_screen_angle,[0,0,1]);
				drawAxis(screen);
			screen.mvPopMatrix();	
			screen.mvRotate(secondary_screen_angle,[0,0,1]);
			drawMyFunction(screen);
			screen.mvPushMatrix();
				screen.mvRotate(secondary_screen_angle,[1,1,1]);
				drawMyImplicitCurve(screen);
			screen.mvPopMatrix();
		screen.mvPopMatrix();	
	}

	function secondary_loop(time_elapsed_in_milliseconds)
	{
		var screen = secondary_screen;
		var angular_speed = Math.PI/4; // Radians per second.
		secondary_screen_angle += angular_speed*time_elapsed_in_milliseconds/1000; 
		secondary_screen_angle = (secondary_screen_angle)%(2*Math.PI);
		screen.postRedisplay();
	}
	
	function primary_mouse_down(button,x_percentage,y_percentage)
	{
		alert(x_percentage+" "+y_percentage);
	}

	function main()
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

		primary_screen.setDisplayFunction(primary_display);
		primary_screen.setMouseButtonDownFunction(primary_mouse_down);
		primary_screen.initializeMainLoop();

		secondary_screen.setDisplayFunction(secondary_display);
		secondary_screen.setLoopFunction(secondary_loop);
		secondary_screen.initializeMainLoop();
	}
	
	return { main : main }
});
