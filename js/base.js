/**
 * $lf-- a demo plugin
 *
 * @version 0.1
 * @author luofei(http://poised-flw.com)
 *
 * */
var $lf = {
	version: '0.1',
	
	/**
	 * @method getElementByClassName 自定义的全局函数--通过元素及其类名快速定位到所找元素
	 * @param {string} str str "tagName.className"结构
	 * @return {Array} result 返回匹配的所有dom元素， 没有则返回空数组
	 * 
	 * */
	getElementByClassName: function( str ) {
	
		var elem = str.slice(0, str.indexOf('.')) || '',  // 通过传递的参数得到元素名和对应的类名
			className = str.slice(str.indexOf('.')+1, str.length),
			result = [],
			i = 0,
			reg = new RegExp("\\b" + className + "\\b", 'g'); // 通用的匹配出所找类名正则表达式
		
		var all = (elem === '') ? document.getElementsByTagName('*') : document.getElementsByTagName(elem); // // 兼容没有传递结点名的情况
		
		// 通过类名匹配正确的dom结点，支持含有多个类名的查找
		for ( ; i < all.length; i++ ) {
			if ( reg.test(all[i].className) ) {
				result.push(all[i]);
			}
		}
		
		return result;
	},
	
	/**
	 * @variable data 从服务器获取的信息
	 * 
	 * */
	data: (function() {
		var xmlhttp, responseText,
		activexName = ["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];  	// 为ie的不同版本进行对象的创建尝试
		
		if (window.XMLHttpRequest) {  
			//针对FireFox，Mozillar，Opera，Safari，IE7，IE8  
			xmlhttp = new XMLHttpRequest();  
			//针对某些特定版本的mozillar浏览器的BUG进行修正  
			if (xmlhttp.overrideMimeType) {  
				xmlhttp.overrideMimeType("text/xml");  
			}  
		} else if (window.ActiveXObject) {  
			 //IE6，IE5.5，IE5   
			for (var i = 0; i < activexName.length; i++) {  
				try{  
					xmlhttp = new ActiveXObject(activexName[i]);  // 循环建立，若成功则停止否则继续尝试
					break;  
				} catch(e){  
				}  
			}  
		}  
		
		// 确保能正确的创建对象
		if (!xmlhttp) {  
			return;  
		}  
		
		// 为创建的对象绑定回调函数
		xmlhttp.onreadystatechange = callback;  
		
		// 选择post方式请求数据
		xmlhttp.open("GET","src/data.json",false);  
		//xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
		xmlhttp.send(null);
		
		//私有的回调函数  
		function callback() {   
			if ( xmlhttp.readyState == 4 ) {    
				if ( xmlhttp.status == 200  || xmlhttp.status == 0 ) {   
					var responseText = xmlhttp.responseText;  
					data = eval('(' + responseText + ')');
					//console.log(data);
				} 
			}  
		}  
		
		return responseText;
	})(),
	
	/**
	 * @varibale invitedArr 已被邀请的人构成的数组链表
	 *
	 * */
	invitedArr: (function() {
		
		var invited = data['invited'],
			invitedArr = [];
			
		if ( invited.length ) {

			// 初始化已经邀请的人的个数
			for ( var i in invited ) {
				invitedArr.push(invited[i]);
			}
		}
		
		return invitedArr;
	})(),
	
	/**
	 * @method sprinrf 格式化模板中需要改变的内容
	 * @param {object} options 替换的参数选项
	 * @return {sring} 替换过后的字符串
	 * 
	 * */
	sprintf: function( options ) {
	 
		/*
		options = {
			src: {string},	// src为必选参数，代表需要进行正则替换的字符串
			target: {Array},	// 必选参数， 代表查找的范围
			max_value: {int}	// 可选参数， 查找的频率取值 4 or 5
		}
		*/
		var pNum = 0,   // 推荐的人数计数器
			pItemNum = 1,   // 每个人的信息计数器
			pUrl = data['comment'], // 每个人的github-gh-pages根地址
			args = options.target, // 被推荐人信息
			len = args.length,
			pItem = args[pNum],
			max_value = options.max_value;	
			
		return options.src.replace(/(<!--)|(-->)/g,'')
                        .replace(/%s/g, function() {
		
				// 从1-max_value计数，一个来回匹配完一项
			   if ( pItemNum > max_value ) {
				   pItemNum = 1;
				   pNum += 1;
				   pItem = args[pNum];
			   }
			   
			   // 进行替换
			   switch( pItemNum ) {
				   case 1:
					   pItemNum += 1;
					   return pUrl + pItem['urlToken'];
				   case 2:
					   pItemNum += 1;
					   return pItem['avatarPath'];
				   case 3:
					   pItemNum += 1;
					   return pUrl + pItem['urlToken'];
				   case 4:
					   pItemNum += 1;
					   return pItem['fullName'];
				   case 5:
					   pItemNum += 1;
					   return pItem['bio'];
				   default:
					   break;
			   }
		});
	},
	 
	/**
	 * @method changeInvitedStatus 当邀请人数发生变化的时候动态改变邀请人数栏的状态
	 * @param {string} pName 根据用户名从data['recomended']信息中找出其所有信息，可选
	 * @return {sring} 动态生成的dom元素
	 * 
	 * */
	changeInvitedStatus: function( pName ) {
		
		// 根据已经邀请的人动态生成邀请状态栏的dom信息
		var oInsert = ""; 

		// 根据人名找到其所有的信息
		if ( typeof pName !== 'undefined' ) {
			for ( var all in data['recommended'] ) {
				if ( data['recommended'][all]['fullName'] === pName ) {
					$lf.invitedArr.push(data['recommended'][all]);
				}
			}
		}

		// 在存在邀请人的前提下生成dom元素
		if ( $lf.invitedArr.length ) {
			oInsert += "您已邀请 <span class='person-list' id='person_list'>" +
				   "<a href='" + data['comment'] + $lf.invitedArr[$lf.invitedArr.length -1]['urlToken'] + "'>" + $lf.invitedArr[$lf.invitedArr.length - 1]['fullName'] + "</a>" +
				   // 下拉菜单显示已经被邀请的人
				   "<div class='invited-people' id='drop_invite'>" +
				   "</div>";
			
			// 存在两个或两个以上的邀请人时，只显示两个人
			if ( $lf.invitedArr.length > 1 ) {
				oInsert += " , " +
					   "<a href='" + data['comment'] + $lf.invitedArr[$lf.invitedArr.length -2]['urlToken'] + "'>" + $lf.invitedArr[$lf.invitedArr.length - 2]['fullName'] + "</a></span>";
				
				// 存在三个及以上的人数时显示后面的“等...人“字样
				if ( $lf.invitedArr.length > 2 ) {
					oInsert += " 等" + $lf.invitedArr.length + "人";
				}
			}
		}
		
		return oInsert;
	},
	
	/**
	 * @method getDefaultStyle 返回dom元素的指定样式， 兼容ie
	 * */
	getDefaultStyle: function( obj, attribute ){ 
		return  obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj,false)[attribute];
	},
	
	/**
	 * @method contains 解决mouseover & mouseout的多次触发和子元素触发问题
	 *
	 * */
	contains: function(parentNode, childNode) {
        if (parentNode.contains) {
			return parentNode != childNode && parentNode.
                contains(childNode);
		} else {
          return !!(parentNode.compareDocumentPosition(
                childNode) & 16);
		}
	},	
	
	/**
	 * @method contains 解决mouseover & mouseout的多次触发和子元素触发问题
	 *
	 * */	
	getEvent: function( e ){
		return e||window.event;
	},	
	
	/**
	 * @method contains 解决mouseover & mouseout的多次触发和子元素触发问题
	 *
	 * */	
	checkHover: function( e, target ){
		if ( $lf.getEvent(e).type=="mouseover" )  {
			return !$lf.contains(target,$lf.getEvent(e).
                           relatedTarget || $lf.getEvent(e).
                           fromElement) && !(($lf.getEvent(e).
                           relatedTarget || $lf.getEvent(e).
                           fromElement)===target);
		} else {
			return !$lf.contains(target, $lf.getEvent(e).
                          relatedTarget|| $lf.getEvent(e).
                          toElement) && !(($lf.getEvent(e).
                          relatedTarget || $lf.getEvent(e).
                          toElement)===target);
		}
	},	
		
	/**
	 * @method slideUp 以滑动的方式显示某个元素
	 * @param {object} elem 目标元素
	 * @param {object} options 参数配置
	 * */
	slideUp: function( elem, options ) {
		
		/*
		 * options = {
		 * 		speed: {int} 滑动速度/px， 可选
		 *		time: {int} 滑动频率, 可选
		 * }
		*/
		// 获取元素的位置信息
		//var mv_target = elem.offsetHeight - 9,//$lf.getDefaultStyle( elem, 'height' ),offsetHeight = height + padding + border,PS:并不完美，兼容性不够。
		
		// 不用上面一种方法的原因：在"操作速度"足够快的情况，本次移动并没有完成就被打断，导致div未达到指定位置。高度出现偏差
		var oUl = $lf.getElementByClassName('ul.ul-list')[0],
			mv_target = oUl.offsetHeight - 1,	// border: 1px
			options = options || {},
			_style = elem.style,
			_speed = options.speed || 10,
			_time = options.time || 15,	// ie下测试滑动速度太慢了。。。。甚是不解
			oTimer, num = 1, // 定时器, 计数器
			step = parseInt( mv_target / _speed ); // 需要移动的步数

		elem.style.height = 0 + 'px';
		oTimer = setTimeout(function() {
			if ( num < step ) {
				elem.style.height = num * _speed + 'px';
				num += 1;
				
				// 重复执行
				setTimeout( arguments.callee, _time );
			} else {
				elem.style.height = mv_target + 'px';
				clearTimeout( oTimer );
			}
		}, _time);		
	},
	
	/**
	 * @method slideUp 以滑动的方式隐藏某个元素
	 * @param {object} elem 目标元素
	 * @param {object} options 参数配置
	 * */
	 slideDown: function( elem, options ) {
	 
		var mv_target = elem.offsetHeight - 9,
			options = options || {},
			_style = elem.style,
			_speed = options.speed || 10,
			_time = options.time || 15,
			oTimer, // 定时器
			step = parseInt( mv_target / _speed ); // 需要移动的步数

		oTimer = setTimeout(function() {
			if ( step > 0 ) {
				elem.style.height = step * _speed + 'px';
				step -= 1;
				
				// 重复执行
				setTimeout( arguments.callee, _time );
			} else {
				elem.style.height = 0;
				elem.style.display = 'none';
				elem.style.height = mv_target + 'px';
				clearTimeout( oTimer );
			}
		}, _time);
	 },
	
	/**
	 * @method addEvent 每次更新邀请人数的时候为邀请人数状态栏的人名绑定鼠标事件
	 *
	 * */
	addEvent: function() {
	
		var oDrop = document.getElementById('person_list'),// 已邀请人状态栏
		    oTarget = document.getElementById('drop_invite'), // 展示邀请人数情况的下拉菜单
			innerValue = data['template2'], // 下拉菜单填充模板，从服务器中动态获得到
			invitedNum = ""; // 根据实际已邀请人数生成的dom模板
		
		// 为下拉菜单模版填充数据, 避免在空邀请的时候抛出错误
		if ( oTarget !== null ) {
		
			// 根据已邀请人数生成模板
			for ( var i = 0; i < $lf.invitedArr.length; i++ ) {
				invitedNum += innerValue;
			}
			invitedNum = $lf.sprintf({ // 格式化模板
				src: invitedNum,
				target: $lf.invitedArr,
				max_value: 4
			});
		
			// 填充模板
			oTarget.innerHTML = "<b class='icon'></b><b class='icon down'></b><ul class='ul-list'>" + invitedNum + "</ul>";
			
			// 每次动态生成邀请人的时候都给span.person-list绑定mouseover & mouseout事件
			oDrop.onmouseover = function(e) {
			
				if ( $lf.checkHover( e, this ) ) {
					var left = $lf.getElementByClassName('span.person-list')[0].firstChild.offsetWidth;
					oTarget.firstChild.style.left = left + "px";
					oTarget.firstChild.nextSibling.style.left = left + "px";
					
					oTarget.style.display = "block"; /*加一个动态效果*/
					
					// 动画效果在ie下始终不完美
					$lf.slideUp( oTarget );
				}
			};
		
			oDrop.onmouseout = function(e) {
			
				if ( $lf.checkHover( e, this ) ) {
					$lf.slideDown( oTarget );
				}
			};
			
			$lf.addClickEvent();
		}
	},
	
	/**
	 * @method addClickEvent 为下拉菜单中的每个“收回邀请“按钮动态绑定事件
	 *
	 * */
	addClickEvent: function() {
	
		var inviteStatus = document.getElementById('status'),
			oA = $lf.getElementByClassName('a.right'), // 获取"收回邀请"按钮
			oa_len = oA.length;
		
		for ( i = 0; i < oa_len; i++ ) {
			oA[i].onclick = function() {
				var oHtml = this.previousSibling.innerHTML;  // 这个错误比较特别，在这里正常得到正确值，在下一步if判断的时候却出错。所以先缓存下来
				$lf.removeInvited(oHtml);
				inviteStatus.innerHTML = $lf.changeInvitedStatus();
				
				// 改变邀请按钮的状态
				var oBtn = document.getElementsByTagName('button');//getElementByClassName('button.remove-invite');
				console.log(oBtn);
				for ( var i = 0; i < oBtn.length; i++ ) {	
					if ( oBtn[i].nextSibling.innerHTML === oHtml ) {
						oBtn[i].className = "send-invite";
						oBtn[i].innerHTML = "邀请回答";
					}
				}
				$lf.addEvent();
			}
		}
	},
	
	/**
	 * @method removeInvited 删除数组中指定位置的元素
	 *
	 * */
	removeInvited: function( target ) {
	
		for ( var i = 0; i < $lf.invitedArr.length; i++ ) {
			
			// 找到则删除
			if ( $lf.invitedArr[i]['fullName'] === target ) {
				$lf.invitedArr.splice( i, 1 );
			}
		}
	},
	
	/**
	 * @method placeholder 各浏览器通用的写法
	 * @param {object} elem 需要添加该功能的dom元素
	 * @param {string} value 添加的值
	 * */
	placeholder: function( elem, value ) {
		elem.value = value;
		
		// 具体实现
		elem.onfocus = function() {
			if ( this.value === value ) {
				this.value = "";
			}
		};
		elem.onblur = function() {
			if ( this.value === "" ) {
				this.value = value;
			}
		};
	},
	
	/**
	 * @method start 入口函数
	 *
	 * */
	start: function() {
		var doc = document,
			oUl = doc.getElementById('replace_ul'), // 推荐人列表
			inviteStatus = doc.getElementById('status'), // 邀请状态栏
			oInput = doc.getElementById('search-username'), // 搜索框
			oldHtml = data['template1']; // 推荐人列表模板，从服务器中获得
		
		// 当dom树创建完后，分以下四步进行初始化页面
		// 1. 搜索框placeholer的初始化
		$lf.placeholder( oInput, "搜索您想邀请的人" );
		
		// 2. 根据html模板动态生成4个推荐信息
		oldHtml += oldHtml.replace(/odd/g, 'even');
		oldHtml += oldHtml;
		newHtml = $lf.sprintf( {
			src: oldHtml,
			target: data['recommended'],
			max_value: 5
		} );
		// 加载替换过后的值
		oUl.innerHTML = newHtml;
		
		// 3. 初始化邀请栏信息
		inviteStatus.innerHTML = $lf.changeInvitedStatus();
		$lf.addEvent();
		
		// 4. 为邀请按钮绑定事件
		/*for ( i = 0; i < oBtn.length; i++ ) {
			oBtn[i].onclick = function() {
				if ( this.innerHTML === '邀请回答' ) {
					this.className = 'remove-invite';
					this.innerHTML = '收回邀请';
					inviteStatus.innerHTML = $lf.changeInvitedStatus(this.nextSibling.innerHTML);
				} else {
					this.className = 'send-invite';
					this.innerHTML = '邀请回答';
					$lf.removeInvited( this.nextSibling.innerHTML );
					inviteStatus.innerHTML = $lf.changeInvitedStatus();
				}
				$lf.addEvent();
			}
		}*/
        oUl.onclick = function( e ) {
            var target = e.srcElement ? e.srcElement : e.target,
                oBtn = target.nodeName.toLowerCase();

            // 事件委托, 但必须得是button才行
            if ( oBtn === 'button' ) {
				if ( this.innerHTML === '邀请回答' ) {
					this.className = 'remove-invite';
					this.innerHTML = '收回邀请';
					inviteStatus.innerHTML = $lf.changeInvitedStatus(this.nextSibling.innerHTML);
				} else {
					this.className = 'send-invite';
					this.innerHTML = '邀请回答';
					$lf.removeInvited( this.nextSibling.innerHTML );
					inviteStatus.innerHTML = $lf.changeInvitedStatus();
				}
				$lf.addEvent();

                return false;
            }
        };
	}
}
