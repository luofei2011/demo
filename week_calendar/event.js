var isMD = false;	// 当前鼠标时候按下
var clP;	// 鼠标点击位置
$(document).on('mousedown', function(e) {
	isMD = true;
	clP = {
		x: e.clientX,
		y: e.clientY
	};

	var t = $(e.target),
		offset;
	if (t.hasClass('events-list') || t.closest('div.events-list').length) {
		t = t.hasClass('events-list') ? t : t.closest('div.events-list');
		offset = t.offset();
		t.css({
			position: 'fixed',
			left: offset.left,
			top: offset.top,
			width: t.width(),
			'z-index': 999
		});
	}
});

$(document).on('mouseup', function(e) {
	isMD = false;

	// var t = $(e.target),
	// 	offset;
	// if (t.hasClass('events-list') || t.closest('div.events-list').length) {
	// 	t = t.hasClass('events-list') ? t : t.closest('div.events-list');

	// 	t.css({
	// 		position: 'absolute',
	// 		'z-index': 900
	// 	});
	// }
});

$(document).on('mousemove', 'div.events-list', function(e) {
	var diff;

	if (isMD) {
		console.log('mouse move!!!!!!!!!11');
		diff = {
			x: e.clientX - clP.x,
			y: e.clientY - clP.y
		};
		old = $(this).offset();
		console.log(diff);
		$(this).css({
			left: old.left + diff.x,
			top: old.top + diff.y
		});

		clP = {
			x: e.clientX,
			y: e.clientY
		};
	}
});