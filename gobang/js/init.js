Gobang.user = 'black';
Gobang.poi = [];
Gobang.init = function() {
    var wrapper = document.getElementById('wrapper');
    var html = "";

    for (var i = 0, len = 14; i < len; i++) {
        for (var j = 0, l = 14; j < l; j++) {
            html += "<div class='grid'></div>";
            Gobang.poi.push({
                x: j * 30 + 30,
                y: i * 30 + 30,
                v: 0
            });
        }
        Gobang.poi.push({
            x: j * 30 + 30,
            y: i * 30 + 30,
            v: 0
        });
    }

    // fix 最后一行坐标
    for (var k = 0, l2 = 15; k < l2; k++) {
        Gobang.poi.push({
            x: k * 30 + 30,
            y: i * 30 + 30,
            v: 0
        });
    }

    wrapper.innerHTML = html;

    var body = document.body;
    Gobang.left = (body.offsetWidth - 481) / 2;
    Gobang.top = (body.offsetHeight - 481) / 2;

    this.event();
}
