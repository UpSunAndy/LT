$(function () {
    /*1.根据当前的存储数据进行渲染*/
    /*2.点击搜索框 获取搜索关键字 跳转去商品列表页面 同时 存储历史搜索  */
    /*2.1 没有重复的搜索 且有不超过10条  正常追加*/
    /*2.2 有重复的搜索 追加一条新的 需要去掉之前*/
    /*2.3 超过10条 追加一条新的 需要去掉第一个*/
    /*3.删除*/
    /*4.清空*/
    new App();
});
var App = function () {
    this.$searchInput = $('.lt_search');
    this.$searchHistory = $('.lt_history');

    //存储数据的key
    this.KEY = 'fullStack06';
    //获取存储的数据 数组格式的数据
    this.list = JSON.parse(localStorage.getItem(this.KEY) || '[]');

    this.init();
};
App.prototype = {
    init: function () {
        this.$searchInput.find('input').val('');
        this.render();
        this.bindEvent();
    },
    render: function () {
        //存储的方式：localStorage
        //约定好KEY fullstack06 和 value 的数据格式 [“”，““] json字符串
        this.$searchHistory.html(template('history', {list:this.list,ec:encodeURIComponent}));
    },
    delete: function (index) {
        this.list.splice(index,1);
        //存储
        localStorage.setItem(this.KEY,JSON.stringify(this.list));
        //重新=渲染
        this.render();
    },
    clear: function () {
        this.list = [];
        localStorage.setItem(this.KEY,JSON.stringify(this.list));
        this.render();
    },
    add: function (value) {
        var isSame = false;//是否有相同的
        var sameIndex = null;//相同的时候索引
        this.list.forEach(function (item, i) {
            if (item === value) {
                isSame = true;
                sameIndex = i;
                return false;
            }
        });
        /*1.重复*/
        if (isSame) {
            //删除重复
            this.list.splice(sameIndex, 1);
        } else {
            if(this.list.length >= 10){
                /*2.超过*/
                //删除第一个
                this.list.splice(0,1);
            }
        }
        //追加
        this.list.push(value);
        //存储
        localStorage.setItem(this.KEY,JSON.stringify(this.list));
    },
    bindEvent: function () {
        var that = this;
        that.$searchInput.on('tap', 'a', function () {
            /*1.获取*/
            var value = that.$searchInput.find('input').val();
            /*2.校验*/
            if (!value) {
                //友好提示
                mui.toast('输入搜索关键字');
                //终止程序
                return;
            }
            /*3.跳转*/
            location.href = '/mobile/searchList.html?key='+encodeURIComponent(value);
            /*4.追加历史*/
            that.add(value);
        });
        that.$searchHistory.on('tap','li span',function () {
            that.delete(this.dataset.index);
        }).on('tap','.tit a',function () {
            that.clear();
        });
    }
};
/*1.进行传参 怎么传参 URL  参数叫什么 约定key*/
/*1.1 点击搜索按钮的时候传参*/
/*1.2 点击搜索历史的时候传参*/
/*2.获取参数 特殊字符串情况 key=a=10  转成 URL编码 a%2010 */
/*2.1 先转成URL编码 encodeURIComponent  在获得的时候  解码 decodeURIComponent*/
/*2.2 artTemplate 模板引擎  不能使用外部函数和对象 提高性能 */
/*2.3 url中文乱码 使用这个方式*/

