/**
* @fileoverview
* Defines the module that is responsible for creating gl buffers.
*/

/**
* The module that is responsible for creating gl buffers.
* @namespace webglut/buffers
*/

define(
/** @lends webglut/buffers */ 
function(){

	/*
	var GLBuffer = function(_data,_itemSize,_numItems)
	{
		this.buffer = gl.createBuffer();
		this.data = _data;
		this.itemSize = _itemSize;
		this.numItems = _numItems;
	}
	*/
	
	/**
	* A webgl array buffer. Used to store a variety of data needed for redering scenes.
	* @param {number[]} data The array containing the data to be inserted into the buffer.
	* @param {number} itemSize The number of entries in the array that defines an unique element.
	* @param {number} numItems The number of unique elements in the array.
	* @class GLArrayBuffer
	* @example
	*	// Implementation of the drawVerticesColor3d function
	*	var drawVerticesColor3d = function(primitive,vertices,colors,numVertices)
	*	{
	*		var vertexPositionBuffer = new Buffers.GLArrayBuffer(vertices,3,numVertices);
	*		var vertexColorBuffer = new Buffers.GLArrayBuffer(colors,4,numVertices);
	*
	*		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer.content);
	*		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	*	
	*		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer.content);
	*		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	*
	*		Matrices.setMatrixUniforms(gl,shaderProgram);
	*		gl.drawArrays(primitive, 0, numVertices);
	*	}
	**/
	var GLArrayBuffer = function(_data,_itemSize,_numItems)
	{
		/**
		* The buffer itself.
		**/
		this.content = gl.createBuffer();
		
		/**
		* The array containing the data to be inserted into the buffer.
		**/
		this.data = _data;
		
		/**
		* The number of entries in the array that defines an unique element.
		**/
		this.itemSize = _itemSize;
		
		/**
		* The number of unique elements in the array.
		**/
		this.numItems = _numItems; // checar se esse membro de dados realmente é utilizado
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.content);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
	}
	
	/**
	* A webgl element array buffer. Used to store a variety of data in a index-like format needed for redering scenes.
	* @param {number[]} data The array containing the data to be inserted into the buffer.
	* @param {number} itemSize The number of entries in the array that defines an unique element.
	* @param {number} numItems The number of unique elements in the array.
	* @class GLElementArrayBuffer
	**/	
	var GLElementArrayBuffer = function()
	{
		/**
		* The buffer itself.
		**/
		this.content = gl.createBuffer();
		
		/**
		* The array containing the data to be inserted into the buffer.
		**/
		this.data = _data;
		/**
		* The number of entries in the array that defines an unique element.
		**/
		this.itemSize = _itemSize;
		/**
		* The number of unique elements in the array.
		**/
		this.numItems = _numItems; // checar se esse membro de dados realmente é utilizado
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.content);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), gl.STATIC_DRAW);
	}

	return{
		GLArrayBuffer : GLArrayBuffer,
		GLElementArrayBuffer : GLElementArrayBuffer
	};
	
});
