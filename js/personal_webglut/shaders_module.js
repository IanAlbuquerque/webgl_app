define(function(){

	var shaderProgram;
	
	var getShader = function(gl, id) 
	{
		// Gets the desired shader script using it's id as reference
        var shaderScript = document.getElementById(id); // Possibly a violation in modularization?

        if (!shaderScript)
		{
            throw { 
				name: "Shader not found",
				message: "Unable to find the shader script element referenced by the id '" + id + "'" 
			};
        }

		// Organizes the script content into the source code of the script
        var scriptSourceCode = "";
        var script = shaderScript.firstChild;
        while (script) 
		{
            if (script.nodeType == 3) 
			{
                scriptSourceCode += script.textContent;
            }
            script = script.nextSibling;
        }
		
		// Creates the shader according to it's type 
        var shader;
        if (shaderScript.type == "x-shader/x-fragment")
		{
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } 
		else if (shaderScript.type == "x-shader/x-vertex")
		{
            shader = gl.createShader(gl.VERTEX_SHADER);
        } 
		else 
		{
            throw { 
				name: "Invalid type",
				message: "The type '" + shaderScript.type + "' of the shader script element referenced by the id '" + id + "' is invalid."
			};
        }

		// Compiler the shader's code
        gl.shaderSource(shader, scriptSourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{
            throw { 
				name: "Shader compile error",
				message: "Unable to compile the shader script element referenced by the id '"+id+"'.\nShader Info Log: '"+gl.getShaderInfoLog(shader)+"'"
			};
        }

        return shader;
    }
	
	var initialize = function(gl)
	{
		try
		{
			var fragmentShader = getShader(gl, "shader-fs");
			var vertexShader = getShader(gl, "shader-vs");
		}
		catch(exception)
		{
			throw exception;
		}

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		{
			throw { 
				name: "Shader program link error",
				message: "Shaders could not be properly linked to the shader's program" 
			}; 
		}
		
		gl.useProgram(shaderProgram);

		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	}
	
	var getShaderProgram = function()
	{
		return shaderProgram;
	}

	return{
		initialize : initialize,
		getShaderProgram : getShaderProgram
	};
	
});
