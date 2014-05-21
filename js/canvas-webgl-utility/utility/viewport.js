define(
function()
{
	function Viewport(canvas)
	{
		var object = this;
		
		object.width = canvas.width;
		object.height = canvas.height;
		
		var canvasBoundingRectangle = canvas.getBoundingClientRect();
		
		object.top = canvasBoundingRectangle.top;
		object.bottom = canvasBoundingRectangle.bottom;
		object.left = canvasBoundingRectangle.left;
		object.right = canvasBoundingRectangle.right;
	}
	return Viewport;	
});
