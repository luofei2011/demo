$(function() {
	// $('.item').on('click', function() {
	// 	FE.initCover();
	// });

	// $('.item').hover(function() {
	// 	$('.item-title', $(this)).hide();
	// 	$('ul', $(this)).slideDown();
	// }, function() {
	// 	var _this = this;
	// 	$('ul', $(this)).slideUp(function() {
	// 		$('.item-title', $(_this)).show();
	// 	});
	// });
});

var FE = {
	initCover: function() {
		var div = $('<div id="cover"></div>'),
			detail = $('<div id="detail"></div>'),
			_dw = $(document).width(),
			_dh = $(document).height();

		div.height(_dh);
		div.width(_dw);
		detail.css({
			left: (_dw - 500) / 2,
			top: (_dh - 500) / 2
		});
		$('body').append(div);
		$('body').append(detail);

		// $(document).on('click', function() {
		// 	console.log('click!!!');
		// 	// $('body').remove('#cover');//.remove('#detail');
		// 	$('#cover').remove();
		// 	$('#detail').remove();
		// })
		document.onclick = function(e) {
			// console.log(e.target);
			var target = e.srcElement ? e.srcElement : e.target;
			if (target.id == 'cover') {
				$('#cover').remove();
				$('#detail').remove();
			}
		}
	}
}