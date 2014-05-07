console.clear();
console.log('Unit test start');
document.getElementById('content').innerHTML = '<div id="test" class="test" style="width: 100px; height: 100px; border: 1px solid #999;"></div>';
document.getElementById('text').innerHTML = 'Background of the DIV must be blue (#0000FF)';
yp.addcss('resource/test/css/large.css', function() {
	console.log('Unit test stop');
	console.assert(/#0000ff|rgb\(0\, 0\, 255\)/i.test(getComputedStyle(document.getElementById('test')).backgroundColor), 'Background is not blue "#0000FF" / "rgb(0, 0, 255)" after yespix.addcss()');
});