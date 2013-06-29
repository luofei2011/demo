## 功能说明

1. 已兼容ie6, ie5.5尝试过, 感觉意义不大!

2. 基本的psd效果图实现

3. header有渐变效果, 唯一一处没有兼容ie6.

4. 点击桃心后右侧数字有相应的变化, 该处用了事件代理.

5. 创建标签label来兼容placeholder

6. 当滑动距离超过40px后回顶部按钮出现, 以及header进行替换. 其中用了css的
   expression对ie6进行hack

## Features

1. 配置文件`data.js`中使用json格式的数据模拟数据库中查询得到的结果;

2. 前台使用`document.write()`模拟php的echo功能实时动态打印模板中的内容;

3. 兼容性: ie6+, chrome, firefox等;

4. 纯js实现各种效果, 无jquery等插件;

5. 有较详细的文档注释, 详见各文件.

## 配置信息

1. 在线[demo](http://poised-flw.tk/duobei.html)

2. css文件: [duobei.css](https://github.com/luofei2011/demo/blob/gh-pages/css/doubei.css)

3. [ie6.css](https://github.com/luofei2011/demo/blob/gh-pages/css/ie6.css)

4. 数据配置信息: [data.js](https://github.com/luofei2011/demo/blob/gh-pages/js/data.js)

5. 主js文件: [duobei.js](https://github.com/luofei2011/demo/blob/gh-pages/js/duobei.js)

6. 入口文件: [duobei.html](https://github.com/luofei2011/demo/blob/gh-pages/duobei.html)

## 遇到的问题

1. ie6/7/8下新浪微博, 人人登录图标四角有小瑕疵.

2. 字体给得不协调

3. 最后是操蛋的ie6

4. 抄袭了原站的footer
