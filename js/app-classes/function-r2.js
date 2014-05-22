define(
function()
{
	
	/**
	* A function defined from R to R.
	* @param {number} _x_min The left bound of the domain.
	* @param {number} _x_max The right bound of the domain.
	* @param {string} _function_string A string containing the script that is evaluated as f(x).
	* The x variable must be used.
	* @class FunctionR2
	**/
	var FunctionR2 = function(_x_min,_x_max,_function_string)
	/** @lends FunctionR2# */
	{
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/

		/**
		* The left bound of the domain.
		* @type {number}
		* @memberOf FunctionR2#
		* @private
		**/
		var x_min = _x_min;
		
		/**
		* The right bound of the domain.
		* @type {number}
		* @memberOf FunctionR2#
		* @private
		**/
		var x_max = _x_max;
		
		/**
		* A string containing the script that is evaluated as f(x).
		* The x variable must be used.
		* @type {string}
		* @memberOf FunctionR2#
		* @private
		**/
		var function_string = _function_string;

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/
	
		/**
		* Returns the value of function evaluted in a point in domain.
		* @param {number} x The point in the domain that will be evaluated.
		* @return {number} The value f(x)
		* @public
		*/
		that.f = function(x)
		{
			return eval(function_string);
		}
	
		/**
		* Generates the vertices that represents the graphic of the discratization of the
		* function given the number of points to be used for the discretization.
		* The vertices are supposed to be drawn using the LINE_STRIP or POINTS primitives.
		* @param {number} number_of_points The number of points to be used for the discretization.
		* @returns {number[]} generated_vertices The list of vertices that represents the drawing. 
		* Every two entries represents the x and y coordinates of a vertex. 
		* @public
		*/
		that.generateDrawingVertices = function(number_of_points)
		{
			var generated_vertices = [];
			var delta_x;
			var x_coordinate,y_coordinate;
			
			delta_x = (x_max-x_min)/number_of_points;
			
			for(var i=0;i<number_of_points;i++)
			{
				x_coordinate=x_min+i*delta_x;
				y_coordinate=that.f(x_coordinate);

				generated_vertices.push(x_coordinate);
				generated_vertices.push(y_coordinate);
			}
			return generated_vertices;
		}
	
		/**
		* Sets the string that will be evaluated as f(x).
		* @param {string} _function_string A string containing the script that is
		* evaluated as f(x). The x variable must be used.
		* @public
		*/
		that.setFunctionString = function(_function_string)
		{
			function_string = _function_string;
		}
	
		/**
		* Sets domain of the function.
		* @param {number} x_min The left bound of the domain.
		* @param {number} x_max The right bound of the domain.
		* @public
		*/
		that.setDomain = function(_x_min,_x_max)
		{
			x_min = _x_min;
			x_max = _x_max;
		}

	}

	return FunctionR2;
});
