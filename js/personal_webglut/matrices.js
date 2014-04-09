define(['libs/glMatrix'],
function(){

	var mvMatrix = mat4.create();
	var mvMatrixStack = [];
	var pMatrix = mat4.create();
	
	var mvPushMatrix = function()
	{
		var copy = mat4.create();
		mat4.set(mvMatrix, copy);
		mvMatrixStack.push(copy);
	}

	var mvPopMatrix = function()
	{
		if (mvMatrixStack.length == 0) 
		{
		  throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
	}

	var setMatrixUniforms = function(gl,shaderProgram)
	{
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	}
	
	var mvLoadIdentity = function()
	{
		mat4.identity(mvMatrix);
	}
	
	var pLoadIdentity = function()
	{
		mat4.identity(mvMatrix);
	}
	
	var pSetPerspective = function(fovy,aspect,near,far)
	{
		mat4.perspective(fovy,aspect,near,far,pMatrix);
	}
	
	var mvTranslate = function(vector)
	{
		mat4.translate(mvMatrix, vector);
	}
	
	var mvScale = function(vector)
	{
		mat4.scale(mvMatrix,vector);
	}
	
	var mvRotate = function(angle,axis)
	{
		mat4.rotate(mvMatrix,angle,axis);
	}
	
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
