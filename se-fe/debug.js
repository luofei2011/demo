/*
 * debug功能
 *
 */
$(function() {
	if (isDebug) {
		var test = $('#test');

		$(document).on('keyup', function(e) {
			// console.log(e.keyCode);
			if (e.ctrlKey && e.keyCode === 66) {
				test.stop().animate({
					top: 300
				}, 300).animate({
					top: 250
				}, 300).animate({
					top: 300
				}, 300).animate({
					top: 290
				}, 300, function() {
					// console.log('end!!!');
					test.remove();
				});
			}
		});
	}
});
