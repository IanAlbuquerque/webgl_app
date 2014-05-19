define(function()
{
	function ShaderInvalidTypeException()
	{
	    this.name = "Shader Invalid Type";
	    this.message = "The requested shader type is invalid.";	
	}
	
	return ShaderInvalidTypeException;
});
