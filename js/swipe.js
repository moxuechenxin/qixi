/**
 * Created by Administrator on 2018/2/7.
 */
//  ҳ�滬��
/**
 * [Swipe description]
 * @param {[type]} container [ҳ�������ڵ�]
 * @param {[type]} options   [����]
 */

function Swipe(container) {
    // ��ȡ��һ���ڵ�
    var element = container.find(":first");
    // ����Ԫ��
    var swipe = {};

    //var slides = element.find("li"); // ����li
    var slides = element.find(">"); // ֱ����Ԫ��
    var height = container.height();
    var width = container.width();

    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });

    $.each(slides, function(index){
        var slide = slides.eq(index);
        slide.css({
            width: width + 'px',
            height: height + 'px'
        });
    });

    // ���������ƶ�
    swipe.scrollTo = function(x, speed) {
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': speed + 'ms',
            'transform': 'translate3d(-' + x + 'px, 0px, 0px)'
        });
        return this;
    };

    return swipe;
}