Player.prototype.getScore = function(all, findWhitePrev, findWhiteNext) {
    var score = 0;
    if (all >= 5) {
        score = FIVE;
    }
    if (!(findWhitePrev && findWhiteNext)) {
        if (all == 4) {
            if (!findWhitePrev && !findWhiteNext) {
                score = DOUBLE_FOUR;
            } else {
                score = HALF_FOUR;
            }
        }

        if (all == 3) {
            if (!findWhitePrev && !findWhiteNext) {
                score = THREE;
            } else {
                score = HALF_THREE;
            }
        }

        if (all == 2) {
            if (!findWhitePrev && !findWhiteNext) {
                score = ONE_TWO;
            } else {
                score = HALF_TWO;
            }
        }

        if (all == 1) {
            score = NONE;
        }
    }

    return score;
}
Player.prototype.calcTopBottom = function(i, tmp) {
    var label = tmp.y - 30;
    // 相邻的棋子数量
    var numsPrev = 0;
    var numsNext = 0;
    var tmpValue;
    var findWhitePrev = false;
    var findWhiteNext = false;
    var step = i - 15;

    var self = Gobang.user == "black" ? 1 : 2;
    var op = Gobang.user == "black" ? 2 : 1;

    while(label >= 30) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue === self) {
            numsPrev += 1;
        } else if (tmpValue === op) {
            findWhitePrev = true;
            break;
        } else {
            break;
        }
        step -= 15;
        label -= 30;
    }

    label = tmp.y + 30;
    step = i + 15;
    while(label <= 450) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue === self) {
            numsNext += 1;
        } else if (tmpValue === op) {
            findWhiteNext = true;
            break;
        } else {
            break;
        }

        step += 15;
        label += 30;
    }

    // 根据以上的值进行分析
    // 能连起来的棋子数量
    var all = numsPrev + numsNext + 1;

    return this.getScore(all, findWhitePrev, findWhiteNext);
}

Player.prototype.calcLeftRight = function(i, tmp) {
    var label = tmp.x - 30;
    // 相邻的棋子数量
    var numsPrev = 0;
    var numsNext = 0;
    var tmpValue;
    var findWhitePrev = false;
    var findWhiteNext = false;
    var all = 0;
    var step = i - 1;
    var self = Gobang.user == "black" ? 1 : 2;
    var op = Gobang.user == "black" ? 2 : 1;
    // left

    while(label >= 30) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue === self) {
            numsPrev++;
        } else if (tmpValue === op) {
            findWhitePrev = true;
            break;
        } else {
            break;
        }
        step--;
        label -= 30;
    }

    // right
    label = tmp.x + 30;
    step = i + 1;
    while(label <= 450) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue === self) {
            numsNext++;
        } else if (tmpValue === op) {
            findWhiteNext = true;
            break;
        } else {
            break;
        }
        step++;
        label += 30;
    }

    all = numsPrev + numsNext + 1;
    return this.getScore(all, findWhitePrev, findWhiteNext);
}

Player.prototype.calcRightSlant = function(i, tmp) {
    var labelX = tmp.x - 30;
    var labelY = tmp.y - 30;
    // 相邻的棋子数量
    var numsPrev = 0;
    var numsNext = 0;
    var tmpValue;
    var findWhitePrev = false;
    var findWhiteNext = false;
    var all = 0;
    var step = i - 16;
    var self = Gobang.user == "black" ? 1 : 2;
    var op = Gobang.user == "black" ? 2 : 1;

    while(labelX >= 30 && labelY >= 30) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue === self) {
            numsPrev++;
        } else if (tmpValue === op) {
            findWhitePrev = true;
            break;
        } else {
            break;
        }

        step -= 16;
        labelX -= 30;
        labelY -= 30;
    }

    step = i + 16;
    labelX = tmp.x + 30;
    labelY = tmp.y + 30;
    while(labelX <= 450 && labelY <= 450) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue == self) {
            numsNext++;
        } else if (tmpValue === op) {
            findWhiteNext = true;
            break;
        } else {
            break;
        }

        step += 16;
        labelX += 30;
        labelY += 30;
    }

    all = numsPrev + numsNext + 1;

    return this.getScore(all, findWhitePrev, findWhiteNext);
}

Player.prototype.calcLeftSlant = function(i, tmp) {
    var labelX = tmp.x + 30;
    var labelY = tmp.y - 30;
    // 相邻的棋子数量
    var numsPrev = 0;
    var numsNext = 0;
    var tmpValue;
    var findWhitePrev = false;
    var findWhiteNext = false;
    var all = 0;
    var step = i - 14;
    var self = Gobang.user == "black" ? 1 : 2;
    var op = Gobang.user == "black" ? 2 : 1;

    while(labelX <= 450 && labelY >= 30) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue == self) {
            numsPrev++;
        } else if (tmpValue === op) {
            findWhitePrev = true;
            break;
        } else {
            break;
        }

        step -= 14;
        labelX += 30;
        labelY -= 30;
    }

    labelX = tmp.x + 30;
    labelY = tmp.y + 30;
    step = i + 14;
    while(labelX <= 450 && labelY <= 450) {
        tmpValue = Gobang.poi[step].v;
        if (tmpValue == self) {
            numsNext++;
        } else if (tmpValue === op) {
            findWhiteNext = true;
            break;
        } else {
            break;
        }

        step += 14;
        labelX += 30;
        labelY += 30;
    }

    all = numsPrev + numsNext + 1;
    return this.getScore(all, findWhitePrev, findWhiteNext);
}
