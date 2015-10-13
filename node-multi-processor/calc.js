var http = require('http');
var Q = require('q');

var defer = Q.defer();
// 该php中sleep了10s，模拟密集型CPU计算
http.get('http://webfe.cf/sleep.php', function (res) {
	console.log('success');
	defer.resolve();
}).on('error', function () {
	console.log('error');
	defer.reject();
});

var deferred = defer.promise;

deferred.then(function () {
	console.log('defer done.');
}, function () {
	console.log('defer fail.');
});
