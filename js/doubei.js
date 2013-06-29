/*
 * @author luofei (http://poised-flw.com)
 * @created at 2013-06-29
 * */
var $ = function(selector) {
    return document.getElementById(selector);
};

/*
 * @method getElementByClassName
 * @param {string} str 选择的范围和目标, 如: div.test表示选择类名为test的div元素
 * @return {array} result 返回匹配的数组, 没有则返回空数组
 * */
var getElementByClassName = function( str ) {
    var elem = str.slice(0, str.indexOf('.')) || '',  
        className = str.slice(str.indexOf('.')+1, str.length),
        result = [],
        i = 0,
        reg = new RegExp("\\b" + className + "\\b", 'g'); 

    var all = (elem === '') ? document.getElementsByTagName('*') : document.getElementsByTagName(elem); 

    for ( ; i < all.length; i++ ) {
        if ( reg.test(all[i].className) ) {
            result.push(all[i]);
        }
    }

    return result;
}

/*
 * @method placeholder 兼容不具备css3中placeholder属性的浏览器, 如ie < 9
 * @param {object} element html元素
 * */
function placeholder(element) {
    var placeholder = element.getAttribute('placeholder') ||
                    // 兼容ie6/7
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
