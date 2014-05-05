console.clear();
console.log('Unit test start');
document.getElementById('content').innerHTML = '<div id="test" class="test" style="width: 100px; height: 100px; border: 1px solid #999;"></div>';
document.getElementById('text').innerHTML = 'Background of the DIV must be red (#FF0000)';
yp.addcss('resource/test/css/small.css', function(e) {
	console.log('Unit test stop');
	console.assert(/#ff0000|rgb\(255\, 0\, 0\)/i.test(getComputedStyle(document.getElementById('test')).backgroundColor), 'Background is not red "#FF0000" / "rgb(255, 0, 0)" after yespix.addcss()');
//	alert(getComputedStyle(document.getElementById('test')).backgroundColor);
});