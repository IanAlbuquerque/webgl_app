define(['canvas-webgl-utility/canvas-webgl-utility',
		'app-classes/marching-cubes-handler'],
function(CanvasWebGLUtility,MarchingCubesHandler)
{

	function evaluationFunction(x,y,z)
	{
		//TORO:
		//var LHS = x*x+y*y+z*z+1-0.2;LHS*=LHS;return LHS-4*x*x-4*y*y;
		
		//return z-x*x;
		return x*x-y*y+z*z-1;
		//return x*x+y*y-z*z-1;
		//return x*x-y*y-z;
	}

	var marching_cubes_handler = new MarchingCubesHandler();
	var surface = marching_cubes_handler.marchingTetrahedron(evaluationFunction);

	function drawSurface()
	{
		if(!surface) return;
		scene.setDrawingColor([0.5,0,0.5,1]);
		//alert(surface);
		scene.drawVertices3d(scene.LINES,surface,surface.length/3);
	}
	function drawAxis()
	{
		scene.setDrawingColor([1,0,0,1]);
		scene.drawVertices3d(scene.LINES,[-1.5,0,0,1.5,0,0],2);
		
		scene.setDrawingColor([0,1,0,1]);
		scene.drawVertices3d(scene.LINES,[0,-1.5,0,0,1.5,0],2);

		scene.setDrawingColor([0,0,1,1]);
		scene.drawVertices3d(scene.LINES,[0,0,-1.5,0,0,1.5],2);
	}

	function drawCube()
	{
		scene.setDrawingColor([0.5,0.3,0.8,1]);
		scene.beginDrawing(scene.TRIANGLES);
			scene.pushVertex3d(1, 1, 1);
			scene.pushVertex3d(1, -1, 1);
			scene.pushVertex3d(1, 1, -1);

			scene.pushVertex3d(1, -1, -1);
			scene.pushVertex3d(1, -1, 1);
			scene.pushVertex3d(1, 1, -1);
		scene.endDrawing();
		scene.setDrawingColor([1,0.3,0.8,1]);
		scene.beginDrawing(scene.TRIANGLES);
			scene.pushVertex3d(-1, 1, 1);
			scene.pushVertex3d(-1, -1, 1);
			scene.pushVertex3d(-1, 1, -1);

			scene.pushVertex3d(-1, -1, -1);
			scene.pushVertex3d(-1, -1, 1);
			scene.pushVertex3d(-1, 1, -1);
		scene.endDrawing();
		scene.setDrawingColor([1,0.7,0.2,1]);
		scene.beginDrawing(scene.TRIANGLES);
			scene.pushVertex3d(1, 1, 1);
			scene.pushVertex3d(-1, 1, 1);
			scene.pushVertex3d(1, 1, -1);

			scene.pushVertex3d(-1, 1, -1);
			scene.pushVertex3d(-1, 1, 1);
			scene.pushVertex3d(1, 1, -1);
		scene.endDrawing();
		scene.setDrawingColor([1,0.7,1,1]);
		scene.beginDrawing(scene.TRIANGLES);
			scene.pushVertex3d(1, -1, 1);
			scene.pushVertex3d(-1, -1, 1);
			scene.pushVertex3d(1, -1, -1);

			scene.pushVertex3d(-1, -1, -1);
			scene.pushVertex3d(-1, -1, 1);
			scene.pushVertex3d(1, -1, -1);
		scene.endDrawing();
		scene.setDrawingColor([0.4,0.7,1,1]);
		scene.beginDrawing(scene.TRIANGLES);
			scene.pushVertex3d(1, 1, 1);
			scene.pushVertex3d(-1, 1, 1);
			scene.pushVertex3d(1, -1, 1);

			scene.pushVertex3d(-1, -1, 1);
			scene.pushVertex3d(-1, 1, 1);
			scene.pushVertex3d(1, -1, 1);
		scene.endDrawing();
		scene.setDrawingColor([0,1,0,1]);
		scene.beginDrawing(scene.TRIANGLES);
			scene.pushVertex3d(1, 1, -1);
			scene.pushVertex3d(-1, 1, -1);
			scene.pushVertex3d(1, -1, -1);

			scene.pushVertex3d(-1, -1, -1);
			scene.pushVertex3d(-1, 1, -1);
			scene.pushVertex3d(1, -1, -1);
		scene.endDrawing();
	}

	function clearScreen()
	{
		scene.clearColor([1.0, 1.0, 1.0, 1.0]);
        scene.clear(scene.COLOR_BUFFER_BIT | scene.DEPTH_BUFFER_BIT);
	}

	var first_angle=0;
	var second_angle=Math.PI/6;
	var third_angle=0;
	function display()
	{
		scene.pSetPerspective(45,scene.viewport.width/scene.viewport.height,1,50);
		scene.mvLoadIdentity();
		scene.mvTranslate([0,0,-10]);
		scene.mvPushMatrix();
			scene.mvRotate(third_angle,[0,0,1]);
			scene.mvRotate(second_angle,[0,1,0]);
			scene.mvRotate(first_angle,[0,0,1]);
			//drawCube();
			drawAxis();
			drawSurface();
		scene.mvPopMatrix();	
	}

	function loop(time_elapsed_in_milliseconds)
	{
		if(!is_button_pressed)
		{
			var angular_speed = Math.PI/8; // Radians per second.
			first_angle += angular_speed*time_elapsed_in_milliseconds/1000; 
			first_angle = (first_angle)%(2*Math.PI);

			second_angle += angular_speed*time_elapsed_in_milliseconds/1000; 
			second_angle = (second_angle)%(2*Math.PI);

			third_angle += angular_speed*time_elapsed_in_milliseconds/1000; 
			third_angle = (third_angle)%(2*Math.PI);
		}
		scene.postRedisplay();
	}

	var is_button_pressed = false;
	var mouse_last_x;
	var mouse_last_y;
	function mouseDown(button,x_percentage,y_percentage)
	{
		mouse_last_x = x_percentage;
		mouse_last_y = y_percentage;
		is_button_pressed = true;
	}
	
	function mouseUp(button,x_percentage,y_percentage)
	{
		is_button_pressed = false;
	}
	
	function mouseMove(x_percentage,y_percentage)
	{
		if(is_button_pressed)
		{
			first_angle += (x_percentage-mouse_last_x)*2*Math.PI;
			second_angle += (y_percentage-mouse_last_y)*2*Math.PI;
			third_angle += (x_percentage-mouse_last_x)*2*Math.PI;
		}
		mouse_last_x = x_percentage;
		mouse_last_y = y_percentage;
	}

	function main()
	{
		try
		{
			var canvas = document.getElementById("marching_cube_canvas");
			scene = new CanvasWebGLUtility(canvas);
		}
		catch(e)
		{
			alert(e.name + " : " + e.message);
		}

		scene.enable(scene.DEPTH_TEST);

		scene.setDisplayFunction(display);
		scene.setLoopFunction(loop);
		scene.setMouseButtonDownFunction(mouseDown);
		scene.setMouseButtonUpFunction(mouseUp);
		scene.setMouseMoveFunction(mouseMove);

		scene.initializeMainLoop();
	}
	
	return { main : main }
});
