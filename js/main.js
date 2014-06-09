define(['canvas-webgl-utility/canvas-webgl-utility',
		'app-classes/marching-cubes-handler',
		'app-classes/implicit-curve'],
function(CanvasWebGLUtility,MarchingCubesHandler,ImplicitCurve)
{
	var scene;

	var marching_cubes_handler = new MarchingCubesHandler();
	var surface;
	var distance = 10;

	function evaluationFunction(x,y,z)
	{
		return eval(document.getElementById("surface_string_equation").value);
	}

	function runMarchingCubes()
	{
		var num_points = document.getElementById("n_points").value;
		if(num_points>=20)
		{
			var window_confirmation = confirm("Your choice of "+num_points+" points will\nresult in "+num_points*num_points*num_points+" cubes.\nAre you sure?");
			if (!window_confirmation)
			{
				return;
			}
		}
		surface = marching_cubes_handler.marchingCubes(evaluationFunction,num_points);
	}

	function drawSurface()
	{
		if(!surface) return;
		scene.setDrawingColor([0.5,0,0.5,1]);
		scene.drawVertices3d(scene.LINES,surface,surface.length/3);
	}
	function drawAxis(x_min,x_max,y_min,y_max,z_min,z_max)
	{
		scene.setDrawingColor([1,0,0,1]);
		scene.drawVertices3d(scene.LINES,[x_min,0,0,x_max,0,0],2);
		
		scene.setDrawingColor([0,1,0,1]);
		scene.drawVertices3d(scene.LINES,[0,y_min,0,0,y_max,0],2);

		scene.setDrawingColor([0,0,1,1]);
		scene.drawVertices3d(scene.LINES,[0,0,z_min,0,0,z_max],2);
	}

	function drawCube(x_min,x_max,y_min,y_max,z_min,z_max)
	{	
		var cube_vertices = [[x_min,	y_min,	z_min],
							[x_max,		y_min,	z_min],
							[x_max,		y_max,	z_min],
							[x_min,		y_max,	z_min],
							[x_min,		y_min,	z_max],
							[x_max,		y_min,	z_max],
							[x_max,		y_max,	z_max],
							[x_min,		y_max,	z_max]];
		var vertices = [0,1,2,3,0,4,5,6,7,4,5,1,5,6,2,6,7,3,7];
		scene.setDrawingColor([0.5,0.3,0.8,1]);
		scene.beginDrawing(scene.LINE_STRIP);
			for(var i=0;i<vertices.length;i++)
			{
				scene.pushVertex3d(cube_vertices[vertices[i]][0],cube_vertices[vertices[i]][1],cube_vertices[vertices[i]][2]);
			}
		scene.endDrawing();
		scene.beginDrawing(scene.TRIANGLES);
		scene.setDrawingColor([0.2,0.1,0.2,1]);
			scene.pushVertex3d(1.5*x_min,1.5*y_min,z_min);
			scene.pushVertex3d(1.5*x_max,1.5*y_min,z_min);
			scene.pushVertex3d(1.5*x_max,1.5*y_max,z_min);
			scene.pushVertex3d(1.5*x_min,1.5*y_min,z_min);
			scene.pushVertex3d(1.5*x_max,1.5*y_max,z_min);
			scene.pushVertex3d(1.5*x_min,1.5*y_max,z_min);
		scene.endDrawing();
	}

	function clearScreen()
	{
		scene.clearColor([1, 1, 1, 1]);
        scene.clear(scene.COLOR_BUFFER_BIT | scene.DEPTH_BUFFER_BIT);
	}

	var first_angle=0;
	var second_angle=Math.PI/3;
	var third_angle=Math.PI/2;
	function display()
	{
		clearScreen();
		scene.mvLoadIdentity();
		scene.mvTranslate([0,0,-distance]);
		scene.mvPushMatrix();
			scene.mvRotate(third_angle,[0,0,1]);
			scene.mvRotate(second_angle,[0,1,0]);
			scene.mvRotate(first_angle,[0,0,1]);
			drawCube(-2,2,-2,2,-2,2);
			drawAxis(-4,4,-4,4,-4,4);
			drawSurface();
		scene.mvPopMatrix();	
	}

	function loop(time_elapsedn_milliseconds)
	{
		if(!is_mouse_pressed)
		{
			var angular_speed = Math.PI/8; // Radians per second.

			first_angle += angular_speed*time_elapsedn_milliseconds/1000; 
			first_angle = (first_angle)%(2*Math.PI);
		}
		scene.postRedisplay();
	}

	var is_mouse_pressed = false;
	var mouse_last_x;
	var mouse_last_y;
	function mouseDown(button,x_percentage,y_percentage)
	{
		mouse_last_x = x_percentage;
		mouse_last_y = y_percentage;
		is_mouse_pressed = true;

	}
	
	function mouseUp(button,x_percentage,y_percentage)
	{
		is_mouse_pressed = false;
	}
	
	function mouseMove(x_percentage,y_percentage)
	{
		if(is_mouse_pressed)
		{
			first_angle += (x_percentage-mouse_last_x)*2*Math.PI;
			second_angle += -(y_percentage-mouse_last_y)*2*Math.PI;
		}
		mouse_last_x = x_percentage;
		mouse_last_y = y_percentage;
	}

	function main()
	{
		try
		{
			scene = new CanvasWebGLUtility(document.getElementById("marching_cube_canvas"));
		}
		catch(e)
		{
			alert(e.name + " : " + e.message);
		}

		document.getElementById("marching_cubes_button").onclick = runMarchingCubes;
		document.getElementById("surface_string_equation").onkeydown=function(e){if(e.keyCode==13){runMarchingCubes();}};
		document.getElementById("n_points").onkeydown=function(e){if(e.keyCode==13){runMarchingCubes();}};
		document.getElementById("zoom_bar").oninput=function(){distance =  Math.abs(document.getElementById("zoom_bar").value);};
		runMarchingCubes();

		scene.enable(scene.DEPTH_TEST);
		scene.pSetPerspective(45,scene.viewport.width/scene.viewport.height,1,100);

		scene.setDisplayFunction(display);
		scene.setLoopFunction(loop);
		scene.setMouseButtonDownFunction(mouseDown);
		scene.setMouseButtonUpFunction(mouseUp);
		scene.setMouseMoveFunction(mouseMove);

		scene.initializeMainLoop();
	}
	
	return { main : main }
});
