define(['canvas-webgl-utility/canvas-webgl-utility',
	'app-classes/function-r2',
	'app-classes/implicit-curve'],
function(CanvasWebGLUtility,FunctionR2,ImplicitCurve)
{
	var primary_screen;
	var secondary_screen;

	var my_function = new FunctionR2(-1,1,"Math.sin(x*50)*x");
	var my_function_discretization_points = 1000;
	var my_function_drawing_vertices = my_function.generateDrawingVertices(my_function_discretization_points);

	var my_implicit_curve = new ImplicitCurve(-1,1,-1,1,"x*x+2*y*y-0.5");
	var my_implicit_curve_discretization_points = 15;
	var my_implicit_curve_drawing_vertices = my_implicit_curve.generateDrawingVertices(my_implicit_curve_discretization_points,my_implicit_curve_discretization_points);
	
	var secondary_screen_angle=20;

	function drawAxis(screen)
	{
		screen.setDrawingColor([0,1,0,1]);
		screen.drawVertices3d(screen.LINES,[-1,0,0,1,0,0],2);
		
		screen.setDrawingColor([0,0,1,1]);
		screen.drawVertices3d(screen.LINES,[0,-1,0,0,1,0],2);

		screen.setDrawingColor([1,0,0,1]);
		screen.drawVertices3d(screen.LINES,[0,0,-1,0,0,1],2);
	}

	function drawCube(screen)
	{
		screen.setDrawingColor([0.5,0.3,0.8,1]);
		screen.beginDrawing(screen.LINE_STRIP);
			screen.pushVertex3d(-1, -1, -1);
			screen.pushVertex3d(1, -1, -1);
			screen.pushVertex3d(1, -1, 1);
			screen.pushVertex3d(-1, -1, 1);
			screen.pushVertex3d(-1, -1, -1);
			screen.pushVertex3d(-1, 1, -1);
			screen.pushVertex3d(1, 1, -1);
			screen.pushVertex3d(1, -1, -1);
			screen.pushVertex3d(1, 1, -1);
			screen.pushVertex3d(1, 1, 1);
			screen.pushVertex3d(1, -1, 1);
			screen.pushVertex3d(1, 1, 1);
			screen.pushVertex3d(-1, 1, 1);
			screen.pushVertex3d(-1, -1, 1);
			screen.pushVertex3d(-1, 1, 1);
			screen.pushVertex3d(-1, 1, -1);
		screen.endDrawing();
	}

	function drawSphere(screen)
	{
		screen.setDrawingColor([1,0.5,0.5,1]);
		var r = 1;
		var increase = 0.1;
		for(var theta=0;theta<=Math.PI;theta+=increase)
		{
			screen.beginDrawing(screen.LINE_LOOP);
			for(var psi=0;psi<=2*Math.PI;psi+=increase)
			{
				screen.pushVertex3d(r*Math.sin(theta)*Math.cos(psi),r*Math.sin(theta)*Math.sin(psi),r*Math.cos(theta));
			}
			screen.endDrawing();
		}
	}

	function clearScreen(screen)
	{
		screen.clearColor([1.0, 1.0, 1.0, 1.0]);
        screen.clear(screen.COLOR_BUFFER_BIT | screen.DEPTH_BUFFER_BIT);
	}
	
	function drawMyFunction(screen)
	{
		var discretization_number_of_points = 100;
		screen.setDrawingColor([1,0,0,1]);
		screen.drawVertices2d(screen.LINE_STRIP,my_function_drawing_vertices,my_function_discretization_points);
	}
	
	function drawMyImplicitCurve(screen)
	{
		var discretization_number_of_points = 10;
		screen.setDrawingColor([1,0,1,1]);
		screen.drawVertices2d(screen.LINES,my_implicit_curve_drawing_vertices,my_implicit_curve_discretization_points*my_implicit_curve_discretization_points);
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

	var angle_x=0;
	var angle_y=0;
	function third_display()
	{
		var screen = third_screen;
		clearScreen(screen)
		screen.pSetPerspective(45,screen.viewport.width/screen.viewport.height,1,10);
		screen.mvLoadIdentity();
		screen.mvTranslate([0,0,-5]);
		screen.mvPushMatrix();
			screen.mvRotate(angle_y,[1,0,0]);
			screen.mvRotate(angle_x,[0,0,1]);
			screen.mvRotate(angle_y,[1,0,0]);
			drawCube(screen);
		screen.mvPopMatrix();
		screen.mvPushMatrix();
			screen.mvRotate(angle_y,[1,0,0]);
			screen.mvRotate(angle_x,[0,0,1]);
			screen.mvRotate(angle_y,[1,0,0]);
			drawAxis(screen);
			drawSphere(screen);
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

	function third_loop(time_elapsed_in_milliseconds)
	{
		var screen = third_screen;
		if(!is_button_pressed_3rd_screen)
		{
			var angular_speed = Math.PI/4; // Radians per second.
			angle_x += angular_speed*time_elapsed_in_milliseconds/1000; 
			angle_x = (angle_x)%(2*Math.PI);
			angle_y += angular_speed*time_elapsed_in_milliseconds/1000; 
			angle_y = (angle_y)%(2*Math.PI);
		}
		screen.postRedisplay();
	}
	
	function primary_mouse_down(button,x_percentage,y_percentage)
	{
	
		switch(button)
		{
			case primary_screen.MOUSE_LEFT_BUTTON:
				alert(x_percentage+" "+y_percentage+" LEFT");
				break;
			case primary_screen.MOUSE_RIGHT_BUTTON:
				alert(x_percentage+" "+y_percentage+" RIGHT");
				break;
			case primary_screen.MOUSE_MIDDLE_BUTTON:
				alert(x_percentage+" "+y_percentage+" MIDDLE");
				break;
			default:
				alert(x_percentage+" "+y_percentage+" ???");
				break;	
		}
	}
	
	var is_button_pressed_3rd_screen = false;
	var last_x_position;
	var last_y_position;
	function third_mouse_down(button,x_percentage,y_percentage)
	{
		last_x_position = x_percentage;
		last_y_position = y_percentage;
		is_button_pressed_3rd_screen = true;
	}
	
	function third_mouse_up(button,x_percentage,y_percentage)
	{
		is_button_pressed_3rd_screen = false;
	}
	
	function third_mouse_move(x_percentage,y_percentage)
	{
		if(is_button_pressed_3rd_screen)
		{
			angle_y += (y_percentage-last_y_position)*2*Math.PI;
			angle_x += (x_percentage-last_x_position)*2*Math.PI;
		}
		last_x_position = x_percentage;
		last_y_position = y_percentage;
	}

	function main()
	{
		try
		{
			var primary_canvas = document.getElementById("primary-canvas");
			primary_screen = new CanvasWebGLUtility(primary_canvas);
		
			var secondary_canvas = document.getElementById("secondary-canvas");
			secondary_screen = new CanvasWebGLUtility(secondary_canvas);

			var third_canvas = document.getElementById("third-canvas");
			third_screen = new CanvasWebGLUtility(third_canvas);
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

		third_screen.setDisplayFunction(third_display);
		third_screen.setLoopFunction(third_loop);
		third_screen.setMouseButtonDownFunction(third_mouse_down);
		third_screen.setMouseButtonUpFunction(third_mouse_up);
		third_screen.setMouseMoveFunction(third_mouse_move);
		third_screen.initializeMainLoop();
	}
	
	return { main : main }
});
