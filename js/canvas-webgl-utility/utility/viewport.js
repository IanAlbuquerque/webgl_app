define(
function()
{
	function Viewport(canvas)
	{
		var that = this;
		
		that.width = canvas.width;
		that.height = canvas.height;
		
		var canvasBoundingRectangle = canvas.getBoundingClientRect();
		
		that.top = canvasBoundingRectangle.top;
		that.bottom = canvasBoundingRectangle.bottom;
		that.left = canvasBoundingRectangle.left;
		that.right = canvasBoundingRectangle.right;

		that.DIRECTION_HORIZONTAL = 0;
		that.DIRECTION_VERTICAL = 1;

		that.convertToPercentage = function(direction,value)
		{
			if(direction == that.DIRECTION_HORIZONTAL)
			{
				return (value-that.left)/that.width;
			}
			else if(direction == that.DIRECTION_VERTICAL)
			{
				return (value-that.top)/that.height;
			}
			else
			{
				// throw exception??
				return 0;
			}

		}
	}
	return Viewport;	
});
