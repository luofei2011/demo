node.js知识分享
=====

# node.js--基于V8引擎实现的事件驱动I/O

=====

## 事件机制

- Rhino
- 异步I/O
- 单线程(线程 & 进程)

=====

## 事件侦听器 & 事件钩子(hook)

如何理解“钩子”：比如req这个对象，从外观上我们并不知到关于它的一切，但是我们能用一些
事件监听器从它里面“钩”出很多有用的信息！

#### 一个简单的爬虫程序

    var options = {
        host: "www.google.com",
        port: 80,
        path: '/upload',
        method: 'post'
    };
    var req = http.request(options, function(res) {
        //res.statusCode res.headers
        res.on('data', function(chunk) {
            // someThing
        });
        res.on('end', function() {
        });
    });
    req.write('data\n');
    req.write('data\n');
    req.end();

#### 注：
    
1. node的监听器与js不同！
2. 原生的node最多只能添加10个事件监听器

    // 什么时候会发生，例如上面的爬虫程序
    emitter.setMaxListeners(0); // 解除限制

3. 发生错误会导致线程的退出，需对EventEmitter对象的error事件进行处理！

=====

## 回调

以Nebula客户端为例：假如从输入网址到进入教室大概经历了以下步骤，

1. 请求auth文件
2. 根据uid得到当前教室信息
3. 根据教室信息加载教室资源

__PS:__若我们提供了api供外界使用：

api.getAuth('uid', function(auth) {});
apt.getRoomInfo('uid', function(roomInfo) {});
apt.getRoomSource('uid', function(roomSource) {});

会出现什么问题？如何解决？

Oh my god! 无穷回调！

[EventProxy by @朴灵](http://weibo.com/shyvo)

# END

