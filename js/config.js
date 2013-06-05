var data = {
  "comment": "http://octodex.github.com/",
  "invited": [
    {
      "fullName": "the Mardigrastocat",
      "urlToken": "mardigrastocat",
      "avatarPath": "http://octodex.github.com/images/Mardigrastocat.png",
      "bio": "Octodex",
      "id": 1
    },
    {
      "fullName": "the Kimonotocat",
      "urlToken": "kimonotocat",
      "avatarPath": "http://octodex.github.com/images/kimonotocat.png",
      "bio": "Octodex",
      "id": 2
    },
    {
      "fullName": "the Skitchtocat",
      "urlToken": "skitchtocat",
      "avatarPath": "http://octodex.github.com/images/skitchtocat.png",
      "bio": "Octodex",
      "id": 3
    }
  ],
  "recommended": [
    {
      "fullName": "the Droidtocat",
      "urlToken": "droidtocat",
      "avatarPath": "http://octodex.github.com/images/droidtocat.png",
      "bio": "Octodex",
      "id": 4
    },
    {
      "fullName": "the Goretocat",
      "urlToken": "goretocat",
      "avatarPath": "http://octodex.github.com/images/goretocat.png",
      "bio": "Octodex",
      "id": 5
    },
    {
      "fullName": "the FIRSTocat",
      "urlToken": "firstocat",
      "avatarPath": "http://octodex.github.com/images/FIRSTocat.png",
      "bio": "Octodex",
      "id": 6
    },
    {
      "fullName": "the Professortocat",
      "urlToken": "professortocat",
      "avatarPath": "http://octodex.github.com/images/Professortocat_v2.png",
      "bio": "Octodex",
      "id": 7
    }
  ]
};

/*
 * 想了一下, 如果推荐部分的DOM元素全部都动态生成的话效率个人感觉比较低, 尽量减少
 * 操作DOM还是比较好的, 因此我想用一共简单的模板来实现这种动态替换的功能.
 *
 * @param {string} text 需要替换的html文档
 * @return {string} str 替换过后的带有数据的html文档
 * */
function sprintf( text ) {

    var pNum = 0,   // 推荐的人数计数器
        pItemNum = 1,   // 每个人的信息计数器
        pUrl = data['comment'], // 每个人的github-gh-pages根地址
        args = data['recommended'], // 被推荐人信息
        len = args.length,
        pItem = args[pNum];

    return text.replace(/(<!--)|(-->)/g,'')
                .replace(/%s/g, function() {

           if ( pItemNum > 5 ) {
               pItemNum = 1;
               pNum += 1;
                pItem = args[pNum];
           }
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

// 初始化已经邀请的人
var invitedArr = [];
(function() {
    if ( data['invited'].length ) {
        var invited = data['invited'];

        // 初始化已经邀请的人的个数
        for ( var i in invited ) {
            invitedArr.push(invited[i]);
        }
    }

})();

// 动态改变邀请人数的状态栏
function changeInvitedStatus( pName ) {
    var oInsert = "";

    // 根据人名找到其所有的信息
    if ( typeof pName !== 'undefined' ) {
        for ( var all in data['recommended'] ) {
            if ( data['recommended'][all]['fullName'] === pName ) {
                invitedArr.push(data['recommended'][all]);
            }
        }
    }

    oInsert += "您已邀请 <span class='person-list'>" +
               "<a href='" + data['comment'] + invitedArr[invitedArr.length -1]['urlToken'] + "'>" + invitedArr[invitedArr.length - 1]['fullName'] + "</a>";
    if ( invitedArr.length > 1 ) {
        oInsert += " , " +
                   "<a href='" + data['comment'] + invitedArr[invitedArr.length -2]['urlToken'] + "'>" + invitedArr[invitedArr.length - 2]['fullName'] + "</a>";
                   
        if ( invitedArr.length > 2 ) {
            oInsert += " 等" + invitedArr.length + "人";
        }
    }
    
    return oInsert;
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
        oldHtml = oUl.innerHTML;
	
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
	
    inviteStatus.innerHTML = changeInvitedStatus();
    oldHtml += oldHtml;
    newHtml = sprintf( oldHtml );

    // 加载替换过后的值
    oUl.innerHTML = newHtml;
	
	// 给邀请状态栏绑定显示已经被邀请的人列表的事件
	var dropdownList = doc.querySelector('.person-list');
	console.log(dropdownList);

    // 为邀请按钮绑定事件
    for ( i = 0; i < oBtn.length; i++ ) {
        oBtn[i].onclick = function() {
            if ( this.innerHTML === '邀请回答' ) {
                this.className = 'remove-invite';
                this.innerHTML = '收回邀请';
                inviteStatus.innerHTML = changeInvitedStatus(this.nextSibling.nextSibling.innerHTML);
            } else {
                this.className = 'send-invite';
                this.innerHTML = '邀请回答';
                removeInvited( this.nextSibling.nextSibling.innerHTML );
                inviteStatus.innerHTML = changeInvitedStatus();
            }
        }
    }
}
