define(function()
{
	function ShaderProgramLinkFailureException()
	{
	    this.name = "Shader Program Link Failure";
	    this.message = "It was not link the requested shader to the shader program.";	
	}
	
	return ShaderProgramLinkFailureException;
});
