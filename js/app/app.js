define(['webglut/gl_module',
		'webglut/shaders_module',
		'webglut/gl_painter',
		'webglut/matrices',
		'libs/glMatrix',
		'libs/webgl'],
function(GLModule,ShadersModule,GLPainter,Matrices){

	var gl;
	var shaderProgram;
	
	var initialize = function(canvas)
	{
		GLModule.initialize(canvas);
		gl = GLModule.getGL();
		
		ShadersModule.initialize(gl);
		shaderProgram = ShadersModule.getShaderProgram();
		
		var vertices =[];
		var colors =[]
		
		var dx;
		var x,y;
		var xmax=1;
		var xmin=-1;
		var numpontos=400;
		dx = (xmax-xmin)/numpontos;
		x=xmin;
		for(var i=0;i<numpontos;i++)
		{
			y=Math.sin(x*10*Math.PI)*x;
			vertices.push(x);
			vertices.push(y);
			colors.push(1.0);
			colors.push(0.0);
			colors.push(0.0);
			colors.push(1.0);
			x+=dx;
		}
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //gl.enable(gl.DEPTH_TEST);

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //Matrices.pSetPerspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		//Matrices.pLoadIdentity();
		Matrices.pOrtho(-1,1,-1,1,-1,1);

        Matrices.mvLoadIdentity();
        //Matrices.mvTranslate([0.0, 0.0, -5.0]);
		
		//Desenha eixos
		GLPainter.drawVerticesColor2d(gl,shaderProgram,gl.LINES,[-1,0,1,0,0,-1,0,1],[0,1,0,1,0,1,0,1,0,0,1,1,0,0,1,1],4);
			
		Matrices.mvPushMatrix();
			Matrices.mvRotate(45/180*Math.PI,[0,0,1]);
			GLPainter.drawVerticesColor2d(gl,shaderProgram,gl.LINE_STRIP,vertices,colors,numpontos);
		Matrices.mvPopMatrix();
		
	}

	return{
		initialize: initialize
	};
});
