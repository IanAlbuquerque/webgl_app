define(['webglut/exceptions/shader-compile-failure-exception',
	'webglut/exceptions/shader-invalid-type-exception',
	'webglut/exceptions/shader-not-found-exception',
	'webglut/exceptions/shader-program-link-failure-exception'],
function(ShaderCompileFailureException,ShaderInvalidTypeException,ShaderNotFoundException,ShaderProgramLinkFailureException)
{
	/**
	* Creates a shader based on a id given.
	* @param {string} id The id of the scripf of the shader intended to be created.
	* @throws {Exception}
	* @returns {Shader} The shader generated.
	* @private
	*/
	var getShader = function(webgl_context,id) 
	{
		// Gets the desired shader script using it's id as reference
		var shader_script = document.getElementById(id); // Possibly a violation in modularization?

		if (!shader_script)
		{
		    throw new ShaderNotFoundException();
		}

		// Organizes the script content into the source code of the script
		var script_source_code = "";
		var script = shader_script.firstChild;
		while (script) 
		{
		    if (script.nodeType == 3) 
				{
		        script_source_code += script.textContent;
		    }
		    script = script.nextSibling;
		}
		
		// Creates the shader according to it's type 
		var shader;
		if (shader_script.type == "x-shader/x-fragment")
		{
		    shader = webgl_context.createShader(webgl_context.FRAGMENT_SHADER);
		} 
		else if (shader_script.type == "x-shader/x-vertex")
		{
		    shader = webgl_context.createShader(webgl_context.VERTEX_SHADER);
		} 
		else 
		{
		    throw new ShaderInvalidTypeException();
		}

		// Compile the shader's code
		webgl_context.shaderSource(shader, script_source_code);
		webgl_context.compileShader(shader);

		if (!webgl_context.getShaderParameter(shader, webgl_context.COMPILE_STATUS))
		{
		    throw new ShaderCompileFailureException();
		}

		return shader;
   	 }
	
	function setUpShaderProgram(webgl_context,shader_program)
	{
		try
		{
			var fragment_shader = getShader(webgl_context,"shader-fs");
			var vertex_shader = getShader(webgl_context,"shader-vs");
		}
		catch(exception)
		{
			throw exception;
			return;
		}

		webgl_context.attachShader(shader_program, vertex_shader);
		webgl_context.attachShader(shader_program, fragment_shader);
        	webgl_context.linkProgram(shader_program);

		if (!webgl_context.getProgramParameter(shader_program, webgl_context.LINK_STATUS))
		{
			throw new ShaderProgramLinkFailureException();
		}
		
		webgl_context.useProgram(shader_program);

		shader_program.vertexPositionAttribute = webgl_context.getAttribLocation(shader_program, "aVertexPosition");
		webgl_context.enableVertexAttribArray(shader_program.vertexPositionAttribute);

		shader_program.vertexColorAttribute = webgl_context.getAttribLocation(shader_program, "aVertexColor");
		webgl_context.enableVertexAttribArray(shader_program.vertexColorAttribute);

		shader_program.pMatrixUniform = webgl_context.getUniformLocation(shader_program, "uPMatrix");
		shader_program.mvMatrixUniform = webgl_context.getUniformLocation(shader_program, "uMVMatrix");
	} 

	return {
		setUpShaderProgram : setUpShaderProgram
	};
	
});
