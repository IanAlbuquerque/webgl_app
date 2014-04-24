define(['webglut/gl_module',
	'webglut/shaders_module',
	'webglut/gl_painter',
	'webglut/matrices',
	'webglut/events',
	'elements/polinomios'],
function(GLModule,ShadersModule,GLPainter,Matrices,Events,Polinomios){

	var angle=0;
	var polinomio = new Polinomios.Polinomio(-1,1,400,[0,0,0,1,1]);
	var der = polinomio.derivative();
	
	var display = function()
	{

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		Matrices.mvLoadIdentity();
		
		/*
		// Eixo X
		GLPainter.setDrawColor([0,1,0,1]);
		GLPainter.drawVertices2d(gl.LINES,[-1,0,1,0],2);
		
		//Eixo y
		GLPainter.setDrawColor([0,0,1,1]);
		GLPainter.drawVertices2d(gl.LINES,[0,-1,0,1],2);
		*/
		
		GLPainter.setDrawColor([0,1,0,1]);
		GLPainter.begin(gl.LINES);
			GLPainter.vertex2d(-1,0);
			GLPainter.vertex2d(1,0);
		GLPainter.end();
		
		GLPainter.setDrawColor([0,0,1,1]);
		GLPainter.begin(gl.LINES);
			GLPainter.vertex2d(0,-1);
			GLPainter.vertex2d(0,1);
			GLPainter.vertex2d(1,0.5);
		GLPainter.end();

		Matrices.mvPushMatrix();
			polinomio.draw();
			der.draw();
		Matrices.mvPopMatrix();
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
		initialize: initialize
	};
});
