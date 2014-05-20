define(['canvas-webgl-utility/array-webgl-buffer'],
function(ArrayWebGLBuffer)
{
	/**
	* A canvas drawings handler.
	* It's responsible for creating all the buffers and methods related to drawing a WebGL scene.
	* @class DrawingsHandler
	*/
	var DrawingsHandler = function()
	{	
		var that = this;
		
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
		* Sets the [current color]{@link DrawingsHandler#current_drawing_color} being used for drawing.
		* @param {number[]} color The new color to be used for the drawing. The RBGA pattern is expected. Expects 4 numbers between or equal to 0 and 1 representing the colors Red, Green, Blue and the opacity Alpha, in that order.
		* @public
		* @memberOf DrawingsHandler#
		*/
		that.setDrawingColor = function(color)
		{
			current_drawing_color = color;
		}
	
		/**
		* Draws the vertices stored in the internal vertex buffer. 
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}, and the commands [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d}.
		* @public
		*/
		function resetVerticesBuffer()
		{
			vertices_buffer = [];
			number_of_vertices_in_buffer = 0;
		}
	
		/**
		* Begin drawing a primitive utilizing a vertex buffer. 
		* It's expected to be followed by [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d} as well as [end]{@link webglut/gl_painter~end}.
		* @param {GLPrimitive} primitive The primitive being used for drawing the following vertices.
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
		* Adds a 2 dimensional vertex to the drawing buffer. 
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}.
		* @param {number} x The first coordenate of the 2 dimensional vertice to be drawn.
		* @param {number} y The second coordenate of the 2 dimensional vertice to be drawn.
		* @public
		*/
		that.drawVertex2d = function(x,y)
		{
			that.drawVertex3d(x,y,0.0);
		}
	
		/**
		* Adds a 3 dimensional vertex to the drawing buffer.
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}.
		* @param {number} x The first coordenate of the 3 dimensional vertice to be drawn.
		* @param {number} y The second coordenate of the 3 dimensional vertice to be drawn.
		* @param {number} z The third coordenate of the 3 dimensional vertice to be drawn.
		* @public
		*/
		that.drawVertex3d = function(x,y,z)
		{
			vertices_buffer.push(x);
			vertices_buffer.push(y);
			vertices_buffer.push(z);
			number_of_vertices_in_buffer++;
		}
	
		/**
		* Draws the vertices stored in the internal vertex buffer. 
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}, and the commands [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d}.
		* @public
		*/
		that.endDrawing = function()
		{
			that.drawVertices3d(current_webgl_context,current_shader_program,current_drawing_primitive,vertices_buffer,number_of_vertices_in_buffer);
			resetVerticesBuffer();
		}
	
		/**
		* Draws the vertices stored in the internal vertex buffer. 
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}, and the commands [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d}.
		* @public
		*/
		function createArrayWithCurrentColor(number_of_vertices)
		{
			var colors = [];
			for(var i=0;i<number_of_vertices;i++)
			{
				colors.push(current_drawing_color[0]);
				colors.push(current_drawing_color[1]);
				colors.push(current_drawing_color[2]);
				colors.push(current_drawing_color[3]);
			}
			return colors;
		}
		
		/**
		* Draws the given vertices (in 3 dimensions) using a primitive.
		* @param {GLPrimitive} primitive The GL primitive to be used.
		* @param {number[]} vertices The entries of the vertices. It's expected 3 entries per vertex.
		* @param {number} numVertices The number of vertices to be drawn.
		* @public
		*/
		that.drawVertices3d = function(webgl_context,shader_program,primitive,vertices,number_of_vertices)
		{
			var colors = createArrayWithCurrentColor(number_of_vertices);
			that.drawVerticesColor3d(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices);
		}
	
	
		/**
		* Draws the given vertices (in 2 dimensions) using a primitive.
		* @param {GLPrimitive} primitive The GL primitive to be used.
		* @param {number[]} vertices The entries of the vertices. It's expected 2 entries per vertex.
		* @param {number} numVertices The number of vertices to be drawn.
		* @public
		*/
		that.drawVertices2d = function(webgl_context,shader_program,primitive,vertices,number_of_vertices)
		{
			var colors = createArrayWithCurrentColor(number_of_vertices);
			that.drawVerticesColor2d(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices);
		}

		/**
		* Draws the given vertices (in 3 dimensions) using a primitive and a individual color per vertex.
		* @param {GLPrimitive} primitive The GL primitive to be used.
		* @param {number[]} vertices The entries of the vertices. It's expected 3 entries per vertex.
		* @param {number[]} colors The color of the vertices, in the order that the vertices appear. It's expected 4 color entries per vertex (RGBA).
		* @param {number} numVertices The number of vertices to be drawn.
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
		* Draws the given vertices (in 2 dimensions) using a primitive and a individual color per vertex.
		* @param {GLPrimitive} primitive The GL primitive to be used.
		* @param {number[]} vertices The entries of the vertices. It's expected 2 entries per vertex.
		* @param {number[]} colors The color of the vertices, in the order that the vertices appear. It's expected 4 color entries per vertex (RGBA).
		* @param {number} numVertices The number of vertices to be drawn.
		* @public
		*/
		that.drawVerticesColor2d = function(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices)
		{
			var vertices3d = [];
			for(var i=0;i<number_of_vertices;i++)
			{
				vertices3d.push(vertices[2*i]);
				vertices3d.push(vertices[(2*i)+1]);
				vertices3d.push(0.0);
			}
			that.drawVerticesColor3d(webgl_context,shader_program,primitive,vertices3d,colors,number_of_vertices);
		}
	}
	
	return DrawingsHandler;
});
