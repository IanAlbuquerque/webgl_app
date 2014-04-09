define(['webglut/gl_painter'],
function(GLPainter){
	
	var Polinomio = function(_xMin,_xMax,_numPontos,_coefficients)
	{
		if(_xMin) this.xMin = _xMin;
		else this.xMin = -1;
		
		if(_xMax) this.xMax = _xMax;
		else this.xMax = 1;
		
		if(_numPontos) this.numPontos = _numPontos;
		else this.numPontos = 400;
		
		if(_coefficients) this.coefficients = _coefficients;
		else this.coefficients = [];
		
		this.f = function(x)
		{
			var sum=0;
			for(var i in this.coefficients)
			{
				sum+=this.coefficients[i]*Math.pow(x,i);
			}
			return sum;
		}
		
		this.draw = function(gl,shaderProgram)
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
			GLPainter.drawVerticesColor2d(gl,shaderProgram,gl.LINE_STRIP,vertices,colors,this.numPontos);
		}
		
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

	return{
		Polinomio : Polinomio
	};
	
});
