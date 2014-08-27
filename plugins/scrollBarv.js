/**
 * @description 滚动条插件
 * @dependence {jQuery1.7+, ie6+}
 * @author luofei (luofeihit2010@gmail.com)
 * @date 2014-08-22
 */
;(function($) {
    if (typeof $ === 'undefined') throw 'No jQuery used!';

    /*全局变量*/
    var win = window;

    /*注册变量*/
    win.scrollBarv = function(options) {
        var _this = this,
            slider, container,
            content;

        if (!(this instanceof win.scrollBarv))
            return new win.scrollBarv(options);

        this._default = {
            target: '',
            content: '',
            /*是否阻止滚屏*/
            isPreventScroll: false, 
            /*是否允许监听内容改变*/
            isAutoRender: false,
            /*滚动条的位置*/
            position: 'right', // 'top|right|bottom|left|middle|num(任意数值)'
            /**
             * skinCssContainer: Container的css名
             * skinCssSlider: Slider的css名
             */
            skinCssContainer: '',
            skinCssSlider: '',
            /*默认的滚动条尺寸*/
            size: 8
        };

        this.op = $.extend({}, this._default, options);

        this.init = function() {
            content = _this.op.content || _this.op.target.children().eq(0);
            _this.createDom();

            _this.render();

            _this.bindEvent();
        };

        this.createDom = function() {
            var html = '', style_1 = {}, style_2 = {},
                outSize = {
                    w: _this.op.target.outerWidth(),
                    h: _this.op.target.outerHeight()
                };
            // 绘制container
            if (_this.op.skinCssContainer)
                html = '<div class="' + _this.op.skinCssContainer + '"></div>';
            else
                html = '<div style="position:absolute;background:#f2f2f2;border-left:1px solid #e1e1e1;display:none;"></div>';

            container = $(html);

            switch(_this.op.position) {
                case 'top':
                    style_1 = {
                        'width': outSize.w,
                        'height': _this.op.size,
                        'top': 0,
                        'left': 0
                    };
                    style_2 = {
                        width: 0,
                        height: 8,
                        top: 0,
                        left: 0
                    };
                    break;
                case 'right':
                    style_1 = {
                        'height': outSize.h,
                        'width': _this.op.size,
                        'top': 0,
                        'right': 0
                    };
                    style_2 = {
                        width: 8,
                        height: 0,
                        top: 0,
                        left: 0
                    };
                    break;
                case 'bottom':
                    style_1 = {
                        'width': outSize.w,
                        'height': _this.op.size,
                        'bottom': 0,
                        'left': 0
                    };
                    style_2 = {
                        width: 0,
                        height: 8,
                        bottom: 0,
                        left: 0
                    };
                    break;
                case 'left':
                    style_1 = {
                        'height': outSize.h,
                        'width': _this.op.size,
                        'top': 0,
                        'left': 0
                    };
                    style_2 = {
                        width: 8,
                        height: 0,
                        left: 0,
                        top: 0
                    };
                    break;
                case 'middle':
                    style_1 = {
                        'height': outSize.h,
                        'width': _this.op.size,
                        'top': 0,
                        'left': '50%',
                        'margin-left': -_this.op.size / 2
                    };
                    style_2 = {
                        height: 0,
                        width: 8,
                        top: 0,
                        left: 0
                    };
                    break;
                default:
                    style_1 = {
                        'height': outSize.h,
                        'width': _this.op.size,
                        'top': 0,
                        'left': _this.op.position
                    };
                    style_2 = {
                        height: 0,
                        width: 8,
                        top: 0,
                        left: 0
                    };
                    break;
            };

            // 附加样式
            _this.addStyle(container, style_1);

            // 绘制slider
            html = '<div style="position:absolute;background:#fff;border:1px solid #e1e1e1;border-left:0 none;"></div>';
            slider = $(html);
            _this.addStyle(slider, style_2);

            // 针对target做部分修正
            var _p = _this.op.target.parent();
            if (_p.css('position') === 'static')
                _p.css('position', 'relative');

            // 渲染
            container.append(slider).insertAfter(_this.op.target);
        };

        this.addStyle = function(node, style) {
            node.css(style);
        };

        this.render = function() {
            var contentSize = {w: content.outerWidth(), h: content.outerHeight()},
                targetSize = {w: _this.op.target.outerWidth(), h: _this.op.target.outerHeight()};

            _this['render' + _this.op.position.toLowerCase()](contentSize, targetSize);
        };

        this.renderright = function(c, t) {
            if (c.h > t.h) {
                container.show();
                var _sliderH = t.h * t.h / c.h;
                _sliderH = _sliderH < 20 ? 20 : _sliderH;
                slider.height(_sliderH);

                var diff = parseInt(slider.css('top'));
                // perfect
                var _top = (diff * (c.h - t.h)) / (t.h - slider.outerHeight());
                _this.op.target.scrollTop(_top);
            } else {
                container.hide();
            }
        };

        this.bindEvent = function() {
            var _hoverBak = {},
                _md,
                _posY,
                tH = container.outerHeight();
            container.hover(function(e) {
                var $this = $(this);
                if (e.type === 'mouseenter') {
                    _hoverBak = $this.css('background');
                    $this.css('background', '#bfbfbf');
                } else if (e.type === 'mouseleave' && !_md) {
                    $this.css('background', _hoverBak);
                }
            });

            slider.on('mousedown', function(e) {
                _md = true;
                _posY = e.clientY;
            });

            $(document).on('mousemove', function(e) {
                var $this = $(this),
                    _diffY,
                    sT = parseInt(slider.css('top')),
                    sH = slider.outerHeight();
                if (_md) {
                    _diffY = e.clientY - _posY;
                    if (sT + _diffY < 0)
                        sT = 0;
                    else if (sT + _diffY + sH > tH) 
                        sT = tH - sH;
                    else
                        sT += _diffY;
                    slider.css('top', sT);

                    // update
                    _posY = e.clientY;

                    _this.render(_diffY);
                }

            }).on('mouseup', function() {
                _md = false;
            });

            document.onselectstart = function() {
                return !_md;
            };
        };

        this.init();
    };
})(jQuery);
