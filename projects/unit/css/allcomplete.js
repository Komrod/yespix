console.clear();
console.log('Unit test start');
document.getElementById('content').innerHTML = '<div id="test" class="test" style="width: 100px; height: 100px; border: 1px solid #999;"></div>';
document.getElementById('text').innerHTML = 'allComplete must be True at the end of the load<br/>';
window.count = 0;
yp.addcss(['resource/test/css/small.css', 'resource/test/css/medium.css', 'resource/test/css/large.css'], function(e) {
	window.count++;
	document.getElementById('text').innerHTML += '<br/> allComplete = '+e.allComplete;
	if (e.allComplete && e.index<2)
	{
		console.error('e.allComplete must not be true at index '+e.index);
	} else if (yp.isUndefined(e.allComplete))
	{
		console.error('e.allComplete must not be undefined');
	}
	if (e.index==2)
	{
		console.log('Unit test stop');
		console.assert(e.allComplete, 'e.allComplete must be True at index 2');
	} else 
	{

	}
});

