define(['webglut/gl_module',
	'webglut/shaders_module',
	'webglut/gl_painter',
	'webglut/matrices',
	'webglut/events',
	'elements/polinomios',
	'elements/functionR2'],
function(GLModule,ShadersModule,GLPainter,Matrices,Events,Polinomio,FunctionR2){

	var myFunction = new FunctionR2(-1,1,400,"Math.sin(x*100)*x");
	
	var updateFunction = function()
	{
		var functionText = document.getElementById("functionValue").value;
		myFunction.setF(functionText);
		Events.postRedisplay();
	};
	
	var drawAxis = function()
	{
		// X Axe
		GLPainter.setDrawColor([0,1,0,1]);
		GLPainter.drawVertices2d(gl.LINES,[-1,0,1,0],2);
		
		//Y Axe
		GLPainter.setDrawColor([0,0,1,1]);
		GLPainter.drawVertices2d(gl.LINES,[0,-1,0,1],2);
	}
	
	var display = function()
	{
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		Matrices.mvLoadIdentity();
			
		Matrices.mvPushMatrix();
			Matrices.mvScale([scale,scale,scale]);
			Matrices.mvTranslate(translation);
		
			drawAxis();
		
			GLPainter.setDrawColor([1,0,1,1]);
			myFunction.draw();
		
		Matrices.mvPopMatrix();
		
		if(mouseDown)
		{
			GLPainter.setDrawColor([1,0,0,1]);
			GLPainter.drawVertices2d(gl.LINES,[convertXToScreen(lastMouseX),convertYToScreen(lastMouseY),convertXToScreen(newX),convertYToScreen(newY)],2);
		}
		
	}
	
	var translation = [0,0,0];
	var loop = function(timeElapsed)
	{
	
	}
	
	function convertXToScreenPercentage(x)
	{
		return (x-gl.viewPortLeft)/(gl.viewPortRight - gl.viewPortLeft);
	}
	function convertYToScreenPercentage(y)
	{
		return (y-gl.viewPortTop)/(gl.viewPortBottom - gl.viewPortTop);
	}
	function convertXToScreen(x)
	{
		return convertXToScreenPercentage(x)*2-1;
	}
	function convertYToScreen(y)
	{
		return -(convertYToScreenPercentage(y)*2-1);
	}
	
	var lastMouseX = 0;
	var lastMouseY = 0;
	var newX = 0;
	var newY = 0;
	var mouseDown = false;
	var scale = 1;
	function handleMouseDown(event)
	{
		mouseDown = true;
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;
		newX = lastMouseX;
		newY = lastMouseY;
		Events.postRedisplay();
	}

	function handleMouseUp(event)
	{
		mouseDown = false;

		newX = event.pageX;
		newY = event.pageY;

		var deltaX = convertXToScreen(newX) - convertXToScreen(lastMouseX);
		translation[0] += deltaX/scale;

		var deltaY = convertYToScreen(newY) - convertYToScreen(lastMouseY);
		translation[1] += deltaY/scale;

		lastMouseX = newX
		lastMouseY = newY;
		
		Events.postRedisplay();
	}

	function handleMouseMove(event)
	{
		if (!mouseDown)
		{
			return;
		}
		
		newX = event.pageX;
		newY = event.pageY;
		
		Events.postRedisplay();
	}
	
	function handleKeyDown(event)
	{
		if(event.keyCode == 37) 
		{
			scale *= 1.1;
		}
		else if(event.keyCode == 39)
		{
			scale *= 0.9;
		}
		Events.postRedisplay();
	}
	
	function handleMouseScroll(event)
	{	
	
		var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
		scale *= 1+(delta/10);
		Events.postRedisplay();
	}
	
	var initialize = function(canvas)
	{
		GLModule.initialize(canvas);
		ShadersModule.initialize();

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		Matrices.pOrtho(-1,1,-1,1,-1,1);
		
		Events.setDisplayFunction(display);
		Events.setLoopFunction(loop);
		Events.initialize();
		
		//alert(gl.viewPortTop);	
		//alert(gl.viewPortBottom);
		//alert(gl.viewPortLeft);
		//alert(gl.viewPortRight);
		
		canvas.onmousedown = handleMouseDown;
		document.onmouseup = handleMouseUp;
		document.onmousemove = handleMouseMove;
		document.addEventListener('keydown', handleKeyDown);
		
		document.onmousewheel = handleMouseScroll;
    		document.addEventListener('DOMMouseScroll',handleMouseScroll,false);
	}

	return{
		initialize: initialize,
		updateFunction : updateFunction
	};
});
