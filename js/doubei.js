var $ = function(selector) {
    return document.getElementById(selector);
};
var getElementByClassName = function( str ) {
    var elem = str.slice(0, str.indexOf('.')) || '',  // éè¿ä¼ éçåæ°å¾å°åç´ ååå¯¹åºçç±»å
        className = str.slice(str.indexOf('.')+1, str.length),
        result = [],
        i = 0,
        reg = new RegExp("\\b" + className + "\\b", 'g'); // éç¨çå¹éåºææ¾ç±»åæ­£åè¡¨è¾¾å¼

    var all = (elem === '') ? document.getElementsByTagName('*') : document.getElementsByTagName(elem); // // å¼å®¹æ²¡æä¼ éç»ç¹åçæåµ

    for ( ; i < all.length; i++ ) {
        if ( reg.test(all[i].className) ) {
            result.push(all[i]);
        }
    }

    return result;
}
function placeholder(element) {
    var placeholder = element.getAttribute('placeholder') ||
                      element.getAttributeNode('placeholder').nodeValue;
    if (element && !("placeholder" in document.createElement("input")) && placeholder) {
        var idLabel = element.id ;
        if (!idLabel) {
            idLabel = "placeholder_" + new Date().getTime();
            element.id = idLabel;
        }

        var eleLabel = document.createElement("label");
        eleLabel.htmlFor = idLabel;
        eleLabel.style.position = "absolute";
        eleLabel.style.marginLeft = "6px";
        eleLabel.style.height = '14px';
        eleLabel.style.color = "gray";
        eleLabel.style.cursor = "text";
        element.parentNode.insertBefore(eleLabel, element);
        element.onfocus = function() {
            eleLabel.innerHTML = "";
        };
        element.onblur = function() {
            if (this.value === "") {
                eleLabel.innerHTML = placeholder;  
            }
        };

        if (element.value === "") {
            eleLabel.innerHTML = placeholder;   
        }
    }	
};
