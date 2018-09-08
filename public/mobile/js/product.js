$(function () {
    /*1. 页面初始化 下拉刷新 的去加载商品详情数据且完成渲染*/
    /*2. 主动下拉的时候  下拉刷新 的去加载商品详情数据且完成渲染*/
    /*3. 交互功能  选择尺码  选择数量*/
    /*4. 点击加入购物车 发请求个后台*/
    /*4.1 响应：如果没有登录  业务：跳转去登录页进行等再返回*/
    /*4.2 响应：添加成功  业务：弹窗提示  去购物车 去 不去*/
    new App();
});
var App = function () {
    this.id = lt.getParamsByUrl().productId;
    this.$product = $('.mui-scroll');
    this.init();
};
App.prototype = {
    init:function () {
        this.initRefresh();
        this.bindEvent();
    },
    initRefresh:function(){
        var _this = this;
        mui.init({
            pullRefresh:{
                container:'.mui-scroll-wrapper',
                indicators:false,
                down:{
                    auto:true,
                    callback:function () {
                        var that = this;
                        _this.render(function () {
                            that.endPulldownToRefresh();
                        });
                    }
                }
            }
        });
    },
    render:function (callback) {
        var _this = this;
        $.ajax({
            type:'get',
            url:'/product/queryProductDetail',
            data:{
                id:_this.id
            },
            success:function (data) {
                //渲染
                setTimeout(function () {
                    _this.$product.html(template('product',data));
                    //动态追加的组件 需要重新初始化一次
                    mui('.mui-slider').slider({interval:3000});
                    callback && callback();
                },1000);
            }
        });
    },
    bindEvent:function () {
        var _this = this;
        //数量输入框
        _this.$product.on('tap','[data-size]',function () {
            $(this).addClass('now').siblings('span').removeClass('now');
        }).on('tap','[data-type]',function () {
            var $input = _this.$product.find('[type="number"]');
            var value = $input.val();
            var max = $input.data('max');// jquery|zepto 操作自定义属性的函数
            if(this.dataset.type == 0){
                //减
                if(value <= 1){
                    mui.toast('至少选一件');
                    return;
                }
                value --;
            }else{
                //加
                if(value >= max){
                    mui.toast('超过库存了');
                    return;
                }
                value ++;
            }
            $input.val(value);
        });
        $('.addCart').on('tap',function () {
            _this.addCart();
        });
    },
    addCart:function () {
        var _this = this;
        //加入购物车
        //1.获取提交的数据
        var data = {
            productId:_this.id,
            size:$('[data-size].now').data('size'),
            num:$('[type="number"]').val()
        }
        //2.数据校验
        if(!data.size){
            mui.toast('请选择尺码');
            return;
        }
        //3.提交数据
        $.ajax({
            type:'post',
            url:'/cart/addCart',
            data:data,
            success:function (data) {
                console.log(data);
                /*1. 是否登录*/
                //{error:400,message:'未登录'}
                /*2. 添加成功*/
                //{success:true}
            }
        });
    }
};