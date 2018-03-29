/**
 * Created by Administrator on 2018/2/9.
 */
var container = $("#content");
// ҳ���������
var visualWidth = container.width();
var visualHeight = container.height();

// ��ȡλ��
var getPosition = function (className) {
    var $elem = $(className);
    return {
        height: $elem.height(),
        top: $elem.position().top
    }
};

//// ·��Y��
//var pathY = function(){
//    var data = getPosition(".a_background_middle");
//    console.log(data, 'pathYdata');
//    return data.top + data.height / 2;
//}();

//// �ŵ�Y��
//var bridgeY = function () {
//    var data = getPosition(".c_background_middle");
//    return data.top;
//}();

// СŮ�����
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
    // ת��
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

// �ƶ���
var lamp = {
    elem: $(".b_background"),
    bright: function(){
        this.elem.addClass('lamp-bright');
    },
    dark: function(){
        this.elem.removeClass('lamp-bright');
    }
};

// �����Ŷ���
function doorAction (left, right, time) {
    var door = $(".door");
    var doorLeft = $(".door-left");
    var doorRight = $(".door-right");
    var defer = $.Deferred();
    var count = 2;
    // �ȴ��������
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

// ����
function doorOpen(){
    return doorAction('-50%', '100%', 2000);
}
// ����
function doorClose(){
    return doorAction('0%', '50%', 2000);
}

var instanceX; // ��Ҫ�ƶ��ľ���

// ���������¼�
var animationEnd = (function() {
    var explorer = navigator.userAgent;
    if (~explorer.indexOf('WebKit')) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();

/**
 * С�к���·
 * @params{[type]} container [description]
 */
function BoyWalk(){
    // С�к����
    var $boy = $("#boy");
    var boyHeight = $boy.height();
    var boyWidth = $boy.width();
    // ·��Y��
    var pathY = function(){
        var data = getPosition(".a_background_middle");
        return data.top + data.height / 2;
    }();

    // ����С�к�λ��
    $boy.css({
        top: pathY - boyHeight + 25 + 'px'
    });
    // ��ͣ��·
    function pauseWalk () {
        $boy.addClass('pauseWalk');
    }
    // �ָ���·
    function restoreWalk () {
        $boy.removeClass('pauseWalk');
    }
    // css3�����仯
    function slowWalk () {
        $boy.addClass('slowWalk')
    }

    // ��transition���˶�
    function startRun (options, runTime) {
        var dfdPlay = $.Deferred();
        // �ָ���·
        restoreWalk();
        // �˶�����
        $boy.transition(
            options,
            runTime,
            'linear',
            function(){
                dfdPlay.resolve(); // �������
            });
        return dfdPlay;
    }

    // ��ʼ��·
    function walkRun (time, dist, distY) {
        time = time || 3000;
        // �Ŷ���
        slowWalk();
        // ��ʼ��·
        var d1 = startRun({
            'left': dist + 'px',
            'top': distY ? distY : undefined
        }, time);

        return d1;
    }

    // �߽��̵�
    function walkToShop (runTime) {
        var defer = $.Deferred();
        var doorObj = $(".door");
        // �ŵ�����
        var offsetDoor = doorObj.offset();
        var doorOfsetLeft = offsetDoor.left;

        // С�к���ǰ����
        var offsetBoy = $boy.offset();
        var boyOffsetLeft = offsetBoy.left;

        // ��ǰ��Ҫ�ƶ�������
        instanceX = (doorOfsetLeft + doorObj.width() / 2) - (boyOffsetLeft + boyWidth / 2);

        // ��ʼ��·
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX+ 'px),scale(0.3,0.3)',
            opacity: 0.1
        }, 2000);

        // ��·���
        walkPlay.done(function(){
            $boy.css({
                opacity: 0
            });
            defer.resolve();
        });
        return defer;
    }

    // �߳���
    function walkOutShop (runTime) {
        var defer = $.Deferred();
        restoreWalk();
        // ��ʼ��·
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),scale(1, 1)',
            opacity: 1
        }, runTime);

        // ��·���
        walkPlay.done(function(){
            defer.resolve();
        });
        return defer;
    }

    // ȡ��
    function takeFlower(){
        // ������ʱ�ȴ�Ч��
        var defer = $.Deferred();
        setTimeout(function(){
            $boy.removeClass('slowWalk');
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        }, 1000);
        return defer;
    }

    // �����ƶ�����
    function calculateDist(direction, proportion) {
        return (direction == 'x' ? visualWidth : visualHeight) * proportion;
    }

    return {
        // ��ʼ��·
        walkTo: function(time, proportionX, proportionY){
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        // �߽��̵�
        toShop: function(){
            return walkToShop.apply(null, arguments);
        },
        // �߳��̵�
        outShop: function(){
            return walkOutShop.apply(null, arguments)
        },
        // ֹͣ��·
        stopWalk: function(){
            pauseWalk();
        },
        // ȡ��
        takeFlower: function(){
            return takeFlower();
        },
        setColor: function (val) {
            $boy.css({
                'background-color': val
            })
        },
        // ��ȡ�к��Ŀ��
        getWidth: function() {
            return $boy.width();
        },
        // ��λ��ʼ״̬
        resetOriginal: function() {
            this.stopWalk();
            // �ָ�ͼƬ
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        setFlowerWalk:function(){
            $boy.addClass('slowFlowerWalk');
        },
        // ת����
        rotate: function(callback) {
            restoreWalk();
            $boy.addClass('boy-rotate');
            // ����ת�����
            if (callback) {
                $boy.on(animationEnd, function() {
                    callback();
                    $(this).off();
                })
            }
        }
    }
}