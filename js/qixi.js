/**
 * Created by Administrator on 2018/2/9.
 */
var container = $("#content");
// 页面可是区域
var visualWidth = container.width();
var visualHeight = container.height();

// 获取位置
var getPosition = function (className) {
    var $elem = $(className);
    return {
        height: $elem.height(),
        top: $elem.position().top
    }
};

//// 路的Y轴
//var pathY = function(){
//    var data = getPosition(".a_background_middle");
//    console.log(data, 'pathYdata');
//    return data.top + data.height / 2;
//}();

//// 桥的Y轴
//var bridgeY = function () {
//    var data = getPosition(".c_background_middle");
//    return data.top;
//}();

// 小女孩相关
var girl = {
    elem: $(".girl"),
    getHeight: function () {
        return this.elem.height()
    },
    setOffset: function (bridgeY) {
        this.elem.css({
            'left': visualWidth / 2,
            'top': bridgeY - this.getHeight()
        });
    },
    // 转身
    rotate: function(){
        this.elem.addClass("girl-rotate")
    },
    getOffset: function () {
        return this.elem.offset();
    },
    getWidth: function () {
        return this.elem.width();
    }
};

// 灯动画
var lamp = {
    elem: $(".b_background"),
    bright: function(){
        this.elem.addClass('lamp-bright');
    },
    dark: function(){
        this.elem.removeClass('lamp-bright');
    }
};

// 开关门动作
function doorAction (left, right, time) {
    var door = $(".door");
    var doorLeft = $(".door-left");
    var doorRight = $(".door-right");
    var defer = $.Deferred();
    var count = 2;
    // 等待开门完成
    var complate = function(){
        if(count == 1){
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left': left
    }, time, complate);
    doorRight.transition({
        'left': right
    }, time, complate);

    return defer;
}

// 开门
function doorOpen(){
    return doorAction('-50%', '100%', 2000);
}
// 关门
function doorClose(){
    return doorAction('0%', '50%', 2000);
}

var instanceX; // 需要移动的距离

// 动画结束事件
var animationEnd = (function() {
    var explorer = navigator.userAgent;
    if (~explorer.indexOf('WebKit')) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();

/**
 * 小男孩走路
 * @params{[type]} container [description]
 */
function BoyWalk(){
    // 小男孩相关
    var $boy = $("#boy");
    var boyHeight = $boy.height();
    var boyWidth = $boy.width();
    // 路的Y轴
    var pathY = function(){
        var data = getPosition(".a_background_middle");
        return data.top + data.height / 2;
    }();

    // 修正小男孩位置
    $boy.css({
        top: pathY - boyHeight + 25 + 'px'
    });
    // 暂停走路
    function pauseWalk () {
        $boy.addClass('pauseWalk');
    }
    // 恢复走路
    function restoreWalk () {
        $boy.removeClass('pauseWalk');
    }
    // css3动作变化
    function slowWalk () {
        $boy.addClass('slowWalk')
    }

    // 用transition做运动
    function startRun (options, runTime) {
        var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动属性
        $boy.transition(
            options,
            runTime,
            'linear',
            function(){
                dfdPlay.resolve(); // 动画完成
            });
        return dfdPlay;
    }

    // 开始走路
    function walkRun (time, dist, distY) {
        time = time || 3000;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = startRun({
            'left': dist + 'px',
            'top': distY ? distY : undefined
        }, time);

        return d1;
    }

    // 走进商店
    function walkToShop (runTime) {
        var defer = $.Deferred();
        var doorObj = $(".door");
        // 门的坐标
        var offsetDoor = doorObj.offset();
        var doorOfsetLeft = offsetDoor.left;

        // 小男孩当前坐标
        var offsetBoy = $boy.offset();
        var boyOffsetLeft = offsetBoy.left;

        // 当前需要移动的坐标
        instanceX = (doorOfsetLeft + doorObj.width() / 2) - (boyOffsetLeft + boyWidth / 2);

        // 开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX+ 'px),scale(0.3,0.3)',
            opacity: 0.1
        }, 2000);

        // 走路完毕
        walkPlay.done(function(){
            $boy.css({
                opacity: 0
            });
            defer.resolve();
        });
        return defer;
    }

    // 走出店
    function walkOutShop (runTime) {
        var defer = $.Deferred();
        restoreWalk();
        // 开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),scale(1, 1)',
            opacity: 1
        }, runTime);

        // 走路完毕
        walkPlay.done(function(){
            defer.resolve();
        });
        return defer;
    }

    // 取花
    function takeFlower(){
        // 增加延时等待效果
        var defer = $.Deferred();
        setTimeout(function(){
            $boy.removeClass('slowWalk');
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        }, 1000);
        return defer;
    }

    // 计算移动距离
    function calculateDist(direction, proportion) {
        return (direction == 'x' ? visualWidth : visualHeight) * proportion;
    }

    return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY){
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        // 走进商店
        toShop: function(){
            return walkToShop.apply(null, arguments);
        },
        // 走出商店
        outShop: function(){
            return walkOutShop.apply(null, arguments)
        },
        // 停止走路
        stopWalk: function(){
            pauseWalk();
        },
        // 取花
        takeFlower: function(){
            return takeFlower();
        },
        setColor: function (val) {
            $boy.css({
                'background-color': val
            })
        },
        // 获取男孩的宽度
        getWidth: function() {
            return $boy.width();
        },
        // 复位初始状态
        resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        setFlowerWalk:function(){
            $boy.addClass('slowFlowerWalk');
        },
        // 转身动作
        rotate: function(callback) {
            restoreWalk();
            $boy.addClass('boy-rotate');
            // 监听转身完毕
            if (callback) {
                $boy.on(animationEnd, function() {
                    callback();
                    $(this).off();
                })
            }
        }
    }
}