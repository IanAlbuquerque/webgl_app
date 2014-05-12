/**
* @fileoverview
* Defines the module that is responsible for the matrix operations in the canvas scene view.
*/

/**
* The module that is responsible for the matrix operations in the canvas scene view.
* @namespace webglut/matrices
*/
define(
/** @lends webglut/matrices */ 
function(){

	/**
	* The model view matrix. It's responsible for the positioning transformations in the scene.
	* @private
	* @type {Matrix}
	*/
	var mvMatrix = mat4.create();
	
	/**
	* The model view matrix stack.
	* It's responsible for holding several model view matrices in order to deal with scenes that require multiple model view matrices.
	* @private
	* @type {Matrix[]}
	*/
	var mvMatrixStack = [];
	
	/**
	* The projection matrix. It's responsible for the projection transformations in the scene.
	* @private
	* @type {Matrix}
	*/
	var pMatrix = mat4.create();

	/**
	* Pushes a copy of the current [model view matrix]{@link webglut/matrices~mvMatrix} into the stack, preserving it.
	* Is expected to be used together with the function [mvPopMatrix]{@link webglut/matrices~mvPopMatrix}.
	* @public
	* @example
	*	Matrices.mvTranslate([10,0,0]);
	*	// This cube will be only Translated
	*	drawCube();
	*
	*	Matrices.mvPushMatrix();
	*		Matrices.mvRotate(30,[0,0,1]);
	*		// This cube will be Rotated and Translated
	*		drawCube();
	*	Matrices.mvPopMatrix();	
	*
	*	// This cube will be only Translated, exactly as the first one.
	*	drawCube();
	*
	*/
	var mvPushMatrix = function()
	{
		var copy = mat4.create();
		mat4.set(mvMatrix, copy);
		mvMatrixStack.push(copy);
	}

	/**
	* Deletes the current [model view matrix]{@link webglut/matrices~mvMatrix} and recovers the 
	* last [model view matrix]{@link webglut/matrices~mvMatrix} from the stack, setting it as the current one.
	* Is expected to be used together with the function [mvPushMatrix]{@link webglut/matrices~mvPushMatrix}.
	* @public
	* @throws {Exception}
	* @example
	*	Matrices.mvTranslate([10,0,0]);
	*	// This cube will be only Translated
	*	drawCube();
	*
	*	Matrices.mvPushMatrix();
	*		Matrices.mvRotate(30,[0,0,1]);
	*		// This cube will be Rotated and Translated
	*		drawCube();
	*	Matrices.mvPopMatrix();	
	*
	*	// This cube will be only Translated, exactly as the first one.
	*	drawCube();
	*
	*/
	var mvPopMatrix = function()
	{
		if (mvMatrixStack.length == 0) 
		{
		  throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
	}

	/**
	* Loads the [model view matrix]{@link webglut/matrices~mvMatrix} and the [projection matrix]{@link webglut/matrices~pMatrix}.
	* into the scene related to the {@link gl} global object.
	* @public
	* @example
	*	// Implementation of the drawVerticesColor3d function
	*	var drawVerticesColor3d = function(primitive,vertices,colors,numVertices)
	*	{
	*		var vertexPositionBuffer = new Buffers.GLArrayBuffer(vertices,3,numVertices);
	*		var vertexColorBuffer = new Buffers.GLArrayBuffer(colors,4,numVertices);
	*
	*		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer.content);
	*		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	*	
	*		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer.content);
	*		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	*
	*		// Loads the model view and projection matrices and draws the vertices given
	*		Matrices.setMatrixUniforms(gl,shaderProgram);
	*		gl.drawArrays(primitive, 0, numVertices);
	*	}
	*
	*/
	var setMatrixUniforms = function()
	{
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	}

	/**
	* Sets the current [model view matrix]{@link webglut/matrices~mvMatrix} as the identity matrix.
	* @public
	* @example
	*	Matrices.mvLoadIdentity();
	*	// This cube will be free of model view transformations
	*	drawCube();
	*
	*/
	var mvLoadIdentity = function()
	{
		mat4.identity(mvMatrix);
	}
	
	/**
	* Sets the current [projection matrix]{@link webglut/matrices~pMatrix} as the identity matrix.
	* @public
	* @example
	*	Matrices.pLoadIdentity();
	*	// This cube will be free of projection transformations
	*	drawCube();
	*/
	var pLoadIdentity = function()
	{
		mat4.identity(mvMatrix);
	}
	
	
	/**
	* Sets the current [projection matrix]{@link webglut/matrices~pMatrix} as a three dimentional perspective projection, given the necessary parameters.
	* Further objects will appear smaller than close objects.
	* @param {number} fovy The fovy aspect of the projection. (The opening angle of view).
	* @param {number} aspect The aspect ratio of the projection. (The ratio between the view port width and height).
	* @param {number} near How close objects will be rendered.
	* @param {number} far How far objects will be rendered.
	* @public
	* @example
	*	GLModule.initialize(canvas);
	*	ShadersModule.initialize();
	*
	*	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	*	// Defines the perspective of the scene
	*	Matrices.pSetPerspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	*	
	*	Events.setDisplayFunction(display);
	*	Events.setLoopFunction(loop);
	*	Events.initialize();
	*/
	var pSetPerspective = function(fovy,aspect,near,far)
	{
		mat4.perspective(fovy,aspect,near,far,pMatrix);
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
	var mvTranslate = function(vector)
	{
		mat4.translate(mvMatrix, vector);
	}
	
	
	/**
	* Applies a scale to the current [model view matrix]{@link webglut/matrices~mvMatrix}.
	* @param {number[]} ratio The (x,y,z) scale ratio of the scene. Expects an array with three entries.
	* @public
	* @example
	*	Matrices.mvScale([10,5,1]);
	*	// This cube will be not appear as a cube anymore. It will have it's dimentions scaled by the factor (10 times, 5 times, 1 time).
	*	drawCube();
	*/
	var mvScale = function(ratio)
	{
		mat4.scale(mvMatrix,ratio);
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
	var mvRotate = function(angle,axis)
	{
		mat4.rotate(mvMatrix,angle,axis);
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
	* @example
	*	GLModule.initialize(canvas);
	*	ShadersModule.initialize();
	*
	*	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	*	// Used to define the projection of a scene that draws in the XY plane in the interval given by the product [-10,10] x [-10,10]
	*	Matrices.pOrtho(-10,10,-10,10,-1,1);
	*	
	*	Events.setDisplayFunction(display);
	*	Events.setLoopFunction(loop);
	*	Events.initialize();
	*/
	var pOrtho = function(left, right, bottom, top, near, far)
	{
		mat4.ortho(left, right, bottom, top, near, far, pMatrix);
	}
	
	return{
		mvPushMatrix : mvPushMatrix,
		mvPopMatrix : mvPopMatrix,
		setMatrixUniforms : setMatrixUniforms,
		mvLoadIdentity : mvLoadIdentity,
		pLoadIdentity : pLoadIdentity,
		pSetPerspective : pSetPerspective,
		mvTranslate : mvTranslate,
		mvScale : mvScale,
		mvRotate : mvRotate,
		pOrtho : pOrtho,
		mvTranslate : mvTranslate
	};
	
});
