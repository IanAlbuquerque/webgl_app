define(function()
{
	function ShaderNotFoundException()
	{
	    this.name = "Shader Not Found";
	    this.message = "It was not possible to retrieve the shader requested.";	
	}
	
	return ShaderNotFoundException;
}
