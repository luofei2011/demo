var http = require('http');
var cp = require('child_process');
var Q = require('q');

var MAX_THREAD = 3;
var now_thread = 0;

http.createServer(function (req, res) {
	response(res);
}).listen(8000);

function response(res) {
	if (now_thread < MAX_THREAD) {
		now_thread++;
		cpuCalc().then(function () {
			now_thread--;
			res.writeHead(200);
			res.end('处理完毕');
		}, function () {
			now_thread--;
			res.writeHead(200);
			res.end('处理出错');
		});
	}
	else {
		res.writeHead(200);
		res.end('系统繁忙');
	}
}

function cpuCalc() {
	var defer = cp.exec('node ./calc.js');
	var deferred = Q.defer();
	
	defer.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	defer.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	defer.on('exit', function (code) {
		console.log('child process exited with code ' + code);
		deferred.resolve();
	});
	
	defer.on('error', function () {
		console.log('exec error.');
		deferred.reject();
	});
	
	return deferred.promise;
}