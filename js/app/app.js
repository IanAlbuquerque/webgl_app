define(['webglut/gl_module',
	'webglut/shaders_module',
	'webglut/gl_painter',
	'webglut/matrices',
	'webglut/events',
	'elements/polinomios',
	'elements/functionR2',
	'elements/implicitCurve'],
function(GLModule,ShadersModule,GLPainter,Matrices,Events,Polinomio,FunctionR2,ImplicitCurve){


	var resetScreenButton = function()
	{
		resetScreen();
		Events.postRedisplay();
	}	
	
	var resetScreen = function()
	{
		screen.left = -1;
		screen.right = 1;
		screen.top = 1;
		screen.bottom = -1;
	}
	
	var screen = [];
	resetScreen();
	
	var myFunction = new FunctionR2(screen.left,screen.right,500,"Math.sin(1/x)*x");
	var myCurve = new ImplicitCurve(screen.left,screen.right,screen.bottom,screen.top,20,"x*x+y*y-1");
	
	var updateFunction = function()
	{
		var functionText = document.getElementById("functionValue").value;
		myFunction.setF(functionText);
		Events.postRedisplay();
	};
	
	var updateImplicitCurve = function()
	{
		var equationText = document.getElementById("implicitCurveValue").value;
		myCurve.setEquation(equationText);
		Events.postRedisplay();
	};
	
	var drawAxis = function()
	{
		// X Axe
		GLPainter.setDrawColor([0,1,0,1]);
		GLPainter.drawVertices2d(gl.LINES,[screen.left,0,screen.right,0],2);
		
		//Y Axe
		GLPainter.setDrawColor([0,0,1,1]);
		GLPainter.drawVertices2d(gl.LINES,[0,screen.bottom,0,screen.top],2);
	}
	
	/* Draws grid with cell spacing equal to delta */
	var drawGrid = function(delta)
	{
		var xstart = Math.floor(screen.left/delta)*delta;
		var xend = Math.floor(screen.right/delta)*delta;
		var ystart = Math.floor(screen.bottom/delta)*delta;
		var yend = Math.floor(screen.top/delta)*delta;
		GLPainter.begin(gl.LINES);
		
		// To avoid computing a grid that won't be visible, do nothing if too many cells are requested
		if((xend - xstart)/delta > 500) return;
		if((yend - ystart)/delta > 500) return;
		
		for(var x=xstart;x<=xend;x+=delta)
		{
			GLPainter.vertex2d(x,screen.bottom);
			GLPainter.vertex2d(x,screen.top);
		}
		
		for(var y=ystart;y<=yend;y+=delta)
		{
			GLPainter.vertex2d(screen.left,y);
			GLPainter.vertex2d(screen.right,y);
		}
		
		GLPainter.end();
	}
	
	var display = function()
	{
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		Matrices.pOrtho(screen.left,screen.right,screen.bottom,screen.top,-1,1);
		Matrices.mvLoadIdentity();
			
		Matrices.mvPushMatrix();
		
			GLPainter.setDrawColor([0.2,0.2,0.2,1]);
			drawGrid(0.1);
			GLPainter.setDrawColor([0.3,0.3,0.3,1]);
			drawGrid(0.5);
			GLPainter.setDrawColor([0.5,0.5,0.5,1]);
			drawGrid(1);
			
			drawAxis();
		
			
			myFunction.setDomain(screen.left,screen.right);
			var functionPoints = myFunction.calculateDrawingPoints();
			GLPainter.setDrawColor([1,0,1,1]);
			GLPainter.drawVertices2d(gl.LINE_STRIP,functionPoints,functionPoints.length/2);
					
			
			myCurve.setDomain(screen.left,screen.right,screen.bottom,screen.top);
			var curvePoints = myCurve.calculateDrawingPoints();
			GLPainter.setDrawColor([1,0,0,1]);
			GLPainter.drawVertices2d(gl.LINES,curvePoints,curvePoints.length/2);
		
		
		Matrices.mvPopMatrix();	
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
		return convertXToScreenPercentage(x)*(screen.right-screen.left)-screen.left;
	}
	function convertYToScreen(y)
	{
		return -(convertYToScreenPercentage(y)*(screen.top-screen.bottom)-screen.bottom);
	}
	
	var lastMouseX = 0;
	var lastMouseY = 0;
	var newX = 0;
	var newY = 0;
	var mouseDown = false;
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
	}

	function handleMouseMove(event)
	{
		if (!mouseDown)
		{
			return;
		}

		newX = event.pageX;
		newY = event.pageY;

		var deltaX = convertXToScreen(newX) - convertXToScreen(lastMouseX);
		screen.left -= deltaX;
		screen.right -= deltaX;

		var deltaY = convertYToScreen(newY) - convertYToScreen(lastMouseY);
		screen.top -= deltaY;
		screen.bottom -= deltaY;

		lastMouseX = newX;
		lastMouseY = newY;
		
		Events.postRedisplay();
	}
	
	function handleKeyDown(event)
	{
		/* Press R to reset
		if(event.keyCode == 82) 
		{
			resetScreen();
		}
		Events.postRedisplay();
		*/
	}
	
	function handleMouseScroll(event)
	{	
		if(event.pageX<gl.viewPortLeft || event.pageX>gl.viewPortRight) return;
		if(event.pageY<gl.viewPortTop || event.pageY>gl.viewPortBottom) return;
		 
		var scrollInfo = event.wheelDelta || -event.detail;
		var delta = 0;
		if(scrollInfo < 0) delta = -1;
		if(scrollInfo > 0) delta = 1;
		
		var screenScale = delta/10;
		var screenXGrowth = (screenScale)*(screen.right - screen.left);
		var screenYGrowth = (screenScale)*(screen.top - screen.bottom);
		var deltaX = screenXGrowth/2.0;
		var deltaY = screenYGrowth/2.0;
		screen.left += deltaX;
		screen.right -= deltaX;
		
		screen.bottom += deltaY;
		screen.top -= deltaY;
		
		Events.postRedisplay();
	}
	
	var initialize = function(canvas)
	{
		GLModule.initialize(canvas);
		ShadersModule.initialize();

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		
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
		updateFunction : updateFunction,
		updateImplicitCurve : updateImplicitCurve,
		resetScreenButton : resetScreenButton
	};
});
