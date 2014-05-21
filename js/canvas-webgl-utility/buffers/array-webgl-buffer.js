define(
function(){

	/**
	* A webgl array buffer. Used to store a variety of data needed for redering scenes.
	* @param {number[]} data The array containing the data to be inserted into the buffer.
	* @param {number} itemSize The number of entries in the array that defines an unique element.
	* @param {number} numItems The number of unique elements in the array.
	* @class ArrayWebGLBuffer
	**/
	var ArrayWebGLBuffer = function(webgl_context,_data,_item_size,_number_of_items)
	{
		var object = this;
		
		/**
		* The buffer itself.
		**/
		object.content = webgl_context.createBuffer();
		
		/**
		* The array containing the data to be inserted into the buffer.
		**/
		object.data = _data;
		
		/**
		* The number of entries in the array that defines an unique element.
		**/
		object.item_size = _item_size;
		
		/**
		* The number of unique elements in the array.
		**/
		object.number_of_items = _number_of_items; // checar se esse membro de dados realmente é utilizado
		
		webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, object.content);
		webgl_context.bufferData(webgl_context.ARRAY_BUFFER, new Float32Array(object.data), webgl_context.STATIC_DRAW);
	}
	return ArrayWebGLBuffer;	
});
