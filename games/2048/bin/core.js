/**
 * 2048小游戏核心函数
 * @author luofei
 * @email luofeihit2010@gmail.com
 */
function getColorByValue(v) {
	var arr = {
		2: '#FFF',
		4: '#FF9',
		8: '#FC6',
		16: '#F96',
		32: '#F36',
		64: '#F00',
		128: '#C0F',
		256: '#C06',
		512: '#C03',
		1024: '#0F0',
		2048: '#00F'
	};

	return arr[v];
}

var cord = {
	0: {
		0: 0,
		110: 4,
		220: 8,
		330: 12
	},
	110: {
		0: 1,
		110: 5,
		220: 9,
		330: 13
	},
	220: {
		0: 2,
		110: 6,
		220: 10,
		330: 14
	},
	330: {
		0: 3,
		110: 7,
		220: 11,
		330: 15
	},
}

function Box(option) {
	this.value = option.value;
	this.position = option.position;
	this.container = $('<div class="box"></div>');
	this.container.css({
		'background': getColorByValue(this.value),
		'left': this.position.left,
		'top': this.position.top
	}).text(this.value);


	this.append(this.container);
}

Box.prototype = {
	getUp: function() {
		var start = this.container.position(),
			con, target = false;

		con = start.top - 110;
		while(con >= 0) {
			if (game.position[cord[start.left][con]].isUsed) {
				break;
			} else {
				target = con;
			}
			con -= 110;
		}
		if (target !== false)
			this.go(start, {left: start.left, top: target});
	},

	getDown: function() {
		var start = this.container.position(),
			con, target = false;

		con = start.top + 110;
		while(con <= 330) {
			if (game.position[cord[start.left][con]].isUsed) {
				break;
			} else {
				target = con;
			}
			con += 110;
		}
		if (target !== false)
			this.go(start, {left: start.left, top: target});
	},

	getLeft: function() {
		var start = this.container.position(),
			con, target = false;

		con = start.left - 110;
		while(con >= 0) {
			if (game.position[cord[con][start.top]].isUsed) {
				break;
			} else {
				target = con;
			}
			con -= 110;
		}
		if (target !== false)
			this.go(start, {left: target, top: start.top});
	},

	getRight: function() {
		var start = this.container.position(),
			con, target = false;

		con = start.left + 110;
		while(con <= 330) {
			if (game.position[cord[con][start.top]].isUsed) {
				break;
			} else {
				target = con;
			}
			con += 110;
		}
		if (target !== false)
			this.go(start, {left: target, top: start.top});
	},

	// 具体的移动
	go: function(old, target) {
		this.container.css({
			'top': target.top,
			'left': target.left
		});
		game.position[cord[old.left][old.top]].isUsed = false;
		game.boxList[cord[old.left][old.top]] = undefined;

		game.position[cord[target.left][target.top]].isUsed = true;
		game.boxList[cord[target.left][target.top]] = this;

		game.isMerged = true;
	},

	move: function(type) {
		var map = {up: 'getUp', down: 'getDown', left: 'getLeft', right: 'getRight'};
		this[map[type]]();
	},

	append: function(h) {
		$('div.container').append(h);
	},

	collisionDetect: function(t) {
		var i = 0, len = game.boxList.length,
			tmp;

		for (; i < len; i++) {
			if (game.boxList[i]) {
				tmp = game.boxList[i].container.position();
				if (tmp.left == t.left && t.top == tmp.top) {
					return {
						idx: i,
						box: game.boxList[i]
					}
				}
			}
		}

		return false;
	}
}

var game = {
	position: [],	// 记录表格的位置属性
	boxList: new Array(16), 	// 记录当前已经生成了的盒子的数组列表
	isOver: {},	// 判断是否结束游戏
	score: 0,
	isMerged: false,	// 根据判断是否发生合并事件，用于判断是否允许继续向某个方向移动
	random: function() {
		var rand = Math.floor(Math.random() * 16),
			find = rand;

		if (this.position[rand].isUsed) {
			// 首先以当前值为基准往后找,直到值为16
			while(find < 16) {
				if (this.position[find].isUsed) {
					find += 1;
				} else {
					this.position[find].isUsed = true;
					return {
						position: {
							left: this.position[find].left,
							top: this.position[find].top
						},
						value: find >= 14 ? 4 : 2 // 如果随机数大于14则出现值为4的方块
					};
				}
			}

			find = rand - 1;

			// 若还未找到则往前找
			while(find >= 0) {
				if (this.position[find].isUsed) {
					find -= 1;
				} else {
					this.position[find].isUsed = true;
					return {
						position: {
							left: this.position[find].left,
							top: this.position[find].top
						},
						value: find >= 14 ? 4 : 2 // 如果随机数大于14则出现值为4的方块
					};
				}
			}

			// 走到这里代表不能再产生随机数
			return false;
		} else {
			this.position[rand].isUsed = true;
			return {
				position: {
					left: this.position[rand].left,
					top: this.position[rand].top
				},
				value: rand >= 14 ? 4 : 2 // 如果随机数大于14则出现值为4的方块
			};
		}
	},
	init: function() {
		// 首先初始化一个位置数组用于记录表格中每个表格的位置属性
		var t = $('div.cell'),
			self = this, r;

		t.each(function() {
			var p = $(this).position();
			self.position.push({
				left: p.left,
				top: p.top,
				isUsed: false
			});
		});

		// 第一次
		r = this.random();
		this.boxList[cord[r.position.left][r.position.top]] = new Box(r);

		// 第二次
		r = this.random();
		this.boxList[cord[r.position.left][r.position.top]] = new Box(r);
	},

	updateScore: function(v) {
		$('#score-num').text(v);
	},

	/**
	 * 把每次操作分解为两个基本操作：合并 + 移动；以下两个函数是合并的关键函数
	 * @param {Array} [arr] [待合并的数组]
	 * @param {int} [start] [起始位置]
	 * @param {int} [step] [步长]
	 * @param {Array} [arr] [合并后的数组]
	 */

	// 合并一列或者一行中按照一定顺序出现的相同的项目
	// 当方向键是：top，left时选择的策略
	mergeEqualItemASC: function(arr, start, step, type) {
		var tmp, i = 0, label = step, st = start,
			p;	// 被合并节点的位置属性

		for (; i < 3; i++) {
			if (arr[start]) {
				// 删除原来节点，并且把合并后的节点值加倍
				tmp = arr[start + label];
				if (!tmp) {
					label += label;
					continue;
				}

				if (arr[start].value == tmp.value) {
					p = tmp.container.position();
					game.position[cord[p.left][p.top]].isUsed = false;
					tmp.container.remove();
					arr[start].value = tmp.value * 2;
					arr[start].container.text(arr[start].value);
					arr[start].container.css('background', getColorByValue(tmp.value * 2));


					arr[start + label] = undefined;
					start += label;
					label = step;
					i ++;

					// 添加计分系统
					game.score += tmp.value * 2;
					this.updateScore(this.score);

					this.isMerged = true;
				} else {
					start += label;
					label = step;
					continue;
				}
			}
			start += step;
		}

		// 第二次循环，用于移动
		for (i = 0; i < 4; i++) {
			if (game.boxList[st])
				game.boxList[st].move(type);
			st += step;
		}
	},

	// 当方向键是：right，down时选择的策略
	mergeEqualItemDSC: function(arr, start, step, type) {
		var i = 0, tmp, p, label = step, st = start;

		for (; i < 3; i++) {
			if (arr[start]) {
				tmp = arr[start - label];
				if (!tmp) {
					label += label;
					continue;
				}
				if (arr[start].value == tmp.value) {
					p = tmp.container.position();
					game.position[cord[p.left][p.top]].isUsed = false;
					tmp.container.remove();

					arr[start].value = tmp.value * 2;
					arr[start].container.text(arr[start].value);
					arr[start].container.css('background', getColorByValue(tmp.value * 2));

					arr[start - label] = undefined;
					start -= label;
					label = step;
					i ++;

					// 添加计分系统
					game.score += tmp.value * 2;
					this.updateScore(this.score);

					// 修改标志
					this.isMerged = true;
				} else {
					start -= label;
					label = step;
					continue;
				}
			}
			start -= label;
		}

		for (i = 0; i < 4; i++) {
			if (game.boxList[st])
				game.boxList[st].move(type);

			st -= step;
		}
	}
}

game.init();

$(document).on('keydown', function(e) {
	var i = 0, len = game.boxList.length,
		canMove = false,
		randBox, box;

	game.isMerged = false;
	// HACK  当四角已经堆满box的时候不应该生成新的盒子
	switch(e.keyCode) {
		case 38: // up
		case 40: // down
		case 37: // left
		case 39:
			canMove = true;
			break;
		default:
			canMove = false;
			break;
	}

	if (canMove) {
		if (e.keyCode == 38) {
			for (i = 0; i < 4; i++) {
				game.mergeEqualItemASC(game.boxList, i, 4, 'up');
			}
		}
		if (e.keyCode == 40) {
			for (i = 12; i < 16; i++) {
				game.mergeEqualItemDSC(game.boxList, i, 4, 'down');
			}
		}
		if (e.keyCode == 37) {
			for (i = 0; i < 13; i += 4) {
				game.mergeEqualItemASC(game.boxList, i, 1, 'left');
			}
		}
		if (e.keyCode == 39) {
			for (i = 3; i < 16; i += 4) {
				game.mergeEqualItemDSC(game.boxList, i, 1, 'right');
			}
		}

		if (game.isMerged) {

			randBox = game.random();
			if (randBox) {
				box = new Box(randBox);
				game.boxList[cord[randBox.position.left][randBox.position.top]] = box;
				box.container.hide().fadeIn(200);
			} else {
				game.isOver[e.keyCode] = 1;
				if (game.isOver[37] == 1 && game.isOver[38] == 1 && game.isOver[39] == 1 && game.isOver[40] == 1)
					alert('Game Over!');
			}
		}
	}
})