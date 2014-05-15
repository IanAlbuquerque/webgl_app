define(function()
{
	function ShaderCompileFailureException()
	{
	    this.name = "Shader Compile Failure";
	    this.message = "It was not possible to compile the requested shader.";	
	}
	
	return ShaderCompileFailureException;
}
