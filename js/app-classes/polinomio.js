define(['webglut/gl_painter'],
/** @lends Polinomio */
function(GLPainter){
	
	/**
	* A polinomio.
	* @param {number} xMin The left bound of the domain.
	* @param {number} xMax The right bound of the domain.
	* @param {number} numPontos The number of points to be used for the function drawing discretization.
	* @param {number[]} coefficients An array containing the coefficients of the polinomio. The entry coefficients[i] corresponds to the coefficient of x^i.
	* @class Polinomio
	* @example
	*	// Polinomio x^2.
	*	var myPolinomio = new Polinomio(-1,1,500,[0,0,1]);
	*	// Draws the polinomio.
	*	myPolinomio.draw();
	*	// Draws 2*x, the derivative of the polinomio
	*	myPolinomio.derivative().draw();
	**/
	var Polinomio = function(_xMin,_xMax,_numPontos,_coefficients)
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
		* @defaulf []
		**/
		if(_coefficients) this.coefficients = _coefficients;
		else this.coefficients = [];
		
		/**
		* Returns the polinomio evaluted in a point in domain.
		* @param {number} x The point in the domain to evaluate the value of the polinomio.
		* @public
		*/
		this.f = function(x)
		{
			var sum=0;
			for(var i in this.coefficients)
			{
				sum+=this.coefficients[i]*Math.pow(x,i);
			}
			return sum;
		}
	
		/**
		* Draws the polinomio in the plane XY. Uses the color red for the drawing.
		* @public
		* @example
		*	// Polinomio x^2.
		*	var myPolinomio = new Polinomio(-1,1,500,[0,0,1]);
		*	// Draws the polinomio.
		*	myPolinomio.draw();
		*
		*/
		this.draw = function()
		{
			var vertices =[];
			var colors =[]
		
			var dx;
			var x,y;
			dx = (this.xMax-this.xMin)/this.numPontos;
			x=this.xMin;
			for(var i=0;i<this.numPontos;i++)
			{
				y=this.f(x);
				vertices.push(x);
				vertices.push(y);
				colors.push(1.0);
				colors.push(0.0);
				colors.push(0.0);
				colors.push(1.0);
				x+=dx;
			}
			GLPainter.drawVerticesColor2d(gl.LINE_STRIP,vertices,colors,this.numPontos);
		}
		
		/**
		* Creates the derivative of the polinomio.
		* @return {Polinomio} The derivative of the polinomio.
		* @public
		* @example
		*	// Polinomio x^2.
		*	var myPolinomio = new Polinomio(-1,1,500,[0,0,1]);
		*	// Draws the polinomio.
		*	myPolinomio.draw();
		*	// Draws 2*x, the derivative of the polinomio
		*	myPolinomio.derivative().draw();
		*
		*/
		this.derivative = function()
		{
			var derivativeCoefficients = [];
			for(var i=0;i<=this.coefficients.length-2;i++)
			{
				derivativeCoefficients[i]=this.coefficients[i+1]*(i+1);
			}
			return new Polinomio(this.xMin,this.xMax,this.numPontos,derivativeCoefficients);
		}
	}

	return Polinomio;
});
