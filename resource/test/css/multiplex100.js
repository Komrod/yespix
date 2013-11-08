console.clear();
console.log('Unit test start');
document.getElementById('content').innerHTML = '<div id="test" class="test" style="width: 100px; height: 100px; border: 1px solid #999;"></div>';
document.getElementById('text').innerHTML = 'Count of loaded files in window.count must be equal to 100<br/>';
window.count = 0;
var list = [];
for (var t=1; t<=100; t++) list.push('resource/test/css/file_'+t+'.css');
yp.addcss(list, function(e) {
	window.count++;
	if (e.allComplete)
	{
		console.log('Unit test stop');
		console.assert(window.count == 100, 'count must be equal to 100 after yespix.addcss()');
	} else if (window.count>99)
	{
		if (yp.isUndefined(e.allComplete))
		{
			console.error('e.allComplete must not be undefined');
		}
	}

});

