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

=====

# END

