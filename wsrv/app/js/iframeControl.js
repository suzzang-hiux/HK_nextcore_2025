window.onclick = function(event) {
    if(top != window) {
		top.$('.close').click();
	}
}
$(document).ready(function(){
	document.documentElement.setAttribute('data-theme', top.document.documentElement.getAttribute('data-theme'));
	$(document).on('mousewheel', function (e) {
		parent.wheelOnce && parent.wheelOnce(e);
	})
})