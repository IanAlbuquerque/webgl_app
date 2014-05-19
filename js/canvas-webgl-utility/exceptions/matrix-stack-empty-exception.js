define(function()
{
	function MatrixStackEmptyException()
	{
	    this.name = "Empty Matrix Stack";
	    this.message = "The matrix stack is empty.";	
	}
	
	return MatrixStackEmptyException;
});
