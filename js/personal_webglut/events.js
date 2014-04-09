define(['libs/webgl'],
function(){

	var displayFunction;
	var loopFunction;
	
	var setDisplayFunction= function(_displayFunction)
	{
		displayFunction = _displayFunction;
	}
	
	var setLoopFunction = function(_loopFunction)
	{
		loopFunction = _loopFunction;
	}
	
	var postRedisplay = function()
	{
		displayFunction();
	}
	
	var lastTime = 0;
	
	var tick = function()
	{
		requestAnimFrame(tick);
		if(displayFunction) displayFunction();
		
		var timeNow = new Date().getTime();
		if (lastTime != 0)
		{
			var timeElapsed = timeNow - lastTime;
			if(loopFunction) loopFunction(timeElapsed);
		}
		lastTime = timeNow;
	}
	
	var initialize = function()
	{
		tick();
	}


	return{
		initialize: initialize,
		setDisplayFunction : setDisplayFunction,
		setLoopFunction : setLoopFunction,
		postRedisplay : postRedisplay
	};
	
});
