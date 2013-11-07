/*
 * {Author} luofei02 		2013-11-06
 * {Object} FE 				全局入口函数
 * {Function} init 			页面初始化或者resize事件发生时的处理方法
 * {Function} reload		重新计算可用的div绘制title
 * {Array} titleList		存储前一时刻显示标题的div，供reload重绘 
 *
 */
var FE = {
	init: function(wrapper) {
		var offW = _d.body.offsetWidth,
			offH = _d.body.offsetHeight,
			trueW, trueH;
		if (offW < 1224) {
			trueW = Math.floor(offW / 102) * 102;
			// console.log(trueW)
			// wrapper.width(trueW);
		} else {
			// wrapper.width(1224);
			trueW = 1224;
		}
		wrapper.width(trueW);

		if (offH < 612) {
			trueH = Math.floor(offH / 102) * 102;
		} else {
			trueH = 612;
		}
		wrapper.height(trueH);
		wrapper.css('margin-top', (offH - trueH) / 2);
		// wrapper.height(offH);
		// wrapper.width(document.body.offsetWidth);
	},
	// 存储当前已经显示的div编号
	titleList: [],
	cache: [],
	reload: function() {
		// 随机5个项目 测试的是72个项目
		var _idx = {}, 
			i = 0, j = 0, len, tmp,
			_w = wrapper.width(), 	// wrapper的宽度
			_h = wrapper.height(), 	// wrapper的高度
			_eColumns, 				// 当前wrapper中的有效列
			_eRows, 				// 当前wrapper中的有效行
			_eShow = [], 			// 需要显示标题的div编号
			all, 					// 所有可用的div
			opp = false;

		_eColumns = Math.floor(_h / 102);
		_eRows = Math.floor(_w / 102);
		all = _eRows * _eColumns;

		// 重绘前清空之前信息
		for (i = 0; len = FE.titleList.length, i < len; i++) {
			tmp = FE.titleList[i];
			contains[tmp].innerHTML = "";
			$(contains[tmp]).removeClass().addClass('block');
		}
		FE.titleList.length = 0;

		/*
		 * {Function} getRandomGT12			获取大于12的数中的5个随机不重复数
		 * {Number}   all					目标范围
		 * {Return}   result				获取的5个不重复随机数
		 *
		 */
		function getRandomGT12(all) {
			var tmp = {}, i = 0,
				_num,
				result = [];

			for (; ;) {
				_num = Math.floor(Math.random() * all);
				if (!_num)
					continue;
				if (i === 5)
					break;
				if (tmp[_num] === undefined) {
					i += 1;
					tmp[_num] = _num;
					result.push(_num);
				}
			}
			return result;
		}

		/*
		 * {Function}  getRandomLT12		获取0-12中指定个数的随机数
		 * {Number}    all					目标范围
		 * {Number}    target				随机数个数
		 * {Return}	   result				随机的5个随机数
		 *
		 */
		function getRandomLT12(all, target) {
			var tmp = {}, i = 0,
				_num,
				result = [];

			for (; ;) {
				_num = Math.floor(Math.random() * all);
				if (!_num)
					continue;
				if (i === target)
					break;
				if (tmp[_num] === undefined) {
					i += 1;
					tmp[_num] = _num;
					result.push(_num);
				} else {
					if (_num >= all / 2) {
						while(_num < all - 1) {
							_num += 1;
							if (tmp[_num] === undefined) {
								i += 1;
								tmp[_num] = _num;
								result.push(_num);
								break;
							}
						}
					} else {
						while(_num > 0) {
							_num -= 1;
							if (tmp[_num] === undefined) {
								i += 1;
								tmp[_num] = _num;
								result.push(_num);
								break;
							}
						}
					}
				}
			}
			return result;
		}

		if (all > 12) {
			_eShow = getRandomGT12(all);
		} else {
			if (all > 5) {
				_eShow = getRandomLT12(all, 5);
			} else {
				_eShow = getRandomLT12(5, all);
				opp = true;
			}
		}
		this.createItem(_eShow, opp);
		// for (i = 0; ;) {
		// 	//{**tag**} 需改进_只有12个div时的随机数取法
		// 	var all = _eRows * _eColumns,
		// 		_num = Math.floor(Math.random() * all);
		// 	if (all >= 12) {	
		// 		if (!_num)
		// 			// alert('fvck!!!');
		// 			continue;
		// 		if (i === 5)
		// 			break;
		// 		if (_idx[_num] !== 'undefined') {
		// 			i += 1;
		// 			_idx[_num] = _num;
		// 			FE.titleList.push(_num);
		// 			if (!_num)
		// 				alert('error!!!');
		// 			// console.log('now _num is:', _num, _idx[_num]);
		// 			contains[_num].className += " " + _color[i - 1] + " cursor-pointer";
		// 			contains[_num].innerHTML = "<span class='i-idx'>0" + i + "</span>" +
		// 			 						   "<span class='i-title'>" + _title[i - 1] + "</span>";
		// 			// contains.off('hover');
		// 		}
		// 	} else {
		// 		// 5 - 12之间, 采用hash去重，key值选为1, 以all / 2为界，小于的向后hash，大于的向前hash
		// 		if (all > 5) {
		// 			if (i === 5)
		// 				break;
		// 			if (_idx[_num] !== 'undefined') {
		// 				i += 1;
		// 				_idx[_num] = _num;
		// 				FE.titleList.push(_num);
		// 				contains[_num].className += " " + _color[i - 1] + " cursor-pointer";
		// 				contains[_num].innerHTML = "<span class='i-idx'>0" + i + "</span>" +
		// 			 						       "<span class='i-title'>" + _title[i - 1] + "</span>";
		// 			} else {
		// 				do {
		// 					_num += 1;
		// 				} while (_idx[_num] === 'undefined' || _num >= all)
		// 				if (_num < all) {
		// 					i += 1;
		// 					_idx[_num] = _num;
		// 					FE.titleList.push(_num);
		// 					contains[_num].className += " " + _color[i - 1] + " cursor-pointer";
		// 					contains[_num].innerHTML = "<span class='i-idx'>0" + i + "</span>" +
		// 			 						       "<span class='i-title'>" + _title[i - 1] + "</span>";
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	},
	/*
	 * {Function} createItem		创建标题
	 * {Array} 	  arr 				显示div的编号数组
	 * {Boolean}  opp 				是否是小范围显示
	 *
	 */
	createItem: function(arr, opp) {
		var i = 0, _num,
			len = arr.length;
		// console.log(arr);
		this.titleList.length = 0;
		if (opp) {
			for (; i < len; i++) {
				_num = arr[i];
				this.titleList.push(i);
				contains[i].className += " " + _color[_num] + " cursor-pointer";
				contains[i].innerHTML = "<span class='i-idx'>0" + (_num + 1) + "</span>" +
						 				"<span class='i-title'>" + _title[_num] + "</span>" +
						 				"<div class='details' title='" + _title[_num] + "'>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"<div class='item'></div>" +
						 				"</div>";
			}
		} else {
			for (; i < len; i++) {
				_num = arr[i];
				this.titleList.push(_num);
				contains[_num].className += " " + _color[i] + " cursor-pointer";
				contains[_num].innerHTML = "<span class='i-idx'>0" + (i + 1) + "</span>" +
						 				   "<span class='i-title'>" + _title[i] + "</span>" +
						 				   "<div class='details' title='" + _title[_num] + "'>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "<div class='item'></div>" +
						 				   "</div>";
			}
		}
	},
	getProperty: function(_p) {
		var _gpo = wrapper.offset(),
			_gpw = wrapper.width(),
			_gph = wrapper.height(),
			_sX = _gpo.left,
			_sY = _gpo.top,
			_eX = _sX + _gpw,
			_eY = _sY + _gph,
			i = 0, j = 0, len,
			_pp = [],
			tmpX, tmpY;

		for (; i < 2; i++) {
			for (; len = position[i].length, j < len; j++) {
				tmpX = position[i][j][0] * 102 + _p.x;
				tmpY = position[i][j][1] * 102 + _p.y;
				// 判断一个矩形是否在另一个矩形内：确保左上角和右下角都在矩形内就OK
				if (tmpX >= _sX && tmpX <= _eX && tmpY >= _sY && tmpY <= _eY) {
					tmpX += 102;
					tmpY += 102;
					if (tmpX >= _sX && tmpX <= _eX && tmpY >= _sY && tmpY <= _eY)
						_pp.push({
							x: tmpX - 102,
							y: tmpY - 102
						});
				}
			}
		}

		return _pp;
	}
}

$(window).on('resize', function() {
	// console.log('resize!!!!');
	FE.init($('.wrapper'));
	FE.reload();

	// 每次resize都需要清空cache
	FE.cache.length = 0;
});

// 取消双击选中文字事件
$(document).on('selectstart', function() {
	return false;
});

$(function() {
	wrapper = $('.wrapper');
	contains = $('.block');
	FE.init(wrapper);
	// contains.each(function(i) {
	// 	this.id = i;
	// });
	contains.hover(
		function(e) {
				$(this).stop().animate({opacity: 1}, 10);
		}, function(e) {
				$(this).stop().animate({opacity: 0.5}, 1000);
	});

	FE.reload();
});

/*
 * 为标题div绑定点击事件
 *
 */
 $(function() {
 	// 为标题热绑定事件
 	$(document).on('click', '.cursor-pointer', function() {
 		// console.log('click!!!');
 		var con = $('.details', $(this)),
 			children = con.children(),
 			p = $(this).position(),
 			xyArr = [],
 			i = 0, len, tmp;
 			// o = $(this).offset();
 		// console.log(children);
 		// console.log(p);
 		this.open = this.open ? false : true;
 		if (this.open) {
	 		xyArr = FE.getProperty({
	 			x: p.left,
	 			y: p.top
	 		});
	 		for (; len = FE.titleList.length, i < len; i++) {
	 			tmp = contains[FE.titleList[i]];
	 			if (tmp !== this && tmp) {
	 				// alert(tmp.className + 'hello');
		 			FE.cache.push({
		 				idx: FE.titleList[i],
		 				data: tmp.innerHTML,
		 				class: tmp.className,
		 				p: $(tmp).position()
		 			});
		 			tmp.innerHTML = '';
		 			$(tmp).removeClass().addClass('block');
		 		}
	 		}
	 		// console.log(xyArr);
	 		// for (var i = 0; var len = children.length, i < len; i++) {

	 		// }
	 		// console.log(this.open);
	 		children.each(function(i) {
	 			$(this).stop().show().animate({
	 				left: xyArr[i].x - p.left,
	 				top: xyArr[i].y - p.top,
	 				opacity: 1
	 			}, 500);
	 		})
	 	} else {
	 		// alert('hide')
	 		// children.hide();
	 		children.each(function() {
	 			var _this = this, deg;
	 			deg = [-1, 1][Math.floor(Math.random() * 2)] * Math.ceil(Math.random() * 50);
	 			// console.log(+new Date(), wrapper.offset().top + wrapper.height());
	 			$(this).stop().css("-webkit-transform", "rotate(" + deg +"deg)").animate({
	 				top: wrapper.offset().top + wrapper.height(),
	 				// left: 100,
	 				// "-webkit-transform": "rotate(50deg)",
	 				opacity: 0
	 			}, 500, function() {
	 				// console.log(+new Date());
	 				$(_this).css({
	 					left: 61,
	 					top: 61,
	 					"-webkit-transform": "rotate(0)" // 旋转角度归位
	 				}).hide();
	 			})
	 		});

	 		// 标题的动画效果
	 		var con = $('.animate'),
	 			ins; // 最新插入的节点
	 		for (i = 0; len = FE.cache.length, i < len; i++) {
	 			tmp = FE.cache[i];
	 			con.append('<div class="block">' + tmp.data + '</div>');
	 			ins = con.children().last();
	 			ins[0].className = tmp.class;
	 			;(function(ins, tmp) {
		 			ins.show().css({
		 				left: tmp.p.left,
		 				top: 0
		 			}).animate({
		 				top: tmp.p.top
		 			// 自由落体时间
		 			}, Math.sqrt(tmp.p.top / 5) * 50).animate({
		 				top: '-=20'
		 			}, 100).animate({
		 				top: tmp.p.top
		 			}, 100).animate({
		 				top: '-=10'
		 			}, 100).animate({
		 				top: tmp.p.top
		 			}, 100, function() {
		 				ins.remove();
		 				contains[tmp.idx].innerHTML = tmp.data;
		 				contains[tmp.idx].className = tmp.class;
		 				// 动画做完即清空cache
		 				FE.cache.length = 0;
		 			});
	 			})(ins, tmp);
	 		}
	 	}
 	});
 });