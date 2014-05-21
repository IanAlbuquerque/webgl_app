define(
function()
{
	/**
	* A Events handler.
	* It's responsible for managing the events that happen in the canvas scene, as well
	* as keeping track of important functions such as the display function.
	* @class EventsHandler
	*/
	var EventsHandler = function()
	/** @lends EventsHandler# */
	{
		var that = this;

		/*
		-------------------------------------------------------------------------------
		 PRIVATE:
		-------------------------------------------------------------------------------
		*/

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

		/*
		-------------------------------------------------------------------------------
		 PUBLIC:
		-------------------------------------------------------------------------------
		*/
	
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
