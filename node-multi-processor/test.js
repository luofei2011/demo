var cp = require('child_process');

var defer = cp.exec('node ./calc.js');

defer.stdout.on('data', function (data) {
	console.log('stdout: ' + data);
});

defer.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
});

defer.on('exit', function (code) {
	console.log('child process exited with code ' + code);
});