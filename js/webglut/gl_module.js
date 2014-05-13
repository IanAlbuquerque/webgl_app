/**
* @fileoverview
* Defines the module that is responsible for initializing the {@link gl} global object.
*/

/**
* The webgl main object.
* @global
*/
var gl;

/**
* The module responsible for initializing the {@link gl} global object.
* @namespace webglut/gl_module
*/

define(
/** @lends webglut/gl_module */ 
function()
{
	/**
	* Initializes the {@link gl} associating it to a canvas element.
	* @param {Canvas} canvas The canvas element to associate the {@link gl}.
	* @throws {Exception}
	* @public
	* @example
	* 	// Gets the document element with the id "main-canvas"
	*	var canvas = document.getElementById("main-canvas");
	* 	// Initialize the gl global object using a "webgl" context associated to the canvas selected
	*	GLModule.initialize(canvas);
	*/
	var initialize = function(canvas)
	{
		try
		{
			gl = canvas.getContext("webgl");
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
			
			var canvasRectangle = canvas.getBoundingClientRect();
			
			gl.viewPortTop = canvasRectangle.top;
			gl.viewPortBottom = canvasRectangle.bottom;
			gl.viewPortLeft = canvasRectangle.left;
			gl.viewPortRight = canvasRectangle.right;
		} 
		catch (exception) 
		{
			exception.name = "Canvas context not found";
			throw exception;
		}
	}

	return{
		initialize: initialize
	};
	
});
