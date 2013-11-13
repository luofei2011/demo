;(function(win) {
	var _d = win.document,
		div = _d.createElement('div'),
		idx = _d.cookie.indexOf('bdWs='),

	div.setAttribute('class', 'ws-tips');
	div.innerHTML = "hello world!!!";

	console.log(_d.cookie);
	if (idx !== -1 && _d.cookie[idx + 5] !== ";" && _d.cookie[idx + 5]) {
	// if (idx !== -1) {
		return;
	} else {
		_d.body.appendChild(div);
		_d.cookie = "bdWs=o";
	}
})(window);