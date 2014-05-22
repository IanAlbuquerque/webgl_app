define(
function()
{
	/**
	* A WebGL element array buffer. Used to store a variety of index-like data needed 
	* for setting up scenes.
	* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for 
	* loading the matrices.
	* @param {number[]} _data The array containing the data to be inserted into the buffer.
	* @param {number} _item_size The number of entries in the array that defines an unique element.
	* @param {number} _number_of_items The number of unique elements in the array.
	* @class ElementArrayWebGLBuffer
	**/
	var ElementArrayWebGLBuffer = function(webgl_context,_data,_item_size,_number_of_items)
	/** @lends ElementArrayWebGLBuffer# */
	{
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/

		/**
		* The data of the buffer. It should contain 
		* [item_size]{@link ElementArrayWebGLBuffer#item_size} x 
		* [number_of_items]{@link ElementArrayWebGLBuffer#number_of_items} entries.
		* @memberOf ElementArrayWebGLBuffer#
		* @type {number[]}
		* @private
		**/
		var data = _data;

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/
		
		/**
		* The WebGL buffer itself.
		* @type {glBuffer}
		* @public
		*/
		that.content = webgl_context.createBuffer();
		
		/**
		* The number of entries in the array that defines an unique element.
		* @type {number}
		* @public
		**/
		that.item_size = _item_size;
		
		/**
		* The number of unique elements in the array.
		* @type {number}
		* @public
		**/
		// This member might be not being used.
		that.number_of_items = _number_of_items;
		
		// Sets up the buffer.
		webgl_context.bindBuffer(webgl_context.ELEMENT_ARRAY_BUFFER, that.content);
		webgl_context.bufferData(webgl_context.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), webgl_context.STATIC_DRAW);
	}

	return ElementArrayWebGLBuffer;
	
});
