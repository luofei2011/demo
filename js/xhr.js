var data = {};	// ����������Ӧ����
var invitedArr = [];	// ��ʼ���Ѿ��������

(function(window) {
	var xmlhttp,
		activexName = ["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];  	// Ϊie�Ĳ�ͬ�汾���ж���Ĵ�������
		
	if (window.XMLHttpRequest) {  
        //���FireFox��Mozillar��Opera��Safari��IE7��IE8  
        xmlhttp = new XMLHttpRequest();  
        //���ĳЩ�ض��汾��mozillar�������BUG��������  
        if (xmlhttp.overrideMimeType) {  
            xmlhttp.overrideMimeType("text/xml");  
        }  
	} else if (window.ActiveXObject) {  
         //IE6��IE5.5��IE5   
        for (var i = 0; i < activexName.length; i++) {  
            try{  
                xmlhttp = new ActiveXObject(activexName[i]);  // ѭ�����������ɹ���ֹͣ�����������
                break;  
            } catch(e){  
            }  
        }  
	}  
	
	// ȷ������ȷ�Ĵ�������
	if (!xmlhttp) {  
        return;  
    }  
	
	// Ϊ�����Ķ���󶨻ص�����
	xmlhttp.onreadystatechange = callback;  
	
	// ѡ��post��ʽ��������
	xmlhttp.open("GET","src/data.json",false);  
    //xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	xmlhttp.send(null);
	
	//˽�еĻص�����  
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
