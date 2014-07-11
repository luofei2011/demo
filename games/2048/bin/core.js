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
	move: function(type) {
		var p = this.container.position(),
			check,
			dt = p.top, dl = p.left, con;

		if (type == 'up') {
			dt = p.top - 110;
			con = dt >= 0;
		}
		if (type == 'down') {
			dt = p.top + 110;
			con = dt <= 330;
		}
		if  (type == 'left') {
			dl = p.left - 110;
			con = dl >= 0;
		}
		if (type == 'right') {
			dl = p.left + 110;
			con = dl <= 330;
		}

		if (con) {
			check = this.collisionDetect({left: dl, top: dt});
			if (!check) {
				this.container.css({
					'top': dt,
					'left': dl
				});
				game.position[cord[p.left][p.top]].isUsed = false;
				game.boxList[cord[p.left][p.top]] = undefined;

				game.position[cord[dl][dt]].isUsed = true;
				game.boxList[cord[dl][dt]] = this;
			} else {
				if (this.value == check.box.value) {
					// 如果能合并则删除当前box;并把下面的box的值加一倍
					check.box.container.text(this.value * 2);
					check.box.value *= 2;
					check.box.container.css('background', getColorByValue(this.value * 2));

					this.container.remove();
					this.removeBox(this);

					game.position[cord[p.left][p.top]].isUsed = false;
					game.boxList[cord[p.left][p.top]] = undefined;
				}
			}
		}
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
	},

	removeBox: function(box) {
		// game.boxList.splice(index, 1);
		var i = 0, len = game.boxList.length;

		for (; i < len; i++) {
			if (game.boxList[i] === box) {
				// game.boxList.splice(i, 1);
				game.boxList[i] = undefined;
				break;
			}
		}
	}
}

var game = {
	position: [],	// 记录表格的位置属性
	boxList: [], 	// 记录当前已经生成了的盒子的数组列表
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
	}
}

game.init();

$(document).on('keydown', function(e) {
	// console.log(e.keyCode);
	var i = 0, len = game.boxList.length,
		canMove = false,
		randBox;

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
		if (e.keyCode == 39 || e.keyCode == 40) {
			// game.boxList.reverse();
		}
		for (; i < len; i++) {
			if (game.boxList[i]) {
				// game.boxList[i][keyMap[e.keyCode]]();
				if (e.keyCode == 38) {
					game.boxList[i].move('up');
				}
				if (e.keyCode == 40) {
					game.boxList[i].move('down');
				}
				if (e.keyCode == 37) {
					game.boxList[i].move('left');
				}
				if (e.keyCode == 39) {
					game.boxList[i].move('right');
				}

				// len = game.boxList.length;
			}
		}

		if (e.keyCode == 39 || e.keyCode == 40) {
			// game.boxList.reverse();
		}

		randBox = game.random();
		if (randBox) {
			game.boxList[cord[randBox.position.left][randBox.position.top]] = new Box(randBox);
		} else {
			alert('Game Over!');
		}
	}
})