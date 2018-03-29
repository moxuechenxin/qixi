/**
 * Created by Administrator on 2018/2/7.
 */
//  页面滑动
/**
 * [Swipe description]
 * @param {[type]} container [页面容器节点]
 * @param {[type]} options   [参数]
 */

function Swipe(container) {
    // 获取第一个节点
    var element = container.find(":first");
    // 滑动元素
    var swipe = {};

    //var slides = element.find("li"); // 所有li
    var slides = element.find(">"); // 直接子元素
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

    // 监控完成与移动
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