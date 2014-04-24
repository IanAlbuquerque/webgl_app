requirejs.config({
	// By default load any module IDs from js
	baseUrl: 'js',
	// Except, if the module ID starts with the following names, load from the specified paths.
	paths:
	{
		elements: 'app/elements'
	}
});

requirejs(['app/app','libs/webgl','libs/glMatrix'], function (App) {


	var canvas = document.getElementById("main-canvas");
	try
	{
		App.initialize(canvas);
	}
	catch(exception)
	{
		var errortxt = "";
		errortxt += "An error has occurred\n";
		errortxt += "Error: " + exception.name + "\n";
		errortxt += "Error Description: " + exception.message + "\n\n";
		errortxt += "Click OK to continue\n\n";
		alert(errortxt);
		return;
	}
	
});
