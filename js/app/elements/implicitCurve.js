define(['webglut/gl_painter'],
/** @lends ImplicitCurve */
function(GLPainter){
	
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
		* @defaulf 400
		**/
		if(_numPontos) this.numPontos = _numPontos;
		else this.numPontos = 400;
		
		
		/**
		* The array containing the coefficients of the polinomio. The entry coefficients[i] corresponds to the coefficient of x^i.
		* @defaulf "x*x*x"
		**/
		if(_equation) this.equation = _equation;
		else this.equation = "x*x+y*y";
	
		this.evaluate = function(x,y)
		{
			return eval(this.equation);
		}
	
		this.drawInTriangle = function(trianglePoints)
		{
			var value = []
			for(var i=0;i<3;i++)
				value[i] = this.evaluate(trianglePoints[i].x,trianglePoints[i].y);
			
			var pointsToPlot = [];
			var numPoints = 0;
			
			var inext;
			for(var i=0;i<3;i++)
			{
				inext = (i+1)%3;
				if((value[i]*value[inext]) < 0)
				{
					var t = -value[i]/(value[inext]-value[i]);
					pointsToPlot[numPoints].x = trianglePoints[i].x + t * (trianglePoints[inext].x - trianglePoints[i].x);
					pointsToPlot[numPoints].y = trianglePoints[i].y + t * (trianglePoints[inext].y - trianglePoints[i].y);
					numPoints++;
				}
			}
			
			for(var i=0;i<3;i++)
			{
				if(value[i]==0)
				{
					pointsToPlot[numPoints].x = trianglePoints[i].x;
					pointsToPlot[numPoints].y = trianglePoints[i].y;
					numPoints++;
				}
			}
			
			if(numPoints == 2)
			{
				GLPainter.begin(gl.LINES);
					GLPainter.vertex2d(pointsToPlot[0].x,pointsToPlot[0].y);
					GLPainter.vertex2d(pointsToPlot[1].x,pointsToPlot[1].y);
				GLPainter.end();	
			}
		}
		
		/**
		* Draws the implicit curve in the plane XY.
		* @public
		* @example
		*/
		this.draw = function()
		{
			var dx,dy;
			var x,y;
			var trianglePoints = [];
			var dumy = [];
			trianglePoints.push(dumy);
			trianglePoints.push(dumy);
			trianglePoints.push(dumy);
			
			dx = (this.xMax-this.xMin)/this.numPontos;
			dy = (this.yMax-this.yMin)/this.numPontos;
			
			for(var ix=0;ix<this.numPontos;ix++)
			{
				for(var iy=0;iy<this.numPontos;iy++)
				{
					x = this.xMin + ix*this.numPontos;
					y = this.yMin + iy*this.numPontos;
					
					trianglePoints[0].x = x;
					trianglePoints[0].y = y;
					
					trianglePoints[1].x = x + dx;
					trianglePoints[1].y = y;
					
					trianglePoints[2].x = x;
					trianglePoints[2].y = y + dy;
					
					//this.drawInTriangle(trianglePoints);
					
					for(var i=0;i<3;i++)
					{
						GLPainter.begin(gl.LINES);
							GLPainter.vertex2d(x,y);
							GLPainter.vertex2d(x+dx,y);
							GLPainter.vertex2d(x,y+dy);
						GLPainter.end();
					}
				}
			}
		}

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
