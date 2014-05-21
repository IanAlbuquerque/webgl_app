define(['canvas-webgl-utility/buffers/array-webgl-buffer'],
function(ArrayWebGLBuffer)
{
	/**
	* A canvas drawings handler.
	* It's responsible for creating all the buffers and methods related to drawing a WebGL scene.
	* @class DrawingsHandler
	*/
	var DrawingsHandler = function()
	/** @lends DrawingsHandler# */
	{	
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/
		
		/**
		* The current Shader Program being used for drawing.
		* @type {ShaderProgram}
		* @memberOf DrawingsHandler#
		* @private
		*/
		var current_shader_program;

		/**
		* The current Web GL Canvas Context being used for drawing.
		* @type {WebGLContext}
		* @memberOf DrawingsHandler#
		* @private
		*/
		var current_webgl_context;
		
		/**
		* The current color being used for drawing.
		* @type {number[]}
		* @default [1,1,1,1]
		* @memberOf DrawingsHandler#
		* @private
		*/
		var current_drawing_color = [1,1,1,1];

		/**
		* The current Web GL Primitive being used for drawing.
		* @type {WebGLPrimitive}
		* @memberOf DrawingsHandler#
		* @private
		*/
		var current_drawing_primitive;
	
		/**
		* The entries of the vertices being buffered until drawn.
		* Three entries per vertex are stored.
		* @type {number[]}
		* @memberOf DrawingsHandler#
		* @private
		*/
		var vertices_buffer = [];
	
		/**
		* The number of vertices being buffered.
		* @type {number}
		* @memberOf DrawingsHandler#
		* @private
		*/
		var number_of_vertices_in_buffer = 0;

		/**
		* Resets (empties) the [vertices buffer]{@link DrawingsHandler#vertices_buffer}.
		* @memberOf DrawingsHandler#
		* @private
		*/
		function resetVerticesBuffer()
		{
			vertices_buffer = [];
			number_of_vertices_in_buffer = 0;
		}
	
		/**
		* Creates an array with several elements matching the 
		* [current drawing color]{@link DrawingsHandler#current_drawing_color}.
		* @param {number} number_of_color_elements The number of color elements to be stored in the array.
		* @returns {number[]} An array with it's number of entries equal to 4 times the number of elements 
		* specified. Every 4 entries match the RGBA color of the 
		* [current drawing color]{@link DrawingsHandler#current_drawing_color}.
		* @memberOf DrawingsHandler#
		* @private
		*/
		function createArrayWithCurrentColor(number_of_color_elements)
		{
			var colors = [];
			for(var i=0;i<number_of_color_elements;i++)
			{
				colors.push(current_drawing_color[0]);
				colors.push(current_drawing_color[1]);
				colors.push(current_drawing_color[2]);
				colors.push(current_drawing_color[3]);
			}
			return colors;
		}

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/

		/**
		* Sets the [current drawing color]{@link DrawingsHandler#current_drawing_color}.
		* @param {number[]} color The new color to be used for drawing. The RBGA pattern is expected. 
		* Expects 4 numbers between or equal to 0 and 1 representing the colors Red, Green, Blue 
		* and the opacity Alpha, in that order.
		* @public
		*/
		that.setDrawingColor = function(color)
		{
			current_drawing_color = color;
		}
	
		/**
		* Begin buffering the vertices that will be drawn.
		* It's expected to be followed by sequences of
		* [pushVertex2d]{@link DrawingsHandler#pushVertex2d} or
		* [pushVertex3d]{@link DrawingsHandler#pushVertex3d},
		* followed by [endDrawing]{@link DrawingsHandler#endDrawing}.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for the drawing.
		* This will be set as the [current webgl context]{@link DrawingsHandler#current_webgl_context}.
		* @param {ShaderProgram} shader_program The Shader Program that should be used.
		* This will be set as the [current shader program]{@link DrawingsHandler#current_shader_program}.
		* @param {WebGLPrimitive} primitive The primitive that should be used for the drawing.
		* This will be set as the [current drawing primitive]{@link DrawingsHandler#current_drawing_primitive}.
		* @public
		*/
		that.beginDrawing = function(webgl_context,shader_program,primitive)
		{
			current_shader_program = shader_program;
			current_webgl_context = webgl_context;
			current_drawing_primitive = primitive;

			resetVerticesBuffer();
		}
	
		/**
		* Draws the vertices stored in the [vertices buffer]{@link DrawingsHandler#vertices_buffer} with
		* the methods [pushVertex2d]{@link DrawingsHandler#pushVertex2d} and
		* [pushVertex3d]{@link DrawingsHandler#pushVertex3d}, using the
		* [current webgl context]{@link DrawingsHandler#current_webgl_context},
		* [current shader program]{@link DrawingsHandler#current_shader_program} and
		* [current drawing primitive]{@link DrawingsHandler#current_drawing_primitive} set
		* by the method [beginDrawing]{@link DrawingsHandler#beginDrawing}.
		* @public
		*/
		that.endDrawing = function()
		{
			that.drawVertices3d(current_webgl_context,current_shader_program,current_drawing_primitive,vertices_buffer,number_of_vertices_in_buffer);
			resetVerticesBuffer();
		}
	
		/**
		* Adds a two dimensional (two entries) vertex to the 
		* [vertices buffer]{@link DrawingsHandler#vertices_buffer}.
		* It's expected to be preceeded by [beginDrawing]{@link DrawingsHandler#beginDrawing}.
		* It's expected to be followed by [endDrawing]{@link DrawingsHandler#endDrawing}.
		* Note: This two dimensional vertex is actually treated as a three dimensional vertex, with it's third
		* coordinate set to zero. It doesn't conflict with [pushVertex3d]{@link DrawingsHandler#pushVertex3d} but
		* it's mixed use should be avoided to improve code organization.
		* @param {number} x The first coordinate of the two dimensional vertex to be buffered.
		* @param {number} y The second coordinate of the two dimensional vertex to be buffered.
		* @public
		*/
		that.pushVertex2d = function(x,y)
		{
			that.drawVertex3d(x,y,0.0);
		}
	
		/**
		* Adds a three dimensional (three entries) vertex to the 
		* [vertices buffer]{@link DrawingsHandler#vertices_buffer}.
		* It's expected to be preceeded by [beginDrawing]{@link DrawingsHandler#beginDrawing}.
		* It's expected to be followed by [endDrawing]{@link DrawingsHandler#endDrawing}.
		* @param {number} x The first coordinate of the three dimensional vertex to be buffered.
		* @param {number} y The second coordinate of the three dimensional vertex to be buffered.
		* @param {number} z The third coordinate of the three dimensional vertex to be buffered.
		* @public
		*/
		that.pushVertex3d = function(x,y,z)
		{
			vertices_buffer.push(x);
			vertices_buffer.push(y);
			vertices_buffer.push(z);

			number_of_vertices_in_buffer++;
		}
		
		/**
		* Draws the given three dimesional vertices using the given WebGL primitive.
		* Uses the [current drawing color]{@link DrawingsHandler#current_drawing_color} set
		* by the method [setDrawingColor]{@link DrawingsHandler#setDrawingColor}.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for the drawing.
		* @param {ShaderProgram} shader_program The Shader Program that should be used.
		* @param {WebGLPrimitive} primitive The primitive that should be used for the drawing.
		* @param {number[]} vertices The array containing the entries of the vertices that should be drawn.
		* It's expected three entries per vertex.
		* @param {number} number_of_vertices The number of vertices in the array provided.
		* @public
		*/
		that.drawVertices3d = function(webgl_context,shader_program,primitive,vertices,number_of_vertices)
		{
			var colors = createArrayWithCurrentColor(number_of_vertices);
			that.drawVerticesColor3d(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices);
		}
		
		/**
		* Draws the given two dimesional vertices using the given WebGL primitive.
		* Uses the [current drawing color]{@link DrawingsHandler#current_drawing_color} set
		* by the method [setDrawingColor]{@link DrawingsHandler#setDrawingColor}.
		* Note: The two dimensional vertices are actually treated as three dimensional vertices, with their third
		* coordinate set to zero.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for the drawing.
		* @param {ShaderProgram} shader_program The Shader Program that should be used.
		* @param {WebGLPrimitive} primitive The primitive that should be used for the drawing.
		* @param {number[]} vertices The array containing the entries of the vertices that should be drawn.
		* It's expected two entries per vertex.
		* @param {number} number_of_vertices The number of vertices in the array provided.
		* @public
		*/
		that.drawVertices2d = function(webgl_context,shader_program,primitive,vertices,number_of_vertices)
		{
			var colors = createArrayWithCurrentColor(number_of_vertices);
			that.drawVerticesColor2d(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices);
		}
		
		/**
		* Draws the given three dimesional vertices using the given WebGL primitive and a color
		* per vertex.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for the drawing.
		* @param {ShaderProgram} shader_program The Shader Program that should be used.
		* @param {WebGLPrimitive} primitive The primitive that should be used for the drawing.
		* @param {number[]} vertices The array containing the entries of the vertices that should be drawn.
		* It's expected three entries per vertex.
		* @param {number[]} colors The array containing the color of the vertices that should be drawn.
		* The colors should follow the same order of the vertices. A color is expected per vertex.
		* It's expected four entries per color. Each entry should be a number from 0 to 1 (including).
		* The entries represent the Red intensity, Green intensity, Blue intensity and 
		* Alpha transparency of the color, in that order.
		* @param {number} number_of_vertices The number of vertices (and colors) in the array(s) provided.
		* @public
		*/
		that.drawVerticesColor3d = function(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices)
		{
			var vertex_position_webgl_buffer = new ArrayWebGLBuffer(webgl_context,vertices,3,number_of_vertices);
			var vertex_color_webgl_buffer = new ArrayWebGLBuffer(webgl_context,colors,4,number_of_vertices);
		
			webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, vertex_position_webgl_buffer.content);
			webgl_context.vertexAttribPointer(shader_program.vertexPositionAttribute, vertex_position_webgl_buffer.item_size, webgl_context.FLOAT, false, 0, 0);

			webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, vertex_color_webgl_buffer.content);
			webgl_context.vertexAttribPointer(shader_program.vertexColorAttribute, vertex_color_webgl_buffer.item_size, webgl_context.FLOAT, false, 0, 0);

			webgl_context.drawArrays(primitive, 0, number_of_vertices);
		}
		
		/**
		* Draws the given thow dimesional vertices using the given WebGL primitive and a color
		* per vertex.
		* Note: The two dimensional vertices are actually treated as three dimensional vertices, with their third
		* coordinate set to zero.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for the drawing.
		* @param {ShaderProgram} shader_program The Shader Program that should be used.
		* @param {WebGLPrimitive} primitive The primitive that should be used for the drawing.
		* @param {number[]} vertices The array containing the entries of the vertices that should be drawn.
		* It's expected two entries per vertex.
		* @param {number[]} colors The array containing the color of the vertices that should be drawn.
		* The colors should follow the same order of the vertices. A color is expected per vertex.
		* It's expected four entries per color. Each entry should be a number from 0 to 1 (including).
		* The entries represent the Red intensity, Green intensity, Blue intensity and 
		* Alpha transparency of the color, in that order.
		* @param {number} number_of_vertices The number of vertices (and colors) in the array(s) provided.
		* @public
		*/
		that.drawVerticesColor2d = function(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices)
		{
			// Converts the two dimensional vertices to three dimensional ones.
			var vertices3d = [];
			for(var i=0;i<number_of_vertices;i++)
			{
				vertices3d.push(vertices[2*i]);
				vertices3d.push(vertices[(2*i)+1]);
				vertices3d.push(0.0);
			}
			// Draw the two dimensional vertices as three dimensional ones.
			that.drawVerticesColor3d(webgl_context,shader_program,primitive,vertices3d,colors,number_of_vertices);
		}
	}
	
	return DrawingsHandler;
});
