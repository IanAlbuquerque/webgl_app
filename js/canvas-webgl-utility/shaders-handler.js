define(['canvas-webgl-utility/exceptions/shader-compile-failure-exception',
	'canvas-webgl-utility/exceptions/shader-invalid-type-exception',
	'canvas-webgl-utility/exceptions/shader-not-found-exception',
	'canvas-webgl-utility/exceptions/shader-program-link-failure-exception',
	'canvas-webgl-utility/shader-fragment',
	'canvas-webgl-utility/shader-vertex'],
function(ShaderCompileFailureException,ShaderInvalidTypeException,ShaderNotFoundException,ShaderProgramLinkFailureException,ShaderFragment,ShaderVertex)
{

	var ShadersHandler = function()
	{
		var object = this;
		
		/**
		* Creates a shader based on a id given.
		* @param {string} id The id of the scripf of the shader intended to be created.
		* @throws {Exception}
		* @returns {Shader} The shader generated.
		* @private
		*/
		object.getShader = function(webgl_context,shader_object) 
		{
			if (!shader_object)
			{
			    throw new ShaderNotFoundException();
			}

			// Organizes the script content into the source code of the script
			var script_source_code = shader_object.script;
		
			// Creates the shader according to it's type 
			var shader;
			if (shader_object.type == "fragment")
			{
			    shader = webgl_context.createShader(webgl_context.FRAGMENT_SHADER);
			} 
			else if (shader_object.type == "vertex")
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
	
		object.setUpShaderProgram = function(webgl_context,shader_program)
		{
			try
			{
				var fragment_shader = object.getShader(webgl_context,new ShaderFragment());
				var vertex_shader = object.getShader(webgl_context,new ShaderVertex());
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
	}

	return ShadersHandler;
	
});
