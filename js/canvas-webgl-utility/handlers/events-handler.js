define(
function()
{
	/**
	* A Events handler.
	* It's responsible for managing the events that happen in the canvas scene, as well
	* as keeping track of important functions such as the display function.
	* @class EventsHandler
	*/
	var EventsHandler = function(_viewport)
	/** @lends EventsHandler# */
	{
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/

		var viewport = _viewport;

		/**
		* The display function that will be called whenever it's necessary to display elements
		* in the canvas. This function should receive no parameters and return nothing.
		* @type {function}
		* @memberOf EventsHandler#
		* @private
		*/
		var display_function;
		
		/**
		* The loop function that will be called whenever a complete event loop is completed.
		* This function will be called periodically and should receive as parameter 
		* time_elapsed_in_milliseconds, the time elapsed since it's function last call.
		* This functions should not return any value.
		* @type {function}
		* @memberOf EventsHandler#
		* @private
		*/
		var loop_function;

		/**
		* The mouse function that will be called whenever a button is pressed with the mouse
		* on the canvas.
		* This function should receive as parameters 'button', 'x' and 'y': the button pressed,
		* and the coordinates (in porcentage) of the mouse pointer.
		* This functions should not return any value.
		* @type {function}
		* @memberOf EventsHandler#
		* @private
		*/
		var mouse_button_down_function;

		/**
		* The mouse function that will be called whenever a button is released with the mouse
		* on the web page.
		* This function should receive as parameters 'button', 'x' and 'y': the button released,
		* and the coordinates (in porcentage) of the mouse pointer.
		* This functions should not return any value.
		* @type {function}
		* @memberOf EventsHandler#
		* @private
		*/
		var mouse_button_up_function;

		/**
		* The mouse function that will be called whenever the mouse is moved.
		* This function should receive as parameters 'x' and 'y':
		* the coordinates (in porcentage) of the mouse pointer.
		* This functions should not return any value.
		* @type {function}
		* @memberOf EventsHandler#
		* @private
		*/
		var mouse_move_function;

		/**
		* When, in milliseconds, the last event loop happened.
		* This value is used to allow evaluating how long it has been since
		* the last event loop happened.
		* @type {number}
		* @default 0
		* @memberOf EventsHandler#
		* @private
		*/
		var last_time_in_milliseconds = 0;

		/**
		* The main loop function called periodically in the [EventsHandler]{@link EventsHandler}
		* events cycle.
		* Is responsible for the periodic functions calls, such as the
		* [loop function]{@link EventsHandler#loop_function}.
		* @memberOf EventsHandler#
		* @private
		*/
		function loopStep()
		{
			// Request this function call whenever it's possible.
			requestAnimFrame(loopStep);
		
			// Calculate the time elapsed since this function last call.
			var time_now_in_milliseconds = new Date().getTime();
			if(last_time_in_milliseconds != 0)
			{
				var time_elapsed_in_milliseconds = time_now_in_milliseconds - last_time_in_milliseconds;

				// Call the loop_function
				if(loop_function)
				{
					loop_function(time_elapsed_in_milliseconds);
				}
			}
			last_time_in_milliseconds = time_now_in_milliseconds;
		}

		function mouseButtonDownHandler(event)
		{
			var x_percentage = viewport.convertToPercentage(viewport.DIRECTION_HORIZONTAL,event.pageX);
			var y_percentage = viewport.convertToPercentage(viewport.DIRECTION_VERTICAL,event.pageY);
			var button = event.button;
			mouse_button_down_function(button,x_percentage,y_percentage);
		}

		function mouseButtonUpHandler(event)
		{
			var x_percentage = viewport.convertToPercentage(viewport.DIRECTION_HORIZONTAL,event.pageX);
			var y_percentage = viewport.convertToPercentage(viewport.DIRECTION_VERTICAL,event.pageY);
			var button = event.button;
			mouse_button_up_function(button,x_percentage,y_percentage);
		}

		function mouseMoveHandler(event)
		{
			var x_percentage = viewport.convertToPercentage(viewport.DIRECTION_HORIZONTAL,event.pageX);
			var y_percentage = viewport.convertToPercentage(viewport.DIRECTION_VERTICAL,event.pageY);
			mouse_move_function(x_percentage,y_percentage);
		}

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/

		that.MOUSE_LEFT_BUTTON = 0;
		that.MOUSE_MIDDLE_BUTTON = 1;
		that.MOUSE_RIGHT_BUTTON = 2;
	
		/**
		* Sets the current display function. The display function will be called whenever 
		* it's necessary to display elements in the canvas.
		* The display function should receive no parameters and return nothing.
		* @param {function} _display_function The function to be set as the current
		* [display function]{@link EventsHandler#display_function}.
		* @public
		*/
		that.setDisplayFunction= function(_display_function)
		{
			display_function = _display_function;
		}

		that.setMouseButtonDownFunction = function(canvas,_mouse_button_down_function)
		{
			if(mouse_button_down_function)
			{
				canvas.removeEventListener('mousedown', mouseButtonDownHandler);
				canvas.removeEventListener('touchstart', mouseButtonDownHandler);
			}
			mouse_button_down_function = _mouse_button_down_function;
			canvas.addEventListener('mousedown', mouseButtonDownHandler,false);
			canvas.addEventListener('touchstart', mouseButtonDownHandler,false);
		}

		that.setMouseButtonUpFunction = function(_mouse_button_up_function)
		{
			if(mouse_button_up_function)
			{
				document.removeEventListener('mouseup', mouseButtonUpHandler);
				document.removeEventListener('touchend', mouseButtonDownHandler);
				document.removeEventListener('touchcancel', mouseButtonDownHandler);
			}
			mouse_button_up_function = _mouse_button_up_function;
			document.addEventListener('mouseup', mouseButtonUpHandler);
			document.addEventListener('touchend', mouseButtonDownHandler);
			document.addEventListener('touchcancel', mouseButtonDownHandler);
		}

		that.setMouseMoveFunction = function(canvas,_mouse_move_function)
		{
			if(mouse_move_function)
			{
				canvas.removeEventListener('mousemove', mouseMoveHandler);
				canvas.removeEventListener('touchmove', mouseMoveHandler);
			}
			mouse_move_function = _mouse_move_function;
			canvas.addEventListener('mousemove', mouseMoveHandler);
			canvas.addEventListener('touchmove', mouseMoveHandler);
		}
	
		/**
		* Sets the current loop function. The loop function will be called periodically.
		* The loop function should have as parameter time_elapsed_in_milliseconds,
		* the time elapsed since it's the loop function last call.
		* The loop function should return no values.
		* @param {function} _loop_function The function to be set as the current
		* [loop function]{@link EventsHandler#loop_function}.
		* @public
		*/
		that.setLoopFunction = function(_loop_function)
		{
			loop_function = _loop_function;
		}
	
		/**
		* Calls the [display function]{@link EventsHandler#display_function}.
		* @public
		*/
		that.postRedisplay = function()
		{
			display_function();
		}

		/**
		* Initializes the [EventsHandler]{@link EventsHandler} main loop cycle.
		* @public
		*/
		that.initializeMainLoop = function()
		{
			loopStep();
			if(display_function)
				display_function();
		}
	}

	return EventsHandler;
	
});
