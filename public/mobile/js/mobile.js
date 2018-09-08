/*公用函数*/
if(!window.lt){
    window.lt = {};
}
/*1.封装一个获取地址栏传参的方法*/
lt.getParamsByUrl = function () {
    /*?key=鞋&name=10 转成 {key:'鞋',name:10}*/
    var obj = {};
    //获取数据的逻辑
    var search = location.search;
    //检验
    if(search){
        search = search.replace(/^\?/,'');
        if(search){
            //格式 key=value&key1=value1
            var searchArr = search.split('&');
            searchArr.forEach(function (item,i) {
                //item = ‘key=value’
                var itemArr = item.split('=');
                //itemArr = ['key','value'];
                obj[itemArr[0]] = decodeURIComponent(itemArr[1]);
            })
        }
    }
    return obj;
};