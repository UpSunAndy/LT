//入口函数 使用的是ZEPTO
$(function () {
    //调用MUI的插件方法 使用的mui对象
    mui('.mui-slider').slider({
        interval:3000
    });
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });
});