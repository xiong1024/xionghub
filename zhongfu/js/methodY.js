
var methodY={};//方法库

methodY.configure={
    timeOut:5 * 60*1000,//默认存储过期时间
}


methodY.loadHtml=function (selector,url,callback) {
    selector.empty();
    selector.load(url,function () {
        callback && callback();
    })
},
methodY.loadScript=function (url, callback) {
    console.log(url);
    var script=document.createElement('script');

    script.type='text/javascript';
    if(script.readState){//IE
        script.onreadystatechange=function () {
            if(script.readyState=='loaded' || script.readyState=='complete'){
                script.onreadystatechange=null;
                callback && callback();
            }
        }
    }else {//FF,Chrome,Opera
        script.onload=function () {
            callback && callback();
        }
    }
    //生成时间戳
    var timeStr=methodY.getNowStr()+Math.random()*10;
    script.src=url+'?v='+timeStr;
    console.log(script);
    document.getElementsByTagName('head')[0].appendChild(script);
}
methodY.openPage=function(url){
    window.open(url,'_self');
}


methodY.getNowStr=function (separator,date) {
    var myDate =date || new Date();
    console.log(myDate);
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date=myDate.getDate();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();

    if(separator){
        return year+separator+methodY.p(month)+separator+methodY.p(date)+' '+methodY.p(h)+':'+methodY.p(m)+':'+methodY.p(s);
    }else{
        return year.toString()+methodY.p(month)+methodY.p(date)+methodY.p(h)+methodY.p(m)+methodY.p(s);
    }
}

methodY.getDayByMS=function (time) {//日、时、分、秒
    var ms=time%1000;//余毫秒
    var ss=(time - ms%1000)/1000;//共计 秒

    var curS=ss%60;//秒
    var curMM=((ss-curS)/60)%60;//分
    var curH=(((ss-curS)/60 - curMM)/60)%24;//时
    var curDay=(((ss-curS)/60 - curMM)/60-curH)/24;//天

    return [curDay,curH,curMM,curS];
}



methodY.createRandomArrNum=function (num,to,from) {//随机一组num
    var from=from || 0;
    var arr=[];
    for(var i=from;i<=to;i++){
        arr.push(i);
    }

    arr.sort(function(){
        return 0.5-Math.random();
    });

    arr=arr.splice(parseInt(Math.random() * (to -num-from))+1,num);
    arr.sort(function(a,b){
        return a-b;
    })

    return arr;
}
methodY.re_array=function (arr) {//数组去重
    var obj={};
    var temp=[];
    $.each(arr,function (k, v) {
        if(!obj[v]){
            obj[v]=1;
            temp.push(v);
        }
    })
    return temp;
}
methodY.in_array=function (search,array) {//查找数组内是否有指定内容
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}

methodY.attr_delByIndex=function (attr,index) {
    var tempAttr=[];
    for(var i=0;i<attr.length;i++){
        if(i==index){
            continue;
        }
        tempAttr.push(attr[i]);
    }
    return tempAttr;
}

methodY.randomNum=function (min, max) {//生成指定范围的随机数
    return Math.floor(min+Math.random()*(max-min));
}

methodY.totalCount=function (numlength, more) {//计算无序组合
    var m = 1, n = 1;
    while (more >= 1) {
        m *= numlength;
        n *= more;
        numlength--;
        more--;
    }
    return m / n;
}
methodY.totalQuadrature=function () { // 求积
    var sum = 1;

    for(var i=0;i<arguments.length;i++){
        sum*=parseInt(arguments[i]);
    }

    return sum;
}
methodY.totalSum=function () { // 求和
    var sum = 0;

    for(var i=0;i<arguments.length;i++){
        sum+=parseInt(arguments[i]);
    }


    return sum;
}


methodY.supports_h5_sessionStorage=function(){//验证是否支持sessionStorage
    if('sessionStorage' in window && window['sessionStorage'] !== null){
        return true;
    }else{
        return false;
    }
}

methodY.supports_h5_localStorage=function(){//验证是否支持localStorage
    if('localStorage' in window && window['localStorage'] !== null){
        return true;
    }else{
        return false;
    }
}

methodY.setCookie=function(k,v,t){//写入cookie
    var days=t || methodY.configure.timeOut;
    var exp = new Date();
    v= typeof (v) == 'object' ? JSON.stringify(v) : v;
    exp.setTime(exp.getTime()+days);
    document.cookie = k + "="+ escape (v) + ";expires=" +exp.toGMTString()+';path=/';
}

methodY.getCookie=function(k){//读取cookie
    var arr,reg=new RegExp("(^| )"+k+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        var result=unescape(arr[2]) ? JSON.parse(unescape(arr[2])) : unescape(arr[2]);
        return result;
    }else{
        return null;
    }
}

methodY.delCookie=function(k){//删除指定cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=methodY.getCookie(k);
    if(cval!=null){
        document.cookie= k + "="+cval+";expires="+exp.toGMTString();
        document.cookie= k + "="+cval+";expires="+exp.toGMTString()+';path=/';//根目录
    }
}

methodY.clearCookie=function(){//清空cookie
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);

    if (keys) {
        for (var i = keys.length; i--;){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=methodY.getCookie(name);
            document.cookie=keys[i]+'='+cval+';expires=' + exp.toGMTString();
            document.cookie=keys[i]+'='+cval+';expires=' + exp.toGMTString()+';path=/';
        }
    }
}
methodY.setInfo=function(k,v,t){//存储信息
    if(this.supports_h5_sessionStorage()){
        sessionStorage.setItem(k,v);
    }else {
        this.setCookie(k,v,t);
    }
}
methodY.getInfo=function(k){//读取信息
    var info=null;
    if(this.supports_h5_sessionStorage()){
        info=sessionStorage.getItem(k);
    }else {
        info=this.getCookie(k);
    }

    return info ? JSON.parse(info) : {};
}
methodY.delInfo=function(){//删除指定信息
    if(this.supports_h5_sessionStorage()){
        sessionStorage.removeItem(k);
    }else {
        this.delCookie(k);
    }
}

//从url中截取信息
methodY.$_GET=(function(){//获取GET参数 可以直接 $_GET['get参数']
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {

        return {};
    }
})();


methodY.p=function (num) {//小于10加0
    if(parseInt(num) && num<10){
        return '0'+num;
    }else{
        return num;
    }
}

methodY.rp=function (num) {//去掉前缀‘0’
    if(parseInt(num)){
        return parseInt(num);
    }else{
        return num;
    }
}

methodY.rh=function (str, s) {//去掉后缀
    var tempAtt=str.substr(0,str.lastIndexOf(s));
    return tempAtt;
}

methodY.getOrderNumber=function (client) {//订单号格式
    return client+methodY.getNowStr()+methodY.randomNum(100,999);
}


methodY.reClick=function (self,txt) {//重复点击
    var txt=txt || '';
    $(self).attr('disabled',true);
    $(self).addClass('disabled');
    if(txt){
        $(self).text(txt);
    }
}

