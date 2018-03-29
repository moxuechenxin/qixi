/**
 * Created by Administrator on 2018/2/8.
 */
/**
 * С�к���·
 * params{[type]} container [description]
 */
function BoyWalk () {
    var container = $("#content");
    // ��������
    var visualWidth = container.width();
    var visualHeight = container.height();

    // ��ȡλ��
    var getPosition = function (className) {
        var $elem = $(className);
        return {
            height: $elem.height(),
            top: $elem.position().top
        };
    };

    // ·��Y��
    var pathY = function (){
        var data = getPosition('.a_background_middle');
        return data.top + data.height / 2;
    }();

    var $boy = $("#boy");
    var boyWidth = $boy.width();
    var boyHeight = $boy.height();
    // ����С�к�λ��
    $boy.css({
        top: pathY - boyHeight + 20 + 'px'
    });

    // ��ͣ��·
    function pauseWalk () {
        $boy.addClass('pauseWalk');
    }

    // �ָ���·
    function restoreWalk () {
        $boy.removeClass('pauseWalk');
    }

    // css3��·����
    function slowWalk () {
        $boy.addClass('slowWalk');
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

    // ��ʼ�˶�
    function walkRun (time, dist, distY) {
        time = time || 3000;
        // ��·����
        slowWalk();
        var d1 = startRun({
            'left': dist + 'px',
            'top': distY ? distY : undefined
        }, time);
        return d1;
    }

    // �����ƶ�����
    function calculateDist (direction, proportion) {
        return (direction === 'x' ? visualWidth : visualHeight) * proportion;
    }

    return {
        // ��ʼ��·
        walkTo: function (time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        // ֹͣ��·
        stopWalk: function(){
            pauseWalk();
        },
        // �任����
        setColor: function (value) {
            $boy.css({
                'background-color': value
            })
        }
    }
}