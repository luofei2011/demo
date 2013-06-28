var $ = function(selector) {
    return document.getElementById(selector);
}
function placeholder(element) {
    var placeholder = '';
    if (element && !("placeholder" in document.createElement("input")) && 
            (placeholder = element.getAttribute("placeholder"))) {
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
