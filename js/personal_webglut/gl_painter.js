define(['webglut/buffers',
		'webglut/matrices',
		'libs/webgl'],
function(Buffers,Matrices){

	var drawVerticesColor3d = function(gl,shaderProgram,primitive,vertices,colors,numVertices)
	{
		Buffers.initialize(gl);
		var vertexPositionBuffer = new Buffers.GLArrayBuffer(vertices,3,numVertices);
		var vertexColorBuffer = new Buffers.GLArrayBuffer(colors,4,numVertices);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer.content);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer.content);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		Matrices.setMatrixUniforms(gl,shaderProgram);
		gl.drawArrays(primitive, 0, numVertices);
	}
	
	
	var drawVerticesColor2d = function(gl,shaderProgram,primitive,vertices,colors,numVertices)
	{
		Buffers.initialize(gl);
		var vertices3d = [];
		for(var i=0;i<numVertices;i++)
		{
			vertices3d.push(vertices[2*i]);
			vertices3d.push(vertices[(2*i)+1]);
			vertices3d.push(0.0);
		}
		drawVerticesColor3d(gl,shaderProgram,primitive,vertices3d,colors,numVertices);
	}

	return{
		drawVerticesColor3d : drawVerticesColor3d,
		drawVerticesColor2d : drawVerticesColor2d
	};
	
});
