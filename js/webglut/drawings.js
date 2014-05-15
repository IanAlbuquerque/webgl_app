/**
* @fileoverview
* Defines the module that is responsible for the drawing methods.
*/

/**
* The module that is responsible for the drawing methods.
* @namespace webglut/gl_painter
*/

define(['webglut/buffers',
	'webglut/matrices'],
/** @lends webglut/gl_painter */ 
function(Buffers,Matrices){

	/**
	* The current color being utilized for the drawings.
	* @private
	* @type {number[]}
	* @default [1,1,1,1]
	*/
	var currentColor = [];
	currentColor = [1,1,1,1];

	/**
	* The current GL primitive being utilized for the drawings.
	* @private
	* @type {GLPrimitive}
	*/
	var currentPrimitive;
	
	/**
	* The entries of the vertices being kept on the buffer before being drawn.
	* @private
	* @type {number[]}
	*/
	var pointsBuffer = [];
	
	/**
	* Number of vertices being kept in buffer.
	* @private
	* @type {number}
	*/
	var numberOfPoints = 0;

	/**
	* Sets the current color being used for the drawings.
	* @param {number[]} color The new color to be utilized for the drawing. Uses the RBGA system. Expects 4 numbers between or equal to 0 and 1 representing the colors Red, Green, Blue and the opacity Alpha, in this order.
	* @public
	* @example
	*	// Sets the current drawing color to red.
	* 	GLPainter.setDrawColor([1,0,0,1]);
	*	// Sets the current drawing color to blue.
	* 	GLPainter.setDrawColor([0,0,1,1]);
	*	// Sets the current drawing color to green.
	* 	GLPainter.setDrawColor([0,1,0,1]);
	*	// Sets the current drawing color to pink.
	* 	GLPainter.setDrawColor([1,0,1,1]);
	*	// Sets the current drawing color to grey.
	* 	GLPainter.setDrawColor([0.5,0.5,0.5,1]);
	*
	*
	* @example
	*	// Sets the current drawing color to red.
	* 	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Begin drawing a line
	*	GLPainter.begin(gl.LINES);
	*		// Adds first vertex (-1,0) to the buffer
	*		GLPainter.vertex2d(-1,0);
	*		// Adds second vertex (1,0) to the buffer
	*		GLPainter.vertex2d(1,0);
	*	// Finishes drawing the line (actually, only after this line of code the line is drawn)
	*	GLPainter.end();
	*
	*/
	var setDrawColor = function(color)
	{
		currentColor = color;
	}
	
	/**
	* Begin drawing a primitive utilizing a vertex buffer. 
	* It's expected to be followed by [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d} as well as [end]{@link webglut/gl_painter~end}.
	* @param {GLPrimitive} primitive The primitive being utilized for drawing the following vertices.
	* @public
	* @example
	*	// Sets the current drawing color to red.
	* 	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Begin drawing a line
	*	GLPainter.begin(gl.LINES);
	*		// Adds first vertex (-1,0) to the buffer
	*		GLPainter.vertex2d(-1,0);
	*		// Adds second vertex (1,0) to the buffer
	*		GLPainter.vertex2d(1,0);
	*	// Finishes drawing the line (actually, only after this line of code the line is drawn)
	*	GLPainter.end();
	*
	*/
	var begin = function(primitive)
	{
		currentPrimitive = primitive;
		pointsBuffer = [];
		numberOfPoints = 0;
	}
	
	/**
	* Adds a 2 dimensional vertex to the drawing buffer. 
	* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}.
	* @param {number} x The first coordenate of the 2 dimensional vertice to be drawn.
	* @param {number} y The second coordenate of the 2 dimensional vertice to be drawn.
	* @public
	* @example
	*	// Sets the current drawing color to red.
	* 	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Begin drawing a line
	*	GLPainter.begin(gl.LINES);
	*		// Adds first vertex (-1,0) to the buffer
	*		GLPainter.vertex2d(-1,0);
	*		// Adds second vertex (1,0) to the buffer
	*		GLPainter.vertex2d(1,0);
	*	// Finishes drawing the line (actually, only after this line of code the line is drawn)
	*	GLPainter.end();
	*
	*/
	var vertex2d = function(x,y)
	{
		vertex3d(x,y,0.0);
	}
	
	/**
	* Adds a 3 dimensional vertex to the drawing buffer.
	* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}.
	* @param {number} x The first coordenate of the 3 dimensional vertice to be drawn.
	* @param {number} y The second coordenate of the 3 dimensional vertice to be drawn.
	* @param {number} z The third coordenate of the 3 dimensional vertice to be drawn.
	* @public
	* @example
	*	// Sets the current drawing color to red.
	* 	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Begin drawing a line
	*	GLPainter.begin(gl.LINES);
	*		// Adds first vertex (-1,0,0) to the buffer
	*		GLPainter.vertex3d(-1,0,0);
	*		// Adds second vertex (1,0,0) to the buffer
	*		GLPainter.vertex3d(1,0,0);
	*	// Finishes drawing the line (actually, only after this line of code the line is drawn)
	*	GLPainter.end();
	*
	*/
	var vertex3d = function(x,y,z)
	{
		pointsBuffer.push(x);
		pointsBuffer.push(y);
		pointsBuffer.push(z);
		numberOfPoints++;
	}
	
	/**
	* Draws the vertices stored in the internal vertex buffer. 
	* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}, and the commands [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d}.
	* @public
	* @example
	*	// Sets the current drawing color to red.
	* 	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Begin drawing a line
	*	GLPainter.begin(gl.LINES);
	*		// Adds first vertex (-1,0) to the buffer
	*		GLPainter.vertex2d(-1,0);
	*		// Adds second vertex (1,0) to the buffer
	*		GLPainter.vertex2d(1,0);
	*	// Finishes drawing the line (actually draws the line)
	*	GLPainter.end();
	*
	*/
	var end = function()
	{
		drawVertices3d(currentPrimitive,pointsBuffer,numberOfPoints);
		pointsBuffer = [];
		numberOfPoints = 0;
	}
	
	/**
	* Draws the given vertices (in 3 dimensions) using a primitive.
	* @param {GLPrimitive} primitive The GL primitive to be used.
	* @param {number[]} vertices The entries of the vertices. It's expected 3 entries per vertex.
	* @param {number} numVertices The number of vertices to be drawn.
	* @public
	* @example
	*	// Sets the the color of the drawings to red.
	*	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Draws a line from (1,0,0) to (-1,0,0)
	*	GLPainter.drawVertices3d(gl.LINES,[1,0,0,-1,0,0],2);
	*/
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
	
	
	/**
	* Draws the given vertices (in 2 dimensions) using a primitive.
	* @param {GLPrimitive} primitive The GL primitive to be used.
	* @param {number[]} vertices The entries of the vertices. It's expected 2 entries per vertex.
	* @param {number} numVertices The number of vertices to be drawn.
	* @public
	* @example
	*	// Sets the the color of the drawings to red.
	*	GLPainter.setDrawColor([1,0,0,1]);
	*
	*	// Draws a line from (1,0) to (-1,0)
	*	GLPainter.drawVertices2d(gl.LINES,[1,0,-1,0],2);
	*/
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

	/**
	* Draws the given vertices (in 3 dimensions) using a primitive and a individual color per vertex.
	* @param {GLPrimitive} primitive The GL primitive to be used.
	* @param {number[]} vertices The entries of the vertices. It's expected 3 entries per vertex.
	* @param {number[]} colors The color of the vertices, in the order that the vertices appear. It's expected 4 color entries per vertex (RGBA).
	* @param {number} numVertices The number of vertices to be drawn.
	* @public
	*/
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

	/**
	* Draws the given vertices (in 2 dimensions) using a primitive and a individual color per vertex.
	* @param {GLPrimitive} primitive The GL primitive to be used.
	* @param {number[]} vertices The entries of the vertices. It's expected 2 entries per vertex.
	* @param {number[]} colors The color of the vertices, in the order that the vertices appear. It's expected 4 color entries per vertex (RGBA).
	* @param {number} numVertices The number of vertices to be drawn.
	* @public
	*/
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
