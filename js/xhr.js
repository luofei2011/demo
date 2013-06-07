var data = {};	// 服务器的响应数据
var invitedArr = [];	// 初始化已经邀请的人

(function(window) {
	var xmlhttp,
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
	//return xmlhttp;
})(window);
