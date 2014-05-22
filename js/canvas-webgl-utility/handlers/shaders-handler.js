define(['canvas-webgl-utility/exceptions/shader-compile-failure-exception',
	'canvas-webgl-utility/exceptions/shader-invalid-type-exception',
	'canvas-webgl-utility/exceptions/shader-not-found-exception',
	'canvas-webgl-utility/exceptions/shader-program-link-failure-exception',
	'canvas-webgl-utility/shaders/fragment-shader',
	'canvas-webgl-utility/shaders/vertex-shader'],
function(ShaderCompileFailureException,ShaderInvalidTypeException,ShaderNotFoundException,ShaderProgramLinkFailureException,FragmentShader,VertexShader)
{
	/**
	* A shaders handlers.
	* It's responsible for manipulating and creating all the buffer-related structures necessary
	* for creating a WebGL scene. This includes the creation of the Shader Program.
	* @class ShadersHandler
	*/
	var ShadersHandler = function()
	/** @lends ShadersHandler# */
	{
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/
		
		/**
		* Creates a WebGL shader based on a given shader object (containing the shader script).
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for creating
		* the shader.
		* @param {(FragmentShader|VertexShader)} shader_object The shader object that will be used
		* to extract the shader script itself.
		* @throws {ShaderNotFoundException}
		* @throws {ShaderInvalidTypeException}
		* @throws {ShaderCompileFailureException}
		* @returns {glShader} The WebGL shader generated.
		* @memberOf ShadersHandler#
		* @private
		*/
		function getShader(webgl_context,shader_object) 
		{
			if (!shader_object)
			{
			    throw new ShaderNotFoundException();
			}

			// Retrieves the shader script itself
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

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/
	
		/**
		* Sets up the given Shader Program, loading it with the proper WebGL fragment and
		* vertex shaders and properly linking it with the WebGL canvas context.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for 
		* setting up the Shader Program.
		* @param {ShaderProgram} shader_program The Shader Program that should be set up.
		* @throws {ShaderNotFoundException}
		* @throws {ShaderInvalidTypeException}
		* @throws {ShaderCompileFailureException}
		* @throws {ShaderProgramLinkFailureException}
		* @public
		*/
		that.setUpShaderProgram = function(webgl_context,shader_program)
		{
			// Retrieves the WebGL shaders.
			try
			{
				var fragment_shader = getShader(webgl_context,new FragmentShader());
				var vertex_shader = getShader(webgl_context,new VertexShader());
			}
			catch(exception)
			{
				throw exception;
				return;
			}

			// Attaches the shaders to the Shader Program.
			webgl_context.attachShader(shader_program, vertex_shader);
			webgl_context.attachShader(shader_program, fragment_shader);

			// Links the Shader Program to the WebGL canvas context.
			webgl_context.linkProgram(shader_program);

			if (!webgl_context.getProgramParameter(shader_program, webgl_context.LINK_STATUS))
			{
				throw new ShaderProgramLinkFailureException();
			}
		
			// Sets up the members of the shaders in the Shader Program.
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
