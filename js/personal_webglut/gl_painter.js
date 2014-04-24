define(['webglut/buffers',
	'webglut/matrices',
	'libs/webgl'],
function(Buffers,Matrices){

	var currentColor = [];
	currentColor = [1,1,1,1];
	
	var currentPrimitive;
	
	var pointsBuffer = [];
	var numberOfPoints = 0;
	
	
	var setDrawColor = function(color)
	{
		currentColor = color;
	}
	
	var begin = function(primitive)
	{
		currentPrimitive = primitive;
		pointsBuffer = [];
		numberOfPoints = 0;
	}
	
	var vertex2d = function(x,y)
	{
		vertex3d(x,y,0.0);
	}
	
	var vertex3d = function(x,y,z)
	{
		pointsBuffer.push(x);
		pointsBuffer.push(y);
		pointsBuffer.push(z);
		numberOfPoints++;
	}
	
	var end = function()
	{
		drawVertices3d(currentPrimitive,pointsBuffer,numberOfPoints);
		pointsBuffer = [];
		numberOfPoints = 0;
	}
	
	var drawVertices3d = function(primitive,vertices,numVertices)
	{
		var colors = [];
		for(var i=0;i<numVertices;i++)
		{
			colors.push(currentColor[0]);
			colors.push(currentColor[1]);
			colors.push(currentColor[2]);
			colors.push(currentColor[3]);
		}
		drawVerticesColor3d(primitive,vertices,colors,numVertices);
	}
	
	var drawVertices2d = function(primitive,vertices,numVertices)
	{
		var colors = [];
		for(var i=0;i<numVertices;i++)
		{
			colors.push(currentColor[0]);
			colors.push(currentColor[1]);
			colors.push(currentColor[2]);
			colors.push(currentColor[3]);
		}
		drawVerticesColor2d(primitive,vertices,colors,numVertices);
	}

	var drawVerticesColor3d = function(primitive,vertices,colors,numVertices)
	{
		var vertexPositionBuffer = new Buffers.GLArrayBuffer(vertices,3,numVertices);
		var vertexColorBuffer = new Buffers.GLArrayBuffer(colors,4,numVertices);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer.content);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer.content);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		Matrices.setMatrixUniforms(gl,shaderProgram);
		gl.drawArrays(primitive, 0, numVertices);
	}
	
	
	var drawVerticesColor2d = function(primitive,vertices,colors,numVertices)
	{
		var vertices3d = [];
		for(var i=0;i<numVertices;i++)
		{
			vertices3d.push(vertices[2*i]);
			vertices3d.push(vertices[(2*i)+1]);
			vertices3d.push(0.0);
		}
		drawVerticesColor3d(primitive,vertices3d,colors,numVertices);
	}

	return{
		begin : begin,
		vertex2d : vertex2d,
		vertex3d : vertex3d,
		end : end,
		setDrawColor : setDrawColor,
		drawVertices2d : drawVertices2d,
		drawVertices3d : drawVertices3d,
		drawVerticesColor3d : drawVerticesColor3d,
		drawVerticesColor2d : drawVerticesColor2d
	};
	
});
