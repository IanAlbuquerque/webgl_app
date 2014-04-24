var gl;

define(function(){

	var initialize = function(canvas)
	{
		try
		{
			gl = canvas.getContext("webgl");
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} 
		catch (exception) 
		{
			exception.name = "Canvas context not found";
			throw exception;
		}
	}
	
	var getGL = function()
	{
		return gl;
	}

	return{
		initialize: initialize,
		getGL : getGL
	};
	
});
