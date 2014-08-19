var bds = bds || {};bds.se = bds.se || {};
bds.se.slide = function(options) {
    var _this = this,
        canHover = true,
        canClick = true;

    this._default = {
        target: $('.logo-1'),
        classPrefix: 'logo-',
        hoverSuffix: '-hover',
        clickSuffix: '-click',
        // 动画帧数
        frames: 59,
        // 没帧的宽度
        width: 135,
        // 单位：ms
        duration: 100,
        // 动画开始帧的偏移（默认是左偏移）
        offset: 0
    };

    this.init = function() {
        _this.op = $.extend({}, _this._default, options);
        _this.bindEvent();
    };

    this.bindEvent = function() {
        var reg = new RegExp('\\b' + _this.op.classPrefix + '\\d+\\b'),
            classAll = _this.op.target.get(0).className.match(reg) || [],
            _prefix = classAll.length ? classAll[0] : '',
            _hover = _prefix + _this.op.hoverSuffix,
            _click = _prefix + _this.op.clickSuffix;

        _this.op.target.hover(function(e) {
            var $this = $(this);
            if (canHover) {
                if (e.type == 'mouseenter')
                    $this.addClass(_hover);
                else if (e.type == 'mouseleave')
                    $this.removeClass(_hover);
            }
        }).on('click', function() {
            var $this = $(this), timer, num;
            if (canClick) {
                num = 0;
                canClick = false;
                canHover = false;

                //console.log($this.css('background-position-x'));
                $this.removeClass(_hover).addClass(_click).css({
                    'background-position': _this.op.offset + 'px 0',
                    'cursor': 'default'
                });

                // 启动动画
                timer = window.setInterval(function() {
                    var _py = $this.css('background-position').split(' '),
                        _py = _py[0] ? _py[0].replace('px', '') * -1 : 0;

                    $this.css('background-position', -(_py + _this.op.width) + 'px 0');
                    num++;
                    if (num >= _this.op.frames) {
                        window.clearInterval(timer);
                        $this.removeAttr('style').removeClass(_click);

                        // 恢复状态
                        canHover = true;
                        canClick = true;
                    }
                }, _this.op.duration);
            }
            return false;
        });
        ;
    };

    this.init();
};
$(function() {
    var slide = [];
    slide.push(new bds.se.slide());
    slide.push(new bds.se.slide({
        target: $('.logo-2'),
        frames: 52,
        width: 65,
        // 单位：ms
        duration: 100,
        offset: -270
    }));
    slide.push(new bds.se.slide({
        target: $('.logo-3'),
        frames: 78,
        width: 67,
        // 单位：ms
        duration: 100,
        offset: -400
    }));
    slide.push(new bds.se.slide({
        target: $('.logo-4'),
        frames: 153,
        width: 98,
        // 单位：ms
        duration: 100,
        offset: -682
    }));
    slide.push(new bds.se.slide({
        target: $('.logo-5'),
        frames: 71,
        width: 75,
        // 单位：ms
        duration: 100,
        offset: -534
    }));

    // 第四张图默认加载后即播放
    $('.logo-4').trigger('click');
});
