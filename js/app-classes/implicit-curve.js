define(
function(){
	
	/**
	* An implicit curve in the XY plane.
	* @param {number} _x_min The left bound of the domain.
	* @param {number} _x_max The right bound of the domain.
	* @param {number} _y_min The bottom bound of the domain.
	* @param {number} _y_max The top bound of the domain.
	* @param {string} _implicit_curve_expression A string containing the script that is evaluated as
	* the expression of the implicit curve. The associated equation of the implicit curve will
	* be considered as "implicit_curve_expression=0".
	* The x and y variables must be used.
	* @class ImplicitCurve
	**/
	var ImplicitCurve = function(_x_min,_x_max,_y_min,_y_max,_implicit_curve_expression)
	/** @lends ImplicitCurve# */
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
		* @memberOf ImplicitCurve#
		* @private
		**/
		var x_min = _x_min;
		
		/**
		* The right bound of the domain.
		* @type {number}
		* @memberOf ImplicitCurve#
		* @private
		**/
		var x_max = _x_max;
		
		/**
		* The bottom bound of the domain.
		* @type {number}
		* @memberOf ImplicitCurve#
		* @private
		**/
		var y_min = _y_min;
		
		/**
		* The top bound of the domain.
		* @type {number}
		* @memberOf ImplicitCurve#
		* @private
		**/
		var y_max = _y_max;

		/**
		* The string containing the script that is evaluated as the expression of the implicit curve.
		* The associated equation of the implicit curve will be
		* considered as "implicit_curve_expression=0".
		* @type {string}
		* @memberOf ImplicitCurve#
		* @private
		**/
		var implicit_curve_expression = _implicit_curve_expression;
	
		/**
		* Generates the vertices that define the linear approximation of 
		* the implicit curve in the given triangle.
		* @param {number[]} triangle_vertices The vertices of the triangle.
		* Six entries are expected (two coordinates x and y for each triangle vertex).
		* @private
		*/
		function generateDrawingVerticesInTriangle(triangle_vertices)
		{
			var expression_value = []
			for(var i=0;i<3;i++)
			{
				expression_value[i] = that.evaluate(triangle_vertices[2*i],triangle_vertices[2*i+1]);
			}
			
			var generated_vertices = [];
			var number_of_generated_vertices = 0;
			
			var i_next;
			var x_coordinate;
			var y_coordinate;
			var t;
			for(var i=0;i<3;i++)
			{
				i_next = (i+1)%3;
				if((expression_value[i]*expression_value[i_next]) < 0)
				{
					t = -expression_value[i]/(expression_value[i_next]-expression_value[i]);
					
					x_coordinate = triangle_vertices[2*i] + t * (triangle_vertices[2*i_next] - triangle_vertices[2*i]);
					y_coordinate = triangle_vertices[2*i+1] + t * (triangle_vertices[2*i_next+1] - triangle_vertices[2*i+1]);
					
					generated_vertices.push(x_coordinate);
					generated_vertices.push(y_coordinate);
				
					number_of_generated_vertices++;
				}
			}
			
			for(var i=0;i<3;i++)
			{
				if(expression_value[i]==0)
				{
					generated_vertices.push(triangle_vertices[2*i]);
					generated_vertices.push(triangle_vertices[2*i+1]);
					number_of_generated_vertices++;
				}
			}
			
			if(number_of_generated_vertices != 2)
			{
				generated_vertices = [];
			}
			return generated_vertices;
		}

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/
	
		/**
		* Sets the string that will be evaluated as the implicit expression of the curve.
		* @param {string} _implicit_curve_expression A string containing the script that is evaluated as
		* the expression of the implicit curve. The associated equation of the implicit curve will
		* be considered as "implicit_curve_expression=0".
		* The x and y variables must be used.
		* @public
		*/
		that.setImplicitCurveExpression= function(_implicit_curve_expression)
		{
			implicit_curve_expression = _implicit_curve_expression;
		}
		
		/**
		* Evaluates the implicit curve expression in a point in the plane XY.
		* @param {number} x The first coordinate of the point to be evaluated
		* @param {number} y The second coordinate of the point to be evaluated
		* @returns {number} The expression evaluated in (x,y)
		* @public
		*/
		that.evaluate = function(x,y)
		{
			return eval(implicit_curve_expression);
		}
		
		/**
		* Generates the vertices of the implicit curve discretization in the plane XY using 
		* the algorithm "Marching Triangles"
		* The vertices are supposed to be drawn using the LINES primitive.
		* @param {number} number_of_points_x The number of points to be used for 
		* the first coordinate discretization.
		* @param {number} number_of_points_y The number of points to be used for 
		* the second coordinate discretization.
		* @returns {number[]} generated_vertices The list of points that represents the drawing. 
		* Every two entries represents the x and y coordinates of a vertex.
		* @public
		*/
		that.generateDrawingVertices = function(number_of_points_x,number_of_points_y)
		{
			var delta_x,delta_y;
			var x_coordinate,y_coordinate;
			var triangle_vertices = [];
			var generated_vertices = [];
			var vertices_received_from_triangle = [];
			
			delta_x = (x_max-x_min)/number_of_points_x;
			delta_y = (y_max-y_min)/number_of_points_y;
			
			for(var i_x=0;i_x<number_of_points_x;i_x++)
			{
				for(var i_y=0;i_y<number_of_points_y;i_y++)
				{
					x_coordinate = x_min + i_x * delta_x;
					y_coordinate = y_min + i_y * delta_y;
					
					triangle_vertices = [];
					triangle_vertices.push(x_coordinate);
					triangle_vertices.push(y_coordinate);
					
					triangle_vertices.push(x_coordinate + delta_x);
					triangle_vertices.push(y_coordinate);
					
					triangle_vertices.push(x_coordinate);
					triangle_vertices.push(y_coordinate + delta_y);
					
					vertices_received_from_triangle = generateDrawingVerticesInTriangle(triangle_vertices);
					for(var i=0;i<vertices_received_from_triangle.length;i++)
					{
						generated_vertices.push(vertices_received_from_triangle[i]);
					}
					
					triangle_vertices = [];
					triangle_vertices.push(x_coordinate);
					triangle_vertices.push(y_coordinate + delta_y);
					
					triangle_vertices.push(x_coordinate + delta_x);
					triangle_vertices.push(y_coordinate);
					
					triangle_vertices.push(x_coordinate + delta_y);
					triangle_vertices.push(y_coordinate + delta_y);
					
					vertices_received_from_triangle = generateDrawingVerticesInTriangle(triangle_vertices);
					for(var i=0;i<vertices_received_from_triangle.length;i++)
					{
						generated_vertices.push(vertices_received_from_triangle[i]);
					}
				}
			}
			
			return generated_vertices;
		}

		/**
		* Sets the domain where the curve is defined.
		* @param {number} x_min The left bound of the domain.
		* @param {number} x_max The right bound of the domain.
		* @param {number} y_min The bottom bound of the domain.
		* @param {number} y_max The top bound of the domain.
		* @public
		*/
		that.setDomain = function(_x_min,_x_max,_y_min,_y_max)
		{
			x_min = _x_min;
			x_max = _x_max;
			y_min = _y_min;
			y_max = _y_max;
		}

	}

	return ImplicitCurve;
});
