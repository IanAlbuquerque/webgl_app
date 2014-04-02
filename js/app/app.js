define(['webglut/gl_module',
		'webglut/shaders_module',
		'webglut/buffers',
		'libs/glMatrix',
		'libs/webgl'],
function(GLModule,ShadersModule,Buffers){

	var gl;
	var shaderProgram;
	
	var mvMatrix = mat4.create();
	var mvMatrixStack = [];
	var pMatrix = mat4.create();

	function mvPushMatrix() {
		var copy = mat4.create();
		mat4.set(mvMatrix, copy);
		mvMatrixStack.push(copy);
	}

	function mvPopMatrix() {
		if (mvMatrixStack.length == 0) {
		  throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
	}

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }
	
	var initialize = function(canvas)
	{
		GLModule.initialize(canvas);
		gl = GLModule.getGL();
		
		ShadersModule.initialize(gl);
		shaderProgram = ShadersModule.getShaderProgram();
		
		Buffers.initialize(gl);
		
		var triangleVertexPositionBuffer = new Buffers.GLArrayBuffer([
																	0.0,  1.0,  0.0,
																	-1.0, -1.0,  0.0,
																	1.0, -1.0,  0.0
																	],3,3);
		var triangleVertexColorBuffer = new Buffers.GLArrayBuffer([
																	1.0, 0.0, 0.0, 1.0,
																	0.0, 1.0, 0.0, 1.0,
																	0.0, 0.0, 1.0, 1.0
																	],4,3);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

		//----------------
		
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);
		
		mvPushMatrix();
		
			mat4.translate(mvMatrix, [-1.0, 0.0, 0.0]);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer.content);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer.content);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

			setMatrixUniforms();
			gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
		
		mvPopMatrix();
		
	}

	return{
		initialize: initialize
	};
});
