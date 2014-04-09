define(['webglut/gl_module',
	'webglut/shaders_module',
	'webglut/gl_painter',
	'webglut/matrices',
	'webglut/events',
	'elements/polinomios',
	'libs/glMatrix',
	'libs/webgl'],
function(GLModule,ShadersModule,GLPainter,Matrices,Events,Polinomios){

	var gl;
	var shaderProgram;
	
	var angle=0;
	var polinomio = new Polinomios.Polinomio(-1,1,400,[0,0,0,1,1]);
	var der = polinomio.derivative();
	
	var display = function()
	{
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		Matrices.mvLoadIdentity();

		//Matrices.mvTranslate([0,0,-5]);
		//Matrices.mvRotate(angle/180*Math.PI,[0,1,0]);
		
		GLPainter.drawVerticesColor2d(gl,shaderProgram,gl.LINES,[-1,0,1,0,0,-1,0,1],[0,1,0,1,0,1,0,1,0,0,1,1,0,0,1,1],4);

		
		Matrices.mvPushMatrix();
			Matrices.mvRotate(angle/180*Math.PI,[0,0,1]);
			polinomio.draw(gl,shaderProgram);
			der.draw(gl,shaderProgram);
		Matrices.mvPopMatrix();
	
	}
	
	var loop = function(timeElapsed)
	{
		angle+=0.5;
		angle = angle%360;
	}
	
	var initialize = function(canvas)
	{
		GLModule.initialize(canvas);
		gl = GLModule.getGL();
		
		ShadersModule.initialize(gl);
		shaderProgram = ShadersModule.getShaderProgram();

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		//Matrices.pSetPerspective(45,gl.viewportWidth/gl.viewportHeight,1,10)
		Matrices.pOrtho(-1,1,-1,1,-1,1);
		
		Events.setDisplayFunction(display);
		Events.setLoopFunction(loop);
		Events.initialize();
		
	}

	return{
		initialize: initialize
	};
});
