## Features

- 信息源(json格式，包括：原始人员信息、推荐人列表模板、以及已推荐人员下拉菜单模板)放在服务器，通过get(github只支持此方式?)方式获取，且只请求一次！减少HTTP请求次数;

- 推荐人列表以模板形式存储在服务器，通过动态替换('%s'部分是需要替换的具体内容)得到目标数据;

- 已推荐人信息下拉菜单原理同上;

- 已推荐人员信息通过数组链表管理;

- 每次更新完已推荐人员状态栏时动态为状态栏人名和下拉菜单的"收回邀请"按钮动态绑定事件;

- 减少命名空间的冲突，所有属性和方法都注册在`window.$lf`对象下;

- 兼容性良好...

## API

通过`$lf.start()`即可启动

## 在线demo

[http://poised-flw.tk/demo.html](http://poised-flw.tk/demo.html)

## 遇到的问题

需要只是各很小的demo, 但是在处理浏览器的兼容性方面还是有很多需要注意的地方

- ie下，当input框获取焦点以后状态栏信息出现跳动

>

	input:focus {
		vertical-align: middle\9; 
	}
	
- github上的请求方式，刚开始用post方式出现`not allowed`，改成get正常！

- js的`mouseover` & `mouseout`发生多次触发以及其子元素也会触发该事件的问题. 代码中有说明.

- offsetHeight等的计算方式, 当元素的dispaly取值none时无法取到.

>

	offsetHeight = padding + border + height; // 主流
	offsetHeight = height; // ie5
	
- nextSibling出现`#text`等情况.