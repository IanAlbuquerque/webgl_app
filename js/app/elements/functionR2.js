define(['webglut/gl_painter'],
/** @lends FunctionR2 */
function(GLPainter){
	
	/**
	* A function defined from R to R.
	* @param {number} xMin The left bound of the domain.
	* @param {number} xMax The right bound of the domain.
	* @param {number} numPontos The number of points to be used for the function drawing discretization.
	* @param {string} fOfX A string containing the script that is evaluated as f(x). The x variable must be used.
	* @class FunctionR2
	* @example
	*	// Function sin(x).
	*	var myFunction = new FunctionR2(-1,1,500,"Math.sin(x)");
	*	// Draws the function.
	*	myFunction.draw();
	**/
	var FunctionR2 = function(_xMin,_xMax,_numPontos,_fOfX)
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
		* The number of points to be used for the function drawing discretization.
		* @defaulf 400
		**/
		if(_numPontos) this.numPontos = _numPontos;
		else this.numPontos = 400;
		
		
		/**
		* The array containing the coefficients of the polinomio. The entry coefficients[i] corresponds to the coefficient of x^i.
		* @defaulf "x*x*x"
		**/
		if(_fOfX) this.fOfX = _fOfX;
		else this.fOfX = "x*x*x";
		
		/**
		* Returns the function evaluted in a point in domain.
		* @param {number} x The point in the domain to evaluate the value of the function.
		* @public
		*/
		this.f = function(x)
		{
			return eval(this.fOfX);
		}
	
		/**
		* Draws the function in the plane XY.
		* @public
		* @example
		*	// Function sin(x).
		*	var myFunction = new FunctionR2(-1,1,500,"Math.sin(x)");
		*	// Draws the function.
		*	myFunction.draw();
		*
		*/
		this.draw = function()
		{
			var dx;
			var x,y;
			
			dx = (this.xMax-this.xMin)/this.numPontos;
			
			x=this.xMin;
			GLPainter.begin(gl.LINE_STRIP);
			for(var i=0;i<this.numPontos;i++)
			{
				y=this.f(x);
				GLPainter.vertex2d(x,y);
				x+=dx;
			}
			GLPainter.end();
		}
	
		/**
		* Sets the string that will be evaluated as f(x).
		* @param {string} fOfX A string containing the script that is evaluated as f(x). The x variable must be used.
		* @public
		*/
		this.setF = function(_fOfX)
		{
			this.fOfX = _fOfX;
		}

	}

	return FunctionR2;
});
