define(function(){

	/*
	var GLBuffer = function(_data,_itemSize,_numItems)
	{
		this.buffer = gl.createBuffer();
		this.data = _data;
		this.itemSize = _itemSize;
		this.numItems = _numItems;
	}
	*/
	
	var gl;
	
	var GLArrayBuffer = function(_data,_itemSize,_numItems)
	{
		if(!gl)
		{
			throw {
				name: "Buffers not initialized",
				message:"Buffers were not initialized before it's usage"
				};
		}
		this.content = gl.createBuffer();
		
		this.data = _data;
		this.itemSize = _itemSize;
		this.numItems = _numItems;
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.content);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
	}
	
	var GLElementArrayBuffer = function()
	{
		if(!gl)
		{
			throw { 
				name: "Buffers not initialized",
				message:"Buffers were not initialized before it's usage"
				};
		}
		this.content = gl.createBuffer();
		
		this.data = _data;
		this.itemSize = _itemSize;
		this.numItems = _numItems;
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.content);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), gl.STATIC_DRAW);
	}
	
	var initialize = function(_gl)
	{
		gl=_gl;
	}
	
	return{
		initialize: initialize,
		GLArrayBuffer : GLArrayBuffer,
		GLElementArrayBuffer : GLElementArrayBuffer
	};
	
});
