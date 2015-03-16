// 成5
var FIVE = 10;
// 活四、双死四、死四活三
var DOUBLE_FOUR = 9;
// 双活三
var DOUBEL_THREE = 8;
// 死三活三
var TWO_THREE = 7;
// 死四
var HALF_FOUR = 6;
// 活三
var THREE = 5;
// 双活二
var DOUBEL_TWO = 4;
// 死三
var HALF_THREE = 3;
// 活二
var ONE_TWO = 2;
// 死二
var HALF_TWO = 1;
// 单子
var NONE = 0;

var Gobang = {};

Gobang.util = {
    addEvent: (function() {
        if (document.addEventListener) {
            return function(el, type, fn) {
                el.addEventListener(type, fn, false);
            }
        } else if (document.attachEvent) {
            return function(el, type, fn) {
                el.attachEvent('on' + type, function() {
                    return fn.call(el, window.event);
                });
            }
        }
    })(),
    triggerEvent: function(el, type, data) {
        var event;
        if (document.createEvent) {
            event = new Event(type);
            event.data = data;
            el.dispatchEvent(event);
        } else {
            event = document.createEventObject();
            event.data = data;
            el.fireEvent('on' + type, event);
        }
    }
}

function Player() {
    this.step = 0;
    this.v = 1;
}

Player.prototype.go = function() {
    var table = {};
    if (!this.step) {
        Gobang.addPiece({
            idx: 112,
            info: {
                x: 240,
                y: 240,
                v: 0
            }
        });
    } else {
        for (var i = 0, len = Gobang.poi.length; i < len; i++) {
            var tmp = Gobang.poi[i];
            // 此处没有棋子时
            if (!tmp.v) {
                // 按序分析棋局：上下，左右，左斜，右斜
                var topBottom = this.calcTopBottom(i, tmp);
                var leftRight = this.calcLeftRight(i, tmp);
                var leftSlant = this.calcLeftSlant(i, tmp);
                var rightSlant = this.calcRightSlant(i, tmp);

                //console.log(topBottom, leftRight, leftSlant, rightSlant);

                // 在以上数据中找出“双活二”，“双活三”，“活三死三”，“双死四”，“死四活三”
                var double_two = false;
                var double_three = false;

                var live_three = false;
                var dead_three = false

                var double_d_four = false;

                var dead_four = false;

                var label = 3;
                var list = [topBottom, leftRight, leftSlant, rightSlant];
                var score = 0;
                while(label >= 0) {
                    if (list[label] == 2) {
                        if (double_two) {
                            score = DOUBEL_TWO;
                        }
                        double_two = true;
                    }

                    if (list[label] == 5) {
                        live_three = true;
                        if (double_three) {
                            score = DOUBEL_THREE;
                        }

                        if (dead_four) {
                            score = DOUBLE_FOUR;
                        }
                        double_three = true;
                    }

                    if (list[label] == 6) {
                        dead_four = true;
                        if (double_d_four) {
                            score = DOUBLE_FOUR;
                        }

                        if (live_three) {
                            score = DOUBLE_FOUR;
                        }
                        double_d_four = true;
                    }

                    if (list[label] == 3) {
                        dead_three = true;
                        if (live_three) {
                            score = 7;
                        }
                    }

                    label--;
                }

                var max = Math.max(score, Math.max.apply(null, list));
                table[max] = {idx: i, info: tmp};
            }
        }

        //console.log(table);
        //console.log(Object.keys(table));
        max = Math.max.apply(null, Object.keys(table));
        Gobang.addPiece(table[max]);

        if (max == 10) {
            alert('黑棋获胜！');
            window.location.reload();
        }
    }

    this.step += 1;
}
