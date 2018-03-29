/**
 * Created by Administrator on 2018/2/8.
 */
/*封装小男孩的行为*/
var content = $("#content");
var visualHeight = content.height();
var visualWidth = content.width();

var swipe = Swipe(content);

// 获取位置
var getPosition = function(className){
    var elem = $(className);
    return {
        height: elem.height(),
        top: elem.position().top
    }
};

// 路的y轴
var pathY = function () {
    var data = getPosition(".a_background_middle");
    return data.top + data.height/2;
}();

var boy = $("#boy");
// 修正小男孩的正确位置
boy.css({
    top: pathY - boy.height() + 25 + 'px'
});

/*=========== 动画处理 ============*/
// 恢复走路
function restoreWalk () {
    boy.removeClass('pause');
}

// 添加css走路动画
function slowWalk () {
    boy.addClass('slowWalk');
}

// 计算移动距离
function calculateDist (direction, proportion) {
    return (direction === "x" ? visualWidth : visualHeight) * proportion;
}

// 用transition做运动
function startRun (options, runTime) {
    var dfdPlay = $.Deferred(); // 延迟对象
    restoreWalk();
    boy.transition(
        options,
        runTime,
        'linear',
        function() {});
    return dfdPlay;
}

// 开始走路
function walkRun (time, dist, distY) {
    time = time || 3000;
    slowWalk();
    // 开始走路
    var d1 = startRun({
        'left': dist + 'px',
        'top': distY + 'px'
    }, time);
    return d1;
}