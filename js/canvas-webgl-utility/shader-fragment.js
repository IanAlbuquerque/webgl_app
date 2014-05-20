define(
function()
{
	var ShaderFragment = function()
	{
		this.type = "fragment";
		this.script = "precision mediump float;varying vec4 vColor;void main(void){gl_FragColor = vColor;}";
	}
	return ShaderFragment;	
});
