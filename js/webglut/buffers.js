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
	
	var GLArrayBuffer = function(_data,_itemSize,_numItems)
	{
		this.content = gl.createBuffer();
		
		this.data = _data;
		this.itemSize = _itemSize;
		this.numItems = _numItems; // checar se esse membro de dados realmente é utilizado
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.content);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
	}
	
	var GLElementArrayBuffer = function()
	{
		this.content = gl.createBuffer();
		
		this.data = _data;
		this.itemSize = _itemSize;
		this.numItems = _numItems; // checar se esse membro de dados realmente é utilizado
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.content);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), gl.STATIC_DRAW);
	}

	return{
		GLArrayBuffer : GLArrayBuffer,
		GLElementArrayBuffer : GLElementArrayBuffer
	};
	
});
