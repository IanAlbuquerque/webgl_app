requirejs.config({
	// By default load any module IDs from js
	baseUrl: 'js',
	// Except, if the module ID starts with the following names, load from the specified paths.
	paths:
	{
		elements: 'app-classes'
	}
});

requirejs(['main','libs/webgl','libs/glMatrix'], 
function (Main)
{
	Main.main();
});
