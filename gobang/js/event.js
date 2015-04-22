var main = document.getElementById('main');

Gobang.addPiece = function(obj) {
    //console.log(obj);
    container.appendChild(this.createDiv(obj.info));

    // 计算是否游戏结束
    Gobang.poi[obj.idx].v = Gobang.user === "black" ? 1 : 2;
    Gobang.util.triggerEvent(main, 'change_user');
}

Gobang.createDiv = function(p) {
    var div = document.createElement('div');
    div.className = 'item';

    if (Gobang.user === 'white') {
        div.className = 'item white';
    }

    div.style.left = p.x - 15 + 'px';
    div.style.top = p.y -15  + 'px';

    return div;
}

Gobang.event = function() {
    var r = 100; // pow(10, 2)
    var container = document.getElementById('container');

    Gobang.util.addEvent(main, 'click', function(e) {
        if (Gobang.user !== "white") return false;

        var poi = {
            x: e.x - Gobang.left + 15,
            y: e.y - Gobang.top + 15
        };

        var selected = getDistance(poi);

        if (selected !== false) {
            var topBottom = Player.prototype.calcTopBottom(selected.idx, selected.info);
            var leftRight = Player.prototype.calcLeftRight(selected.idx, selected.info);
            var leftSlant = Player.prototype.calcLeftSlant(selected.idx, selected.info);
            var rightSlant = Player.prototype.calcRightSlant(selected.idx, selected.info);
            var list = [topBottom, leftRight, leftSlant, rightSlant];

            if (list.indexOf(10) !== -1) {
                alert('白旗获胜！');
                window.location.reload();
                return false;
            }

            Gobang.addPiece(selected);

            // 下一步该AI走
            player.go();
        }
    });

    Gobang.util.addEvent(main, 'change_user', function() {
        //console.log('Trigger change_user.');
        Gobang.user = Gobang.user == "black" ? "white" : "black";

        /*
        if (Gobang.user === "white") {
            main.className = "white";
        } else {
            main.className = "";
        }
        */
    });

    function getDistance(poi) {
        var tmp;
        var distance;
        for (var i = 0, len = Gobang.poi.length; i < len; i++) {
            tmp = Gobang.poi[i];
            distance = Math.pow(Math.abs(tmp.x - poi.x), 2) + Math.pow(Math.abs(tmp.y - poi.y), 2);

            if (tmp.v === 0 && distance <= r) {
                console.log('Find: ', tmp);
                return {
                    info: tmp,
                    idx: i
                };
            }
        }

        return false;
    }
};
