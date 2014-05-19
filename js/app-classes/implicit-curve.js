define(
/** @lends ImplicitCurve */
function(){
	
	/**
	* A implicit curve in R^2
	* @param {number} xMin The left bound of the domain.
	* @param {number} xMax The right bound of the domain.
	* @param {number} yMin The bottom bound of the domain.
	* @param {number} yMax The top bound of the domain.
	* @param {number} numPontos The number of points to be used for the function drawing discretization.
	* @param {string} equation A string containing the script that is evaluated as the equation of the implicit curve. The x and y variables must be used.
	* @class ImplicitCurve
	**/
	var FunctionR2 = function(_xMin,_xMax,_yMin,_yMax,_numPontos,_equation)
	{
		/**
		* The left bound of the domain.
		* @default -1
		**/
		if(_xMin) this.xMin = _xMin;
		else this.xMin = -1;
		
		/**
		* The right bound of the domain.
		* @default 1
		**/
		if(_xMax) this.xMax = _xMax;
		else this.xMax = 1;
		
		/**
		* The bottom bound of the domain.
		* @default -1
		**/
		if(_yMin) this.yMin = _yMin;
		else this.yMin = -1;
		
		/**
		* The top bound of the domain.
		* @default 1
		**/
		if(_yMax) this.yMax = _yMax;
		else this.yMax = 1;
		
		
		/**
		* The number of points to be used for the function drawing discretization.
		* @default 40
		**/
		if(_numPontos) this.numPontos = _numPontos;
		else this.numPontos = 40;
		
		
		/**
		* The array containing the coefficients of the polinomio. The entry coefficients[i] corresponds to the coefficient of x^i.
		* @default "x*x+y*y-1"
		**/
		if(_equation) this.equation = _equation;
		else this.equation = "x*x+y*y-1";
	
		/**
		* Sets the string that will be evaluated as the implicit expression of the curve.
		* @param {string} equation A string containing the script that is evaluated as the equation of the curve. The x and y variables must be used.
		* @public
		*/
		this.setEquation = function(_equation)
		{
			this.equation = _equation;
		}
		
		/**
		* Evaluates the implicit curve expression in a point in the plane XY.
		* @param {number} x The first entry of the point to be evaluated
		* @param {number} y The second entry of the point to be evaluated
		* @returns {number} The expression evaluated in (x,y)
		* @public
		*/
		this.evaluate = function(x,y)
		{
			return eval(this.equation);
		}
	
		
		/**
		* Draws the linear approximation of the implicit curve in the given triangle.
		* @param {Point[]} trianglePoints The vertices of the triangle. Three entries are expected.
		* @private
		*/
		this.calculateDrawingPointsInTriangle = function(trianglePoints)
		{
			var value = []
			for(var i=0;i<3;i++)
				value[i] = this.evaluate(trianglePoints[2*i],trianglePoints[2*i+1]);
			
			var points = [];
			var totalPoints = 0;
			
			var inext;
			var x;
			var y;
			for(var i=0;i<3;i++)
			{
				inext = (i+1)%3;
				if((value[i]*value[inext]) < 0)
				{
					var t = -value[i]/(value[inext]-value[i]);
					
					x = trianglePoints[2*i] + t * (trianglePoints[2*inext] - trianglePoints[2*i]);
					y = trianglePoints[2*i+1] + t * (trianglePoints[2*inext+1] - trianglePoints[2*i+1]);
					
					points.push(x);
					points.push(y);
				
					
					totalPoints++;
				}
			}
			
			for(var i=0;i<3;i++)
			{
				if(value[i]==0)
				{
					points.push(trianglePoints[2*i]);
					points.push(trianglePoints[2*i+1]);
					totalPoints++;
				}
			}
			
			if(totalPoints != 2)
				points = [];
			return points;
		}
		
		/**
		* Draws the implicit curve in the plane XY using the algorithm "Marching Triangles"
		* @returns {number[]} The list of points that represents the drawing. Every two entries represents the x and y informations of a point. 
		* The drawing should be made using gl.LINES.
		* @public
		*/
		this.calculateDrawingPoints = function()
		{
			var dx,dy;
			var x,y;
			var trianglePoints = [];
			var points = [];
			var pointsReceivedFromTriangle = [];
			var dumy = [];
			
			dx = (this.xMax-this.xMin)/this.numPontos;
			dy = (this.yMax-this.yMin)/this.numPontos;
			
			
			for(var ix=0;ix<this.numPontos;ix++)
			{
				for(var iy=0;iy<this.numPontos;iy++)
				{
					x = this.xMin + ix*dx;
					y = this.yMin + iy*dy;
					
					trianglePoints = [];
					trianglePoints.push(x);
					trianglePoints.push(y);
					
					trianglePoints.push(x + dx);
					trianglePoints.push(y);
					
					trianglePoints.push(x);
					trianglePoints.push(y + dy);
					
					pointsReceivedFromTriangle = this.calculateDrawingPointsInTriangle(trianglePoints);
					for(var i=0;i<pointsReceivedFromTriangle.length;i++)
						points.push(pointsReceivedFromTriangle[i]);
					
					trianglePoints = [];
					trianglePoints.push(x);
					trianglePoints.push(y + dy);
					
					trianglePoints.push(x + dx);
					trianglePoints.push(y);
					
					trianglePoints.push(x + dy);
					trianglePoints.push(y + dy);
					
					pointsReceivedFromTriangle = this.calculateDrawingPointsInTriangle(trianglePoints);
					for(var i=0;i<pointsReceivedFromTriangle.length;i++)
						points.push(pointsReceivedFromTriangle[i]);
				}
			}
			
			return points;
		}

		/**
		* Sets domain where the curve is defined.
		* @param {number} xMin The left bound of the domain.
		* @param {number} xMax The right bound of the domain.
		* @param {number} yMin The bottom bound of the domain.
		* @param {number} yMax The top bound of the domain.
		* @public
		*/
		this.setDomain = function(_xMin,_xMax,_yMin,_yMax)
		{
			this.xMin = _xMin;
			this.xMax = _xMax;
			this.yMin = _yMin;
			this.yMax = _yMax;
		}

	}

	return FunctionR2;
});
