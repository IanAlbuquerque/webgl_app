/**
* @fileoverview
* Defines the module that is responsible for the events methods, such as display functions and the main loop processing.
*/

/**
* The module that is responsible for the events methods, such as display functions and the main loop processing.
* @namespace webglut/gl_events
*/

define(
/** @lends webglut/gl_events */ 
function(){

	/**
	* The display function to be used to display elements in the canvas element.
	* @private
	* @type {function}
	*/
	var displayFunction;
	
	/**
	* The loop function to be called every cycle.
	* @private
	* @type {function}
	*/
	var loopFunction;
	
	/**
	* Sets the function to be called whenever it's necessary to display something in the canvas element.
	* This function is expected to have no parameters
	* @param {function()} displayFunction The function to be called as the display function.
	* @public
	* @example
	*	// Defines a drawing function
	*	var myDrawings = function()
	*	{
	*
	*		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	*       	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	*		drawCube(); // draw an element in the canvas
	*	}
	*
	*	// Sets the display function to the function "myDrawings"
	* 	Events.setDisplayFunction(myDrawings);
	*
	*/
	var setDisplayFunction= function(_displayFunction)
	{
		displayFunction = _displayFunction;
	}
	
	/**
	* Sets the function to be called every cycle. The function is expected to have as parameter the time elapsed since it's last call, in milliseconds.
	* @param {function(timeElapsedInMilliseconds)} loopFunction The function to be called as the loop function. Has the time elapsed since it's last call as parameter
	* @public
	* @example
	*	// Defines a loop function
	*	var myLoop = function(timeElapsedInMilliseconds)
	*	{
	*		angle = angle + timeElapsedInMilliseconds*5; // Increased the angle to be rotated the elements in the canvas by a factor of 5 degrees per millisecond
	*		Events.postRedisplay();
	*	}
	*
	*	// Sets the display function to the function "myLoop"
	* 	Events.setLoopFunction(myLoop);
	*
	*/
	var setLoopFunction = function(_loopFunction)
	{
		loopFunction = _loopFunction;
	}
	
	/**
	* Calls the [display function]{@link webglut/gl_events~displayFunction}.
	* @public
	* @example
	*	// Defines a loop function
	*	var myLoop = function(timeElapsedInMilliseconds)
	*	{
	*		angle = angle + timeElapsedInMilliseconds*5; // Increased the angle to be rotated the elements in the canvas by a factor of 5 degrees per millisecond
	*		Events.postRedisplay(); // Calls the display function. Every time the angle is updated the new resulting image is shown.
	*	}
	*
	*	// Sets the display function to the function "myLoop"
	* 	Events.setLoopFunction(myLoop);
	*
	*/
	var postRedisplay = function()
	{
		displayFunction();
	}
	
	/**
	* When the last loop function was called, in milliseconds.
	* @private
	* @type {number}
	* @default 0
	*/
	var lastTime = 0;
	
	
	/**
	* The main loop structure of the [events]{@link webglut/gl_events} module. Is responsable for the event's handling and function calls.
	* @private
	*/
	var tick = function()
	{
		requestAnimFrame(tick);
		
		var timeNow = new Date().getTime();
		if (lastTime != 0)
		{
			var timeElapsed = timeNow - lastTime;
			if(loopFunction) loopFunction(timeElapsed);
		}
		lastTime = timeNow;
	}
	
	/**
	* Initializes the [events]{@link webglut/gl_events} module periodic cycles.
	* @public
	* @example
	*	// Initializes the gl and shaders
	*	GLModule.initialize(canvas);
	*	ShadersModule.initialize();
	*
	*	// Sets the projections and viewport
	*	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	*	Matrices.pOrtho(-1,1,-1,1,-1,1);
	*	
	*	// Sets functions to be handled by the events module
	*	Events.setDisplayFunction(display);
	*	Events.setLoopFunction(loop);
	*	// Initializes the module
	*	Events.initialize();
	*/
	var initialize = function()
	{
		tick();
		if(displayFunction) displayFunction();
	}


	return{
		initialize: initialize,
		setDisplayFunction : setDisplayFunction,
		setLoopFunction : setLoopFunction,
		postRedisplay : postRedisplay
	};
	
});
