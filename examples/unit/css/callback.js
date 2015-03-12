console.clear();
console.log('Unit test start');
document.getElementById('content').innerHTML = '<div id="test" class="test" style="width: 100px; height: 100px; border: 1px solid #999;"></div>';
document.getElementById('text').innerHTML = 'Background of the DIV must be green (#00FF00)';
window.a = 'a';
yp.addcss('resource/test/css/medium.css', function() {
	window.a = 'test';
});
setTimeout(function()
{
	console.log('Unit test stop');
	console.assert(/#00ff00|rgb\(0\, 255\, 0\)/i.test(getComputedStyle(document.getElementById('test')).backgroundColor), 'Background is not green "#00FF00" / "rgb(0, 255, 0)" after yespix.addcss()');
	console.assert(window.a == 'test', 'variable "a" must be equal to "test" after yespix.addcss()');
}, 500);