$(function () {
    // mui('.mui-scroll-wrapper').scroll({
    //     indicators:false
    // });
    /*1. 页面初始化  下拉刷新 （第一页，获取数据中，正在刷新中） 渲染页面*/
    /*2. 主动触发 下拉刷新 （第一页，获取数据中，正在刷新中） 渲染页面*/
    /*3. 主动触发 上拉加载  （下一页，获取数据中，正在加载中）追加页面*/
    /*4. 点击搜索按钮  根据搜索框的关键字 重新搜索  下拉刷新 （第一页，获取数据中，正在刷新中） 渲染页面*/
    /*5. 排序功能  排序请求后台数据  下拉刷新 （第一页，获取数据中，正在刷新中） 渲染页面*/
    /*5.1 改样式*/
    /*5.2 获取排序方式  去发请求渲染页面*/

    /*1. 下拉刷新 上拉加载 需要的HTML骨架 和 区域滚动一致即可*/
    /*2. 需要初始化*/
    /*mui.init({
        //组件的名称
        pullRefresh:{
            //具体实现组件功能的容器
            container:'.mui-scroll-wrapper',
            //去掉滚动条
            indicators:false,
            //下拉刷新配置
            down:{
                auto:true,
                callback:function () {
                    var that = this;//组件对象
                    //下拉刷新相关触发后执行
                    //获取数据 渲染页面
                    setTimeout(function () {
                        //清除刷新效果
                        //mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        that.endPulldownToRefresh();
                    },2000);
                }
            },
            //上拉加载
            up:{
                callback:function () {
                    var that = this;
                    setTimeout(function () {
                        that.endPullupToRefresh();
                    },2000);
                }
            }
        }
    });*/
    new App();
});
var App = function () {
    //获取地址栏的搜索关键字
    this.proName = lt.getParamsByUrl().key || '';
    //当前页码
    this.page = 1;
    //默认一页4条
    this.pageSize = 4;
    //容器
    this.$product = $('.lt_product');
    this.$search = $('.lt_search');
    this.$order = $('.lt_order');
    //排序方式
    this.orderType = null;
    this.orderValue = null;
    this.init();
};
App.prototype = {
    init: function () {
        //设置输入内容
        this.$search.find('input').val(this.proName);
        this.initRefresh();
        this.bindEvent();
    },
    initRefresh: function () {
        var _this = this;
        mui.init({
            //组件的名称
            pullRefresh: {
                //具体实现组件功能的容器
                container: '.mui-scroll-wrapper',
                //去掉滚动条
                indicators: false,
                //下拉刷新配置
                down: {
                    auto: true,
                    callback: function () {
                        var that = this;//组件对象
                        //第一页
                        _this.page = 1;
                        _this.render(function (data) {
                            /*替换*/
                            _this.$product.html(template('product', data));
                            that.endPulldownToRefresh();
                            //重置上拉加载功能
                            that.refresh(true);
                        });
                    }
                },
                //上拉加载
                up: {
                    callback: function () {
                        var that = this;
                        //下一页
                        _this.page++;
                        _this.render(function (data) {
                            /*追加*/
                            _this.$product.append(template('product', data));
                            //没有数据的情况  不能允许再次触发上拉加载 带出提示
                            that.endPullupToRefresh(!data.data.length);
                        });
                    }
                }
            }
        });
    },
    render: function (callback) {
        var _this = this;
        /*1.获取数据*/
        /*2.完成渲染*/
        /*异步渲染*/
        var params = {
            proName: _this.proName,
            page: _this.page,
            pageSize: _this.pageSize,
        };
        //根据排序动态追加传参
        if(_this.orderType){
            params[_this.orderType] = _this.orderValue;
        }
        $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: params,
            success: function (data) {
                //模拟网络延时
                setTimeout(function () {
                    /*执行回调*/
                    callback && callback(data);
                }, 1000);
            }
        });
    },
    /*绑定事件*/
    bindEvent: function () {
        var _this = this;
        _this.$search.on('tap', 'a', function () {
            //获取搜索关键字
            var value = _this.$search.find('input').val();
            //根据关键字去查询
            _this.proName = value;
            //没有加载效果的
            /* _this.render(function (data) {
                console.log('log');
                //渲染
                _this.$product.html(template('product',data));
            });*/
            //通过js去触发一次下拉
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        });
        _this.$order.on('tap', 'a', function () {
            _this.order(this);
        });
    },
    order: function (dom) {
        var _this = this;
        //实现排序
        /*1. 修改样式*/
        /*1.1 点击未选中的排序  重置其他排序 选中当中排序*/
        var $curr = $(dom);
        var $currSpan = $curr.find('span');
        /*1.2 点击的已经选中的排序  如果是箭头朝下 那么改为朝上 反正一样*/
        if (!$curr.hasClass('now')) {
            _this.$order.find('a').removeClass('now').find('span').attr('class', 'fa fa-angle-down');
            $curr.addClass('now');
        } else {
            if ($currSpan.hasClass('fa-angle-down')) {
                $currSpan.attr('class', 'fa fa-angle-up');
            } else {
                $currSpan.attr('class', 'fa fa-angle-down');
            }
        }
        /*2. 完成渲染*/
        //排序的方式只能有一种
        //传递参数的时候只能传一个种 （price|num）
        // price 1升序，2降序  num  1升序，2降序
        //获取排序的方式和排序的具体值
        _this.orderType = dom.dataset.type;
        _this.orderValue = $currSpan.hasClass('fa-angle-down') ? 2 : 1;
        //给ajax的data追加 属性orderType属性值orderValue
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    }
};