console.clear();
console.log('Unit test start');
document.getElementById('content').innerHTML = '<div id="test" class="test" style="width: 100px; height: 100px; border: 1px solid #999;"></div>';
document.getElementById('text').innerHTML = 'Count of loaded files in window.count must be equal to 3<br/>';
window.count = 0;
yp.addcss(['resource/test/css/small.css', 'resource/test/css/medium.css', 'resource/test/css/large.css'], function(e) {
	window.count++;
	document.getElementById('text').innerHTML += '<br/> increment count: '+window.count+'';
	if (e.lastFile && e.progressTotal==100)
	{
		console.log('Unit test stop');
		console.assert(count == 3, 'count must be equal to 3 after yespix.addcss()');
	}
});

