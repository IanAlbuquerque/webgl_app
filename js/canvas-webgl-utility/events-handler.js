define(
function(){

	var EventsHandler = function()
	{
		var object = this;
		
		/**
		* The display function to be used to display elements in the canvas element.
		* @private
		* @type {function}
		*/
		object.display_function;
	
		/**
		* The loop function to be called every cycle.
		* @private
		* @type {function}
		*/
		object.loop_function;
	
		/**
		* Sets the function to be called whenever it's necessary to display something in the canvas element.
		* This function is expected to have no parameters
		* @param {function()} displayFunction The function to be called as the display function.
		* @public
		*/
		object.setDisplayFunction= function(_display_function)
		{
			object.display_function = _display_function;
		}
	
		/**
		* Sets the function to be called every cycle. The function is expected to have as parameter the time elapsed since it's last call, in milliseconds.
		* @param {function(timeElapsedInMilliseconds)} loopFunction The function to be called as the loop function. Has the time elapsed since it's last call as parameter
		* @public
		*/
		object.setLoopFunction = function(_loop_function)
		{
			object.loop_function = _loop_function;
		}
	
		/**
		* Calls the [display function]{@link webglut/gl_events~displayFunction}.
		* @public
		*/
		object.postRedisplay = function()
		{
			object.display_function();
		}
	
		/**
		* When the last loop function was called, in milliseconds.
		* @private
		* @type {number}
		* @default 0
		*/
		object.last_time_in_milliseconds = 0;
	
	
		/**
		* The main loop structure of the [events]{@link webglut/gl_events} module. Is responsable for the event's handling and function calls.
		* @private
		*/
		object.loopStep = function()
		{
			requestAnimFrame(object.loopStep);
		
			var time_now_in_milliseconds = new Date().getTime();
			if (object.last_time_in_milliseconds != 0)
			{
				var time_elapsed_in_milliseconds = time_now_in_milliseconds - object.last_time_in_milliseconds;
				if(object.loop_function)
				{
					object.loop_function(time_elapsed_in_milliseconds);
				}
			}
			object.last_time_in_milliseconds = time_now_in_milliseconds;
		}
	
		/**
		* Initializes the [events]{@link webglut/gl_events} module periodic cycles.
		* @public
		*/
		object.initializeMainLoop = function()
		{
			object.loopStep();
			if(object.display_function)
				object.display_function();
		}
	}

	return EventsHandler;
	
});
