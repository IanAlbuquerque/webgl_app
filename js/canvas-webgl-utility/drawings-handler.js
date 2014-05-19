define(['canvas-webgl-utility/array-webgl-buffer'],
function(ArrayWebGLBuffer)
{

	var DrawingsHandler = function()
	{		
		var object = this;
		
		object.current_shader_program;
		object.current_webgl_context;
		
		/**
		* The current color being utilized for the drawings.
		* @private
		* @type {number[]}
		* @default [1,1,1,1]
		*/
		object.current_drawing_color = [1,1,1,1];

		/**
		* The current GL primitive being utilized for the drawings.
		* @private
		* @type {GLPrimitive}
		*/
		object.current_drawing_primitive;
	
		/**
		* The entries of the vertices being kept on the buffer before being drawn.
		* @private
		* @type {number[]}
		*/
		object.vertices_buffer = [];
	
		/**
		* Number of vertices being kept in buffer.
		* @private
		* @type {number}
		*/
		object.number_of_vertices_in_buffer = 0;

		/**
		* Sets the current color being used for the drawings.
		* @param {number[]} color The new color to be utilized for the drawing. Uses the RBGA system. Expects 4 numbers between or equal to 0 and 1 representing the colors Red, Green, Blue and the opacity Alpha, in object order.
		* @public
		*/
		object.setDrawingColor = function(color)
		{
			object.current_drawing_color = color;
		}
	
		object.resetVerticesBuffer = function()
		{
			object.vertices_buffer = [];
			object.number_of_vertices_in_buffer = 0;
		}
	
		/**
		* Begin drawing a primitive utilizing a vertex buffer. 
		* It's expected to be followed by [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d} as well as [end]{@link webglut/gl_painter~end}.
		* @param {GLPrimitive} primitive The primitive being utilized for drawing the following vertices.
		* @public
		*/
		object.beginDrawing = function(webgl_context,shader_program,primitive)
		{
			object.current_shader_program = shader_program;
			object.current_webgl_context = webgl_context;
			object.current_drawing_primitive = primitive;
			object.resetVerticesBuffer();
		}
	
		/**
		* Adds a 2 dimensional vertex to the drawing buffer. 
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}.
		* @param {number} x The first coordenate of the 2 dimensional vertice to be drawn.
		* @param {number} y The second coordenate of the 2 dimensional vertice to be drawn.
		* @public
		*/
		object.drawVertex2d = function(x,y)
		{
			object.drawVertex3d(x,y,0.0);
		}
	
		/**
		* Adds a 3 dimensional vertex to the drawing buffer.
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}.
		* @param {number} x The first coordenate of the 3 dimensional vertice to be drawn.
		* @param {number} y The second coordenate of the 3 dimensional vertice to be drawn.
		* @param {number} z The third coordenate of the 3 dimensional vertice to be drawn.
		* @public
		*/
		object.drawVertex3d = function(x,y,z)
		{
			object.vertices_buffer.push(x);
			object.vertices_buffer.push(y);
			object.vertices_buffer.push(z);
			object.number_of_vertices_in_buffer++;
		}
	
		/**
		* Draws the vertices stored in the internal vertex buffer. 
		* It's expected to be preceeded by [begin]{@link webglut/gl_painter~begin}, and the commands [vertex2d]{@link webglut/gl_painter~vertex2d} or [vertex3d]{@link webglut/gl_painter~vertex3d}.
		* @public
		*/
		object.endDrawing = function()
		{
			object.drawVertices3d(object.current_webgl_context,object.current_shader_program,object.current_drawing_primitive,object.vertices_buffer,object.number_of_vertices_in_buffer);
			object.resetVerticesBuffer();
		}
	
		object.createArrayWithCurrentColor = function(number_of_vertices)
		{
			var colors = [];
			for(var i=0;i<number_of_vertices;i++)
			{
				colors.push(object.current_drawing_color[0]);
				colors.push(object.current_drawing_color[1]);
				colors.push(object.current_drawing_color[2]);
				colors.push(object.current_drawing_color[3]);
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
		object.drawVertices3d = function(webgl_context,shader_program,primitive,vertices,number_of_vertices)
		{
			var colors = object.createArrayWithCurrentColor(number_of_vertices);
			object.drawVerticesColor3d(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices);
		}
	
	
		/**
		* Draws the given vertices (in 2 dimensions) using a primitive.
		* @param {GLPrimitive} primitive The GL primitive to be used.
		* @param {number[]} vertices The entries of the vertices. It's expected 2 entries per vertex.
		* @param {number} numVertices The number of vertices to be drawn.
		* @public
		*/
		object.drawVertices2d = function(webgl_context,shader_program,primitive,vertices,number_of_vertices)
		{
			var colors = object.createArrayWithCurrentColor(number_of_vertices);
			object.drawVerticesColor2d(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices);
		}

		/**
		* Draws the given vertices (in 3 dimensions) using a primitive and a individual color per vertex.
		* @param {GLPrimitive} primitive The GL primitive to be used.
		* @param {number[]} vertices The entries of the vertices. It's expected 3 entries per vertex.
		* @param {number[]} colors The color of the vertices, in the order that the vertices appear. It's expected 4 color entries per vertex (RGBA).
		* @param {number} numVertices The number of vertices to be drawn.
		* @public
		*/
		object.drawVerticesColor3d = function(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices)
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
		object.drawVerticesColor2d = function(webgl_context,shader_program,primitive,vertices,colors,number_of_vertices)
		{
			var vertices3d = [];
			for(var i=0;i<number_of_vertices;i++)
			{
				vertices3d.push(vertices[2*i]);
				vertices3d.push(vertices[(2*i)+1]);
				vertices3d.push(0.0);
			}
			object.drawVerticesColor3d(webgl_context,shader_program,primitive,vertices3d,colors,number_of_vertices);
		}
	}
	
	return DrawingsHandler;
});
