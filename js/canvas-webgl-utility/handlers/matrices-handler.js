define(['canvas-webgl-utility/exceptions/matrix-stack-empty-exception'],
function(MatrixStackEmptyException)
{
	/**
	* A matrices operations handler.
	* It's responsible for managing all the transformations and matrices-related
	* operations of a WebGL application.
	* @class MatricesHandler
	*/
	var MatricesHandler = function()
	/** @lends MatricesHandler# */
	{
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/

		/**
		* The current model view matrix. It's responsible for storing all the positioning
		* transformations that should be applied to vertices being drawn.
		* @type {glMatrixArrayType}
		* @memberOf MatricesHandler#
		* @private
		*/
		var current_model_view_matrix = mat4.create();

		/**
		* The model view matrix stack.
		* It's responsible for holding several model view matrices in order to deal with 
		* scenes that require storing different model view matrices.
		* @type {glMatrixArrayType[]}
		* @memberOf MatricesHandler#
		* @private
		*/
		var model_view_matrix_stack = [];
	
		/**
		* The current projection matrix. It's responsible for storing the projection 
		* transformations that will be applied to the scene.
		* @type {glMatrixArrayType}
		* @memberOf MatricesHandler#
		* @private
		*/
		var current_projection_matrix = mat4.create();

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/

		/**
		* Pushes a copy of the [current model view matrix]{@link MatricesHandler#current_model_view_matrix} 
		* into the [model view matrix stack]{@link MatricesHandler#model_view_matrix_stack}, preserving
		* it for future uses.
		* Is expected to be used together with the method [mvPopMatrix]{@link MatricesHandler#mvPopMatrix}
		* @public
		*/
		that.mvPushMatrix = function()
		{
			var copy_of_current_model_view_matrix = mat4.create();
			mat4.set(current_model_view_matrix, copy_of_current_model_view_matrix);
			model_view_matrix_stack.push(copy_of_current_model_view_matrix);
		}

		/**
		* Deletes the [current model view matrix]{@link MatricesHandler#current_model_view_matrix}
		* and pops the last pushed matrix from the
		* [model view matrix stack]{@link MatricesHandler#model_view_matrix_stack}, copying it
		* as the new [current model view matrix]{@link MatricesHandler#current_model_view_matrix}.
		* Is expected to be used together with the method [mvPushMatrix]{@link MatricesHandler#mvPushMatrix}.
		* @throws {MatrixStackEmptyException}
		* @public
		*/
		that.mvPopMatrix = function()
		{
			if (model_view_matrix_stack.length == 0) 
			{
				throw new MatrixStackEmptyException();
			}
			current_model_view_matrix = model_view_matrix_stack.pop();
		}

		/**
		* Loads the [current model view matrix]{@link MatricesHandler#current_model_view_matrix}
		* and the [current projection matrix]{@link MatricesHandler#current_projection_matrix} into
		* the given WebGL canvas context and Shader Program.
		* @param {WebGLContext} webgl_context The WebGL canvas context that will be used for 
		* loading the matrices.
		* @param {ShaderProgram} shader_program The Shader Program that will be used for 
		* loading the matrices.
		* @public
		*/
		that.setMatrixUniforms = function(webgl_context,shader_program)
		{
			webgl_context.uniformMatrix4fv(shader_program.pMatrixUniform, false, current_projection_matrix);
			webgl_context.uniformMatrix4fv(shader_program.mvMatrixUniform, false, current_model_view_matrix);
		}

		/**
		* Sets the [current model view matrix]{@link MatricesHandler#current_model_view_matrix}
		* to the identity matrix. Overides any matrix values previously stored.
		* @public
		*/
		that.mvLoadIdentity = function()
		{
			mat4.identity(current_model_view_matrix);
		}
	
		/**
		* Sets the [current projection matrix]{@link MatricesHandler#current_projection_matrix}
		* as the identity matrix. Overides any matrix values previously stored.
		* @public
		*/
		that.pLoadIdentity = function()
		{
			mat4.identity(current_projection_matrix);
		}
	
		/**
		* Sets the [current projection matrix]{@link MatricesHandler#current_projection_matrix}
		* as a three dimensional perspective projection, given the necessary parameters.
		* When using this kind of projection, further objects in the screne will appear smaller
		* than closer objects.
		* @param {number} fovy The fovy aspect of the projection. (The angle of view).
		* @param {number} aspect The aspect ratio of the projection. (The ratio between the viewport width and height).
		* @param {number} near How close objects will still be rendered.
		* @param {number} far How far objects will still be rendered.
		* @public
		*/
		that.pSetPerspective = function(fovy,aspect,near,far)
		{
			mat4.perspective(fovy,aspect,near,far,current_projection_matrix);
		}
	
		/**
		* Multiplies (applies) a translation matrix to the
		* [current model view matrix]{@link MatricesHandler#current_model_view_matrix}.
		* @param {number[]} vector The [x,y,z] vector to translate the scene. 
		* Expects an array with three entries.
		* Use the third coordinate as zero if drawing 2d scenes.
		* @public
		*/
		that.mvTranslate = function(vector)
		{
			mat4.translate(current_model_view_matrix, vector);
		}
	
		/**
		* Multiplies (applies) a scale matrix to the
		* [current model view matrix]{@link MatricesHandler#current_model_view_matrix}.
		* @param {number[]} ratio The [x,y,z] scale ratio of the scene.
		* Expects an array with three entries.
		* Use the third coordinate as one if drawing 2d scenes.
		* @public
		*/
		that.mvScale = function(ratio)
		{
			mat4.scale(current_model_view_matrix,ratio);
		}
	
		/**
		* Multiplies (applies) a rotation matrix to the
		* [current model view matrix]{@link MatricesHandler#current_model_view_matrix}.
		* @param {number} angle_in_radians Angle, in radians, of the rotation.
		* @param {number[]} axe Axe to be used for the rotation. The matrix multiplied
		* will be a rotation around this axe.
		* Expects an array [x,y,z] with three entries.
		* @public
		*/
		that.mvRotate = function(angle_in_radians,axe)
		{
			mat4.rotate(current_model_view_matrix,angle_in_radians,axe);
		}
	
	
		/**
		* Sets the [current projection matrix]{@link MatricesHandler#current_projection_matrix}
		* as a orthographic, given the necessary parameters.
		* When using this kind of projection, further objects in the screne will appear as big
		* as closer objects. This projection should be used for thow dimensional
		* drawings.
		* @param {number} left The left bound of the points of the scene.
		* @param {number} right The right bound of the points of the scene.
		* @param {number} bottom The bottom bound of the points of the scene.
		* @param {number} top The top bound of the points of the scene.
		* @param {number} near How close objects will still be rendered.
		* @param {number} far How far objects will still be rendered.
		* @public
		*/
		that.pOrtho = function(left, right, bottom, top, near, far)
		{
			mat4.ortho(left, right, bottom, top, near, far, current_projection_matrix);
		}
	}
	
	return MatricesHandler;
	
});
