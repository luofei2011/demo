/*
 * 自定义的全局函数--通过元素及其类名快速定位到所找元素
 * @param {string} str "tagName.className"结构
 * @return {Array} result 返回匹配的所有dom元素， 没有则返回空数组
*/
var getElementByClassName = function( str ) {
	var elem = str.slice(0, str.indexOf('.')) || '',  // 通过传递的参数得到元素名和对应的类名
		className = str.slice(str.indexOf('.')+1, str.length),
		result = [],
		i = 0;
		
	var all = (elem === '') ? document.getElementsByTagName('*') : document.getElementsByTagName(elem); // 兼容没有传递结点名的情况
	
	// 通过类名匹配正确的dom结点，支持含有多个类名的查找
	var reg = new RegExp("\\b" + className + "\\b", 'g'); // 通用的匹配出所找类名正则表达式
	for ( ; i < all.length; i++ ) {
		if ( reg.test(all[i].className) ) {
			result.push(all[i]);
		}
	}
	
	return result;
}

/*
 * 想了一下, 如果推荐部分的DOM元素全部都动态生成的话效率个人感觉比较低, 尽量减少
 * 操作DOM还是比较好的, 因此我想用一共简单的模板来实现这种动态替换的功能.
 *
 * @param {Object} options 替换参数
 * @return {string} 替换过后的带有数据的html文档
 * */
function sprintf( options ) {

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
		
    return options.src.replace(/%s/g, function() {
	
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
}

/*
 * 动态改变邀请人数的状态栏
 * @param {string} pName 根据用户名从data['recomended']信息中找出其所有信息，可选
 * @return {string} 动态生成的dom元素
 */
function changeInvitedStatus( pName ) {
    var oInsert = ""; // 根据已经邀请的人动态生成邀请状态栏的dom信息

    // 根据人名找到其所有的信息
    if ( typeof pName !== 'undefined' ) {
        for ( var all in data['recommended'] ) {
            if ( data['recommended'][all]['fullName'] === pName ) {
                invitedArr.push(data['recommended'][all]);
            }
        }
    }

	// 在存在邀请人的前提下生成dom元素
	if ( invitedArr.length ) {
		oInsert += "您已邀请 <span class='person-list'>" +
               "<a href='" + data['comment'] + invitedArr[invitedArr.length -1]['urlToken'] + "'>" + invitedArr[invitedArr.length - 1]['fullName'] + "</a>" +
			   // 下拉菜单显示已经被邀请的人
			   "<div class='invited-people' id='drop_invite'>" +
			   "</div>";
        
		// 存在两个或两个以上的邀请人时，只显示两个人
		if ( invitedArr.length > 1 ) {
			oInsert += " , " +
                   "<a href='" + data['comment'] + invitedArr[invitedArr.length -2]['urlToken'] + "'>" + invitedArr[invitedArr.length - 2]['fullName'] + "</a></span>";
			
			// 存在三个及以上的人数时显示后面的“等...人“字样
			if ( invitedArr.length > 2 ) {
				oInsert += " 等" + invitedArr.length + "人";
			}
		}
	}
	
    return oInsert;
}

// 每次都需要为邀请栏中出现的人名绑定mouseover & mouseout事件
function addEvent() {

	var oDrop = getElementByClassName('span.person-list')[0];
    var oTarget = document.getElementById('drop_invite');
	var innerValue = data['template2'];
	var invitedNum = "";
	
	// 为下拉菜单模版填充数据, 避免在空邀请的时候抛出错误
	if ( oTarget !== null ) {
		for ( var i = 0; i < invitedArr.length; i++ ) {
			invitedNum += innerValue;
		}
		invitedNum = sprintf({
			src: invitedNum,
			target: invitedArr,
			max_value: 4
		});
	
		oTarget.innerHTML = "<b class='icon'></b><b class='icon down'></b><ul>" + invitedNum + "</ul>";
		
		// 每次动态生成邀请人的时候都给span.person-list绑定mouseover & mouseout事件
		oDrop.onmouseover = function() {
			var left = getElementByClassName('span.person-list')[0].firstChild.offsetWidth;
			oTarget.firstChild.style.left = left + "px";
			oTarget.firstChild.nextSibling.style.left = left + "px";
		
			oTarget.style.display = "block"; /*加一个动态效果*/
			//console.log(oTarget.offsetHeight);
		};
	
		oDrop.onmouseout = function() {
			oTarget.style.display = "none";
		};
		
		addClickEvent();
	}
}

// 动态为下拉菜单的每个"收回邀请"按钮绑定事件, 添加的地点：每次动态生成邀请栏信息以后
function addClickEvent() {
	
	var inviteStatus = document.getElementById('status');
	var oA = getElementByClassName('a.right');
	var oa_len = oA.length;
	
	for ( i = 0; i < oa_len; i++ ) {
		oA[i].onclick = function() {
		    var oHtml = this.previousSibling.innerHTML;  // 这个错误比较特别，在这里正常得到正确值，在下一步if判断的时候却出错。所以先缓存下来
			removeInvited(oHtml);
			inviteStatus.innerHTML = changeInvitedStatus();
			
			// 改变邀请按钮的状态
			var oBtn = document.getElementsByTagName('button');//getElementByClassName('button.remove-invite');
			console.log(oBtn);
			for ( var i = 0; i < oBtn.length; i++ ) {	
				if ( oBtn[i].nextSibling.innerHTML === oHtml ) {
					oBtn[i].className = "send-invite";
					oBtn[i].innerHTML = "邀请回答";
				}
			}
			addEvent();
		}
	}
}

// 找到删除元素在数组中的索引位置
function removeInvited( target ) {

    for ( var i = 0; i < invitedArr.length; i++ ) {
        // 找到则删除
        if ( invitedArr[i]['fullName'] === target ) {
            invitedArr.splice( i, 1 );
        }
    }
}

// 动态绑定数据 
window.onload = function() {
    var doc = document,
        oUl = doc.getElementById('replace_ul'),
        oBtn = oUl.getElementsByTagName('button'),
        inviteStatus = doc.getElementById('status'),
		oInput = doc.getElementById('search-username'),
        oldHtml = data['template1'];
	
	// 兼容ie的placeholder写法
	oInput.value = "搜素你想邀请的人";
	oInput.onfocus = function() {
		if ( this.value === "搜素你想邀请的人" ) {
			this.value = "";
		}
	};
	oInput.onblur = function() {
		if ( this.value === "" ) {
			this.value = "搜素你想邀请的人";
		}
	};
	
	// 根据html模板动态生成4个推荐信息
    oldHtml += oldHtml.replace(/odd/g, 'even');
	oldHtml += oldHtml;
    newHtml = sprintf( {
		src: oldHtml,
		target: data['recommended'],
		max_value: 5
	} );
    // 加载替换过后的值
    oUl.innerHTML = newHtml;
	
	// 初始化邀请栏信息
	inviteStatus.innerHTML = changeInvitedStatus();
	addEvent();
	
    // 为邀请按钮绑定事件
    for ( i = 0; i < oBtn.length; i++ ) {
        oBtn[i].onclick = function() {
            if ( this.innerHTML === '邀请回答' ) {
                this.className = 'remove-invite';
                this.innerHTML = '收回邀请';
                inviteStatus.innerHTML = changeInvitedStatus(this.nextSibling.innerHTML);
            } else {
                this.className = 'send-invite';
                this.innerHTML = '邀请回答';
                removeInvited( this.nextSibling.innerHTML );
                inviteStatus.innerHTML = changeInvitedStatus();
            }
			addEvent();
        }
    }
}
