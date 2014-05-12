define(['webglut/gl_module',
	'webglut/shaders_module',
	'webglut/gl_painter',
	'webglut/matrices',
	'webglut/events',
	'elements/polinomios'],
function(GLModule,ShadersModule,GLPainter,Matrices,Events,Polinomio){
	
	var f = function(x)
	{
		return x*x*x;
	}
	
	var updateFunction = function()
	{
		var functionText = document.getElementById("functionValue").value;
		f = function(x)
		{
			return eval(functionText);
		}
		Events.postRedisplay();
	};

	var drawFunction = function()
	{
		var numPontos = 1000;
		var xMin = -1;
		var xMax = 1;
		var dx;
		var x,y;
		dx = (xMax-xMin)/numPontos;
		x=xMin;
		GLPainter.setDrawColor([1,0,0,1]);
		GLPainter.begin(gl.LINE_STRIP);
		for(var i=0;i<numPontos;i++)
		{
			y=f(x);
			GLPainter.vertex2d(x,y);
			x+=dx;
		}
		GLPainter.end();
	}
	
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
		
		drawAxis();
		drawFunction();
	}
	
	var loop = function(timeElapsed)
	{
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
	}

	return{
		initialize: initialize,
		updateFunction : updateFunction
	};
});
