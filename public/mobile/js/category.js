$(function () {
    /*1.渲染一级分类*/
    /*2.渲染二级分类  根据一级分类的第一个分类*/
    /*3.点击其他一级分类的时候  选中当前分类*/
    /*4.点击其他一级分类的时候  根据当前点击的分类再次渲染对应的二级分类*/
    /*5.返回上一次页面  进入搜索中心页面*/
    new App();
});
var App = function () {
    this.$top = $('.lt_cateLeft');
    this.$second = $('.lt_cateRight');
    this.init();
};
App.prototype = {
    init:function () {
        var that = this;
        that.renderTop(function (data) {
            //调用渲染二级分类的方法
            that.renderSecond(data.rows[0].id);
        });
        that.bindEvent();
    },
    renderTop:function (callback) {
        var that = this;
        /*1.获取数据*/
        /*2.完成渲染*/
        $.ajax({
            type:'get',
            url:'/category/queryTopCategory',
            data:'',
            success:function (data) {
                that.$top.html(template('top',data));
                //当你传递了回调函数才去调用回调函数
                callback && callback(data);
            }
        });
    },
    renderSecond:function (id) {
        var that = this;
        //获取一级分类加载完成后的rows数据中的第一条的ID
        $.ajax({
            type:'get',
            url:'/category/querySecondCategory',
            data:{
                id:id
            },
            success:function (data) {
                that.$second.html(template('second',data));
            }
        });
    },
    bindEvent:function () {
        var that = this;
        //事件绑定 tap是mui实现的 注意：不要再次加入touch模块
        that.$top.on('tap','li a',function () {
            $(this).parent('li').addClass('now').siblings('li').removeClass('now');
            that.renderSecond(this.dataset.id);
        });

    }
};