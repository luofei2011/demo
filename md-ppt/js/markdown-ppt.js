window.onload = function() {
	ppt.init("data.md");
}

/* ------------
 * some tools
 * ------------ */
var T = {
	// selector
	$: function() {
		if (arguments.length === 1) {
			var parent = document;
			var name = arguments[0];
		} else {
			var parent = arguments[0];
			var name = arguments[1];
		}
		var res = parent.querySelectorAll(name);
		return res.length === 1 ? res[0] : res;
	},

	// get key vlaue
	key: function(event) {
		var code = event.keyCode;
		if (code >= 65 && code <= 90 ||
			code >= 48 && code <= 57)
			return String.fromCharCode(code);
		switch (code) {
			case 8 : return "BACKSPACE";
			case 9 : return "TAB";
			case 13: return "ENTER";
			case 16: return "SHIFT";
			case 17: return "CTRL";
			case 32: return "SPACE";
			case 37: return "LEFT";
			case 38: return "UP";
			case 39: return "RIGHT";
			case 40: return "DOWN";
			default: return code;
		}
	},

 	// use `markHtml(srt);` to game the html code.
	markHtml: new Showdown.converter().makeHtml,

	// simple javascript templating
	tmpl: tmpl,

	/* ------------
	 * asyn load txtfile; 
	 * opt = {type: "GET/POST", url: "", data: "", callback: fun}
	 * ------------ */
	ajax: function(opt) {
		var type = opt.type, 
			url = opt.url, 
			data = opt.data || "", 
			callback = opt.callback,
			xmlhttp = new XMLHttpRequest();
		xmlhttp.open(type, url, true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				callback(xmlhttp.responseText);
			}
		}
		//type == "get" ? xmlhttp.send() : xmlhttp.send(data);
		xmlhttp.send(data);
	}
}

/* ------------
 * core code
 * ------------ */
var ppt = (function() {
	var DATA_URL = ""
		C_SHOW = "show",
		C_OVER = "over",
		C_WAIT = "wait",
		dMain = {},
		aPage = [];
	
	var init = function(url) {
		dMain = T.$("#main");
		DATA_URL = url
		T.ajax({
			type: "GET", 
			url: DATA_URL,
			callback: function(sData) {
				initDom(sData);
				aPage = T.$(dMain, ".ppt_item");
				index.init(aPage.length);
				initEvent();
			}
		});
	};
	
	// write html code to page
	var initDom = function(sData) {
		var SPLITER = "=====",
			aData = sData.split(SPLITER);

		T.$("title").innerText = aData[0];
		T.$("#show_source").href = DATA_URL;
		var sClassName = "";
		for (var i = 1, leng = aData.length, page = index.get(); i < leng; i++) {
			if (i === page) {
				sClassName = C_SHOW;
			} else if (i < page) {
				sClassName = C_OVER;
			} else {
				sClassName = C_WAIT;
			}
			dMain.innerHTML += tmpl("item_tmpl", {content: T.markHtml(aData[i]), className: sClassName});
		}
	};

	// init user event
	var initEvent = function() {
		var dBtnShow = T.$("btn_show_source");
		document.addEventListener("keydown", function(event) {
			switch(T.key(event)) {
				case "RIGHT":
					index.next();
					break;
				case "LEFT":
					index.prev();
					break;
				default:
					break;
			}
		});
		window.addEventListener("hashchange", function() {
			var sClassName = "";
			for (var i = 1, leng = aPage.length, page = index.get(); i <= leng; i++) {
				if (i === page) {
					sClassName = C_SHOW;
				} else if (i < page) {
					sClassName = C_OVER;
				} else {
					sClassName = C_WAIT;
				}
				aPage[i - 1].className = aPage[i - 1].className.
					replace(C_SHOW,"").replace(C_OVER,"").replace(C_WAIT,"") + 
					sClassName;
			}
		})
	};

	// reutrn page index
	var index = (function() {
		var _nIndex, _nTotal;
		var init = function(nTotal) {
			_nTotal = nTotal;
			_nIndex = get();
		};
		var get = function() {
			var nHash = parseInt(location.hash.replace('#', ''));
			if (isNaN(nHash) || nHash === "" || nHash === 0) {
				_nIndex = 1;
			} else if (nHash > _nTotal) {
				_nIndex = _nTotal;
			} else {
				_nIndex = nHash;
			}
			set(_nIndex);
			return _nIndex;
		};
		var set = function(nIndex) {
			_nIndex = nIndex;
			location.hash = "#" + nIndex;
			process(_nIndex / _nTotal * 100);
		};
		var next = function() {
			_nIndex += 1;
			_nIndex > _nTotal && (_nIndex = _nTotal);
			set(_nIndex);
		};
		var prev = function() {
			_nIndex -= 1;
			_nIndex <= 0 && (_nIndex = 1);
			set(_nIndex);
		}
		return {
			init: init,
			get: get,
			set: set,
			next: next,
			prev: prev
		}
	})();
	
	// process bar
	var process = function(precent) {
		var dCurrent = T.$("#current");
		dCurrent.style.width = precent + "%";
	}

	return {
		init: init
	}
})();
