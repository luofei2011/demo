$(function() {
	var calendar = {
		nowDay: '',
		getNextAndPrevMonth: function(str) {
			var _now = typeof str === 'undefined' ? new Date() : (typeof str === 'object' ? str : new Date(str)),
				_nY = _now.getFullYear(),
				_nM = _now.getMonth() + 1,
				_nextY = _nY,
				_nextM = _nM,
				_prevY = _nY,
				_prevM = _nM;

			if (_nM + 1 > 12) {
				_nextM = 1;
				_nextY += 1;
			} else {
				_nextM += 1;
			}

			if (_nM - 1 < 1) {
				_prevM = 12;
				_prevY -= 1;
			} else {
				_prevM -= 1;
			}

			return {
				prev: new Date(_prevY, _prevM, 0),
				next: new Date(_nextY, _nextM, 0)
			};
		},
		getPrevDay: function(str) {
			var _now = typeof str === 'undefined' ? new Date() : (typeof str === 'object' ? str : new Date(str)),
				_day = _now.getDate(),
				_prevD = _day - 1,
				_prevM = _now.getMonth() + 1,
				_prevY = _now.getFullYear(),
				_other = this.getNextAndPrevMonth(str).prev;

			if (_prevD <= 0) {
				_prevD = _other.getDate();
				_prevM = _other.getMonth() + 1;
				_prevY = _other.getFullYear();
			}

			return new Date(_prevY, _prevM - 1, _prevD);
		},
		getNextDay: function(str) {
			var _now = typeof str === 'undefined' ? new Date() : (typeof str === 'object' ? str : new Date(str)),
				_day = _now.getDate(),
				_days = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate(),
				_nextD = _day + 1,
				_nextM = _now.getMonth() + 1,
				_nextY = _now.getFullYear(),
				_other = this.getNextAndPrevMonth(str).next;

			if (_nextD > _days) {
				_nextD = 1;
				_nextM = _other.getMonth() + 1;
				_nextY = _other.getFullYear();
			}

			return new Date(_nextY, _nextM - 1, _nextD);
		},
		getWeekByDay: function(str) {
			var _now = typeof str === 'undefined' ? new Date() : (typeof str === 'object' ? str : new Date(str)),
				_oMonth = this.getNextAndPrevMonth(),
				_day = _now.getDay() || 7,_week = [],
				_days = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate(),
				tmp = _now,
				_date;

			// 初始化当前天
			_week[_day] = (_now.getMonth() + 1) + '-' + _now.getDate();

			// 得到之前的天数
			for (var i = _day - 1; i > 0; i--) {
				_date = this.getPrevDay(tmp);
				_week[i] = (_date.getMonth() + 1) + '-' + _date.getDate();
				tmp = _date
			}

			tmp = _now;
			// 得到之后的天数
			for (i = _day + 1; i <= 7; i++) {
				_date = this.getNextDay(tmp);
				_week[i] = (_date.getMonth() + 1) + '-' + _date.getDate();
				tmp = _date;
			}

			return _week;
		},
		getTimeArea: function(start, end) {
			var _re = [];
			for (var i = start; i <= end; i++) {
				_re.push(i + ':00');
			}

			return _re;
		},
		_init: function(t) {
			var _html = '',
				container = $('<div class="wc-container"></div>'),
				week = this.getWeekByDay(t), i = 0, len,
				wName = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

			this.nowDay = t ? t : new Date();

			_html += '<div class="weekc-top"><table class="wc-title"><tr><td style="width: 75px;"><div class="wc-title-cell"><button class="wc-prev"><</button><button style="margin-left:5px;" class="wc-next">></button></div></td>'

			for (i = 1, len = week.length; i < len; i++) {
				_html += '<td><div class="wc-title-cell">' + week[i] + ' ' + wName[i - 1] + '</div></td>';
			}

			_html += '</tr></table></div>';

			container.append(_html);
			container.append('<div class="wkconent-borderBottom"></div>');

			$('div.week-calendar').append(container);

			_html = '<div class="wk-content"><div class="wk-scrollevents-mask"><table class="wk-table"><tr style="height: 1px;"><td style="width: 75px;"></td><td colspan=7><div class="wk-mask"><div class="wk-line-wrapper">';

			week = this.getTimeArea(8, 19);

			for (i = 0, len = week.length; i < len; i++) {
				_html += '<div class="wk-line-cell"><div class="wk-line-top"';
				if (!i)
					_html += ' style="border-top:0;"';
				_html += '></div></div>';
			}

			_html += '</div></div></td></tr></table></div></div><div class="wkconent-borderBottom"></div>';

			container.append(_html);

			_html = '<tr><td class="wkday-times">';

			for (i = 0; i < len; i++) {
				_html += '<div class="wkday"><div class="wkday-time"';
				if (i == len - 1)
					_html += ' style="border:0;"';
				_html += '>' + week[i] + '</div></div>';
			}

			_html += '</td>';

			week = this.getWeekByDay(t);
			var day = new Date().getMonth() + 1 + '-' + new Date().getDate(),
				tdHeight = $('div.wk-line-wrapper').height();

			for (i = 1, len = week.length; i < len; i++) {
				_html += '<td class="wkday-cell">';
				if (week[i] === day)
					_html += '<div class="today-mask" style="width: 100%;height:'+tdHeight+'px;margin-top:-2px;"></div>';
				_html += '<div class="wkday-events"></div></td>';
			}
			_html += '</tr>';
			$('table.wk-table tbody').append(_html);

			this.bindEvent();

			// 根据配置文件生成事件列表
			this.showEventList(t);
		},
		showEventList: function(d) {
			var week = this.getWeekByDay(d), i = 0, j = 0,
				len = event_list.length,
				tdCell = $('td.wkday-cell'),
				e,
				html = "",
				date,
				dateStr;

			for (; i < 7; i++) {
				for (j = 0; j < len; j++) {
					date = new Date(event_list[j].date);
					dateStr = date.getMonth() + 1 + '-' + date.getDate();
					if (dateStr === week[i]) {
						console.log(dateStr, week[i]);
						e = $('<div class="events-list"></div>');
						e.css({
							'position': 'absolute',
							height: get_time_diff(event_list[j].start, event_list[j].end) * 0.7,
							top: get_time_diff('8:00', event_list[j].start) * 0.7
						})
						html += '<h3>' + event_list[j].name + '</h3>';
						html += '<div>' + event_list[j].description + '</div>';
						html += '<div>地点:' + event_list[j].addr + '</div>';
						e.append(html);
						console.log(i);
						tdCell.eq(i - 1).find('div.wkday-events').append(e);

						// 清空数据
						html = "";
					}
				}
			}

			// 私有函数，计算时间差
			function get_time_diff(t1, t2) {
				// 默认采用24小时制, t1格式8:00
				return Math.abs(t1.split(':')[0] - t2.split(':')[0]) * 60 + Math.abs(t1.split(':')[1] - t2.split(':')[1]);
			}
		},
		bindEvent: function() {
			var _this = this,
				dragMask = $('div.new-event-mask'),
				baseTD = $('td.wkday-cell'),
				clickPos,
				isMouseDown = false;

			// baseTD.on('mousedown', function(e) {
			// 	var mPos = {
			// 		x: e.clientX,
			// 		y: e.clientY
			// 	};
			// 	dragMask.show().css({
			// 		width: 0,
			// 		height: 0,
			// 		left: mPos.x,
			// 		right: mPos.y
			// 	});

			// 	clickPos = mPos;
			// 	isMouseDown = true;
			// });

			// baseTD.on('mouseup', function() {
			// 	dragMask.hide();

			// 	// 出现新建任务界面
			// 	console.log('drag end!!!');
			// 	isMouseDown = false;
			// });

			// baseTD.on('mouseover', function(e) {
			// 	if (isMouseDown) {
			// 		var diff = {
			// 			x: e.clientX - clickPos.x,
			// 			y: e.clientY - clickPos.y
			// 		};
			// 		dragMask.css({
			// 			width: + diff.x,
			// 			height: + diff.y
			// 		});

			// 		clickPos = {
			// 			x: e.clientX,
			// 			y: e.clientY
			// 		};
			// 	}
			// });

			$('button.wc-prev').on('click', function() {
				var now = _this.nowDay, i = 0;

				for (; i < 7; i++) {
					now = _this.getPrevDay(now);
				}

				// console.log(now);
				$('div.week-calendar').empty();
				_this._init(now);
			});

			$('button.wc-next').on('click', function() {
				var now = _this.nowDay, i = 0;

				for (; i < 7; i++) {
					now = _this.getNextDay(now);
				}

				$('div.week-calendar').empty();
				_this._init(now);
			});
		}
	};
	calendar._init();
});