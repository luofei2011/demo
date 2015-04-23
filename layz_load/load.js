/**
 * 根据浏览器的最大并发数加载图片list
 * @author luofei
 * @date 2015-4-23
 */

;(function() {
    /**
     * 构造函数
     * @param {Array} images 图片列表
     * @param {Function} callback TODO 图片都加载完毕后的回调函数
     * @return 无
     */
    function layzLoad (images, callback) {
        this.images = images;
        this.callback = callback || function () {};
        this.isAllLoaded = false;

        this.init();
    }

    /**
     * 原型
     */
    layzLoad.prototype = {
        constructor: layzLoad,

        // 一次性并发请求的连接数
        max_connections: 6,

        // 辅助变量，用于管理图片的加载
        tmp_arr: [],

        // 已经加载的图片数量，可以理解为当前正在加载的图片的位置
        loadedIndex: 0,

        /**
         * 入口函数
         */
        init: function () {
            for (var i = 0, len = this.images.length; i < len; i++) {
                this.tmp_arr.push({
                    id: i,
                    src: this.images[i],
                    loaded: false
                });
            }

            this.load();
        },

        /**
         * load图片的入口函数
         */
        load: function () {
            console.time('layzLoad');

            for (var i = 0; i < this.max_connections; i++) {
                this.__load(this.tmp_arr[i]);
            }
        },

        /**
         * 加载单张图片
         * @param {Object} img 图片信息
         */
        __load: function (img) {
            var image = new Image();
            var self = this;

            this.loadedIndex++;

            image.onload = function () {
                var next = self.__getNextUnLoadImg();

                img.loaded = true;
                image = null;

                // 加载下一张图片
                next && self.__load(next);

                // 判断是否都已经加载完毕
                if (self.__isAllImagesLoaded()) {
                    self.isAllLoaded = true;
                    self.callback();

                    console.timeEnd('layzLoad');
                }
            }
            image.onerror = function () {
                img.loaded = true;
                image = null;
            }

            image.src = img.src;
        },

        /**
         * 取到下一张需要加载的图片
         * @return {Boolean | Object}
         */
        __getNextUnLoadImg: function () {
            return this.loadedIndex >= this.tmp_arr.length ? false : this.tmp_arr[this.loadedIndex];
        },

        /**
         * 是否所有的图片都加载完了
         */
        __isAllImagesLoaded: function () {
            for (var i = 0, len = this.tmp_arr.length; i < len; i++) {
                if (!this.tmp_arr[i].loaded) return false;
            }

            return true;
        }
    }

    // 注册入口
    window.layzLoad = layzLoad;
})();

// 用法
// new layzLoad(['a.jpg', 'b.jpg']);
