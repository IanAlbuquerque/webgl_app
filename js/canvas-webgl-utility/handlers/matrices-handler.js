define(['canvas-webgl-utility/exceptions/matrix-stack-empty-exception'],
function(MatrixStackEmptyException){

	var MatricesHandler = function()
	{
		var object = this;
		
		object.model_view_matrix = mat4.create();

		/**
		* The model view matrix stack.
		* It's responsible for holding several model view matrices in order to deal with scenes that require multiple model view matrices.
		* @private
		* @type {Matrix[]}
		*/
		object.model_view_matrix_stack = [];
	
		/**
		* The projection matrix. It's responsible for the projection transformations in the scene.
		* @private
		* @type {Matrix}
		*/
		object.projection_matrix = mat4.create();

		/**
		* Pushes a copy of the current [model view matrix]{@link webglut/matrices~mvMatrix} into the stack, preserving it.
		* Is expected to be used together with the function [mvPopMatrix]{@link webglut/matrices~mvPopMatrix}.
		* @public
		*/
		object.mvPushMatrix = function()
		{
			var copy = mat4.create();
			mat4.set(object.model_view_matrix, copy);
			object.model_view_matrix_stack.push(copy);
		}

		/**
		* Deletes the current [model view matrix]{@link webglut/matrices~mvMatrix} and recovers the 
		* last [model view matrix]{@link webglut/matrices~mvMatrix} from the stack, setting it as the current one.
		* Is expected to be used together with the function [mvPushMatrix]{@link webglut/matrices~mvPushMatrix}.
		* @public
		* @throws {MatrixStackEmptyException}
		*/
		object.mvPopMatrix = function()
		{
			if (object.model_view_matrix_stack.length == 0) 
			{
				throw new MatrixStackEmptyException();
			}
			object.model_view_matrix = object.model_view_matrix_stack.pop();
		}

		/**
		* Loads the [model view matrix]{@link webglut/matrices~mvMatrix} and the [projection matrix]{@link webglut/matrices~pMatrix}.
		* into the scene related to the {@link gl} global object.
		* @public
		*/
		object.setMatrixUniforms = function(webgl_context,shader_program)
		{
			webgl_context.uniformMatrix4fv(shader_program.pMatrixUniform, false, object.projection_matrix);
			webgl_context.uniformMatrix4fv(shader_program.mvMatrixUniform, false, object.model_view_matrix);
		}

		/**
		* Sets the current [model view matrix]{@link webglut/matrices~mvMatrix} as the identity matrix.
		* @public
		*/
		object.mvLoadIdentity = function()
		{
			mat4.identity(object.model_view_matrix);
		}
	
		/**
		* Sets the current [projection matrix]{@link webglut/matrices~pMatrix} as the identity matrix.
		* @public
		*/
		object.pLoadIdentity = function()
		{
			mat4.identity(object.projection_matrix);
		}
	
	
		/**
		* Sets the current [projection matrix]{@link webglut/matrices~pMatrix} as a three dimentional perspective projection, given the necessary parameters.
		* Further objects will appear smaller than close objects.
		* @param {number} fovy The fovy aspect of the projection. (The opening angle of view).
		* @param {number} aspect The aspect ratio of the projection. (The ratio between the view port width and height).
		* @param {number} near How close objects will be rendered.
		* @param {number} far How far objects will be rendered.
		* @public
		*/
		object.pSetPerspective = function(fovy,aspect,near,far)
		{
			mat4.perspective(fovy,aspect,near,far,object.projection_matrix);
		}
	
		/**
		* Applies a translation to the current [model view matrix]{@link webglut/matrices~mvMatrix}.
		* @param {number[]} vector The (x,y,z) vector to translate the scene. Expects an array with three entries.
		* @public
		* @example
		*	Matrices.mvTranslate([10,5,1]);
		*	// This cube will be only translated according to the vector (10,5,1)
		*	drawCube();
		*/
		object.mvTranslate = function(vector)
		{
			mat4.translate(object.model_view_matrix, vector);
		}
	
	
		/**
		* Applies a scale to the current [model view matrix]{@link webglut/matrices~mvMatrix}.
		* @param {number[]} ratio The (x,y,z) scale ratio of the scene. Expects an array with three entries.
		* @public
		*/
		object.mvScale = function(ratio)
		{
			mat4.scale(object.model_view_matrix,ratio);
		}
	
		/**
		* Applies a rotation to the current [model view matrix]{@link webglut/matrices~mvMatrix}.
		* @param {number} angle Angle, in degrees, to rotate the scene.
		* @param {number[]} axis Axis to be used for the rotation. Expects an array with three entries.
		* @public
		* @example
		*	Matrices.mvRotate(30,[0,1,0]);
		*	// This cube will rotated by 30 degrees in the y axe.
		*	drawCube();
		*/
		object.mvRotate = function(angle_in_radians,axis)
		{
			mat4.rotate(object.model_view_matrix,angle_in_radians,axis);
		}
	
	
		/**
		* Sets the current [projection matrix]{@link webglut/matrices~pMatrix} as a ortographic projection. Usually used for two dimentional drawings.
		* Further objects will appear as big as close objects.
		* @param {number} left The left bound of the points of the scene.
		* @param {number} right The right bound of the points of the scene.
		* @param {number} bottom The bottom bound of the points of the scene.
		* @param {number} top The top bound of the points of the scene.
		* @param {number} near How close objects will be rendered.
		* @param {number} far How far objects will be rendered.
		*/
		object.pOrtho = function(left, right, bottom, top, near, far)
		{
			mat4.ortho(left, right, bottom, top, near, far, object.projection_matrix);
		}
	}
	
	return MatricesHandler;
	
});
