
var common={};

//定义rem自适应的基准值
common.remLayout=function (win) {
    var remCalc = {};
    var docEl = win.document.documentElement,
        tid;
    function refreshRem() {
        // 获取当前窗口的宽度
        var width = docEl.getBoundingClientRect().width;
        // 大于640px 按640算
        if (width > 640) { width = 640 }
        var rem = width / 10;  // cms 只要把这行改成  var rem = width /640 * 100
        docEl.style.fontSize = rem + "px";
        remCalc.rem = rem;
        //误差、兼容性处理
        var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
        if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
            var remScaled = rem * rem / actualSize;
            docEl.style.fontSize = remScaled + "px"
        }
    }
    //函数节流，避免频繁更新
    function dbcRefresh() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 100)
    }

    //窗口更新动态改变font-size
    win.addEventListener("resize", function() { dbcRefresh() }, false);

    //页面显示的时候再计算一次   难道切换窗口之后再切换来窗口大小会变?....
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { dbcRefresh() }
    }, false);
    refreshRem();
    remCalc.refreshRem = refreshRem;
    remCalc.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) { val += "px" }
        return val
    };
    remCalc.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) { val += "rem" }
        return val
    };
    win.remCalc = remCalc
}

//返回
common.backUp=function () {
    window.history.back();
}
//首页
common.backIndex=function (url) {
    sessionStorage.clear();
    methodY.clearCookie();
    methodY.openPage(url);
    // var Obj=window.Obj || null;
    //
    // if(Obj){
    //     window.Obj.gameQuit();
    // }else{
    //     methodY.openPage(url);
    // }

}


//提示浮层
common.createFloatLayer=function (selector,txt) {
    var floatLayerTimer=null;
    var $p=$("<p class='floatLayer'>"+txt+"<b></b></p>");
    $p.appendTo(selector);
    $p.click(function () {
        $p.hide('fast',function () {
            clearTimeout(floatLayerTimer);
            $p.unbind('click');
            $p.remove();
        })
    })
    setTimeout(function () {
        $p.hide('fast',function () {
            clearTimeout(floatLayerTimer);
            $p.unbind('click');
            $p.remove();
        })
    },5000)
}

//提示信息
common.createAlertInfo=function (txt,callback) {

    if($('body>.bg').length==0){
        var bg=$('<div class="bg"></div>');
        $(bg).appendTo($('body'));



        var alertInfoTimer=null;
        var $p=$("<p class='alertInfo'>"+txt+"</p>");
        $p.appendTo($('body>.bg'));

        $(bg).click(function () {
            $p.hide('fast',function () {
                clearTimeout(alertInfoTimer);
                $p.unbind('click');
                $('body>.bg').remove();
                callback && callback();
            })
        })

        $p.click(function () {
            $p.hide('fast',function () {
                clearTimeout(alertInfoTimer);
                $p.unbind('click');
                $('body>.bg').remove();
                callback && callback();
            })
        })
        alertInfoTimer=setTimeout(function () {
            $p.hide('fast',function () {
                clearTimeout(alertInfoTimer);
                $p.unbind('click');
                $('body>.bg').remove();
                callback && callback();
            })
        },3000)
    }
}

//存储登录状态
common.setLoginStatus=function (v) {
    methodY.setCookie('loginUser',v);
}

//获取登录状态
common.getLoginStatus=function () {
    var temp=methodY.getCookie('loginUser');
    if(typeof(temp) == 'string'){
        return temp;
    }else if(typeof(temp) == 'object'){
        return temp;
    }else {
        return null;
    }

}

//清除登录状态
common.delLoginStatus=function () {
    methodY.delCookie('loginUser');
}

//获取机器标识
common.getDeviceMessage=function () {
    var android=window.android || null;
    if(android){
        android.getDeviceMessage();
    }else{
        common.createAlertInfo('android不存在！');
    }
}

//存储机器标识
var setDeviceMessage=function (id) {
    localStorage.setItem('deviceId',id);//本地存储

    ajaxY.deviceInfo(id,function(data){
        if(data.code=='0000'){
            localStorage.setItem('deviceInfo',JSON.stringify(data.bizResult[0]));
        }else if(data.code=='9994'){

            setDeviceMessage(123456)
        }
    })
}