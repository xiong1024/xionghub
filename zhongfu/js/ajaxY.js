
var ajaxY={};//请求方法库

ajaxY.configure={//配置参数

    // bettingUrl:'http://122.144.133.211:8006/front-v4/http.do',//投注接口, 上海

    ajaxUrl:'http://60.174.212.11:10006/front-v4/query.do',//统一请求路径
    bettingUrl:'http://60.174.212.11:10006/front-v4/http.do',//投注接口,
    newAjaxUrl:'http://60.174.212.11:10006/front-v4/api.do',//统一请求路径



    bettStatusUrl:'http://60.174.212.11:10006/front-v4/api.do',//投注状态接口



    timeout:1000,//请求超时时间（毫秒）
    secretKey:"1hblS7t",//秘钥
    recordLength:10,//历史获奖记录条数
}
    ajaxY.ajaxData=function (obj) {
    var url=obj.url || this.configure.ajaxUrl;
    var type=obj.type || 'post';//默认post请求
    var data=obj.data || '';

    $.ajax({
        url:url,
        type:type,
        data:JSON.stringify(data),
        dataType:"json",
        success:function(data){
            if(obj.success){
                obj.success(data);
            }else{
                console.log("获取数据成功，但未设置成功回调；");
            }
        },
        error:function(XMLHttpRequest,textStatus,errorThrown) {
            var data = {
                XMLHttpRequest:XMLHttpRequest,
                textStatus:textStatus,
                errorThrown:errorThrown
            };
            if(obj.error){
                obj.error();
            }else{
                console.log(data);
            }

        }
    });
}

//登陆
ajaxY.login=function (userInfo,success,error) {
    var toData={
        command:"userLogin",
        bizParams:userInfo
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}
//注册
ajaxY.reg=function (userInfo,success,error) {
    var toData={
        command:"register",
        bizParams:userInfo,

    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}
//是否注册
ajaxY.isReg=function (phone,success,error) {
    var toData={
        command:"isRegister",
        bizParams:{phone:phone}

    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));

    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}
//重置
ajaxY.rePwd=function (userInfo,success,error) {
    var toData={
        command:"modifyPassward",
        bizParams:userInfo

    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}

//获取验证码
ajaxY.getMessageCode=function (phone,status,success,error) {
    var toData={
        command:"getMessageCode",
        bizParams:{phone:phone,status:status}
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}

//是否实名
ajaxY.isReal=function (phone,success,error) {
    var toData={
        command:"queryUserReal",
        bizParams:{phone:phone}

    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));

    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}

//创建虚拟账户
ajaxY.noReg=function (userInfo, success, error) {
    var userInfo=userInfo || {
            phone:'',
            peopleNum:'',
            name:''
        }
    var toData ={
        command:"createUserIsNot",
        bizParams:{
            phone:userInfo.phone,
            peopleNum:userInfo.peopleNum,
            status:'2',
            name:userInfo.name,
            prizeType:'0',
            remark:'null'
        }
    }
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));

    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    })
}

//获取期次信息
ajaxY.getStageInfo=function (success, error) {
    var toData={
        "command":"queryStage",
        "bizParams":{a:"a"}
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}
//获取服务器时间
ajaxY.getServerTime=function (success, error) {
    var toData={
        "command":"queryServerTime",
        "bizParams":{a:"a"}
    }
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}

//获取历史开奖记录
ajaxY.getHistoryRecords=function (lottType,success, error) {
    var toData={
        "command":"queryStartLottoInfo",
        "bizParams":{
            "lotteryType":lottType,
            "stageNumber":ajaxY.configure.recordLength
        }
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}

//下单
ajaxY.createOrder=function (toData,success,flag) {

    var flag=flag || false;
    var url=flag==true ? ajaxY.configure.newAjaxUrl : ajaxY.configure.ajaxUrl;
    toData.MD5 = hex_md5(ajaxY.configure.secretKey + JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        url:url,
        data:toData,
        success:success,
    });
}
//投注
ajaxY.betting=function (toData,success,error) {

    ajaxY.ajaxData({
        url:ajaxY.configure.bettingUrl,
        data:toData,
        success:success,
        error:error
    });
}

//查询订单状态
ajaxY.queryOrderStatus=function (orderNumber,success,flag) {
    flag=false;
    var url=flag==true ? ajaxY.configure.newAjaxUrl : ajaxY.configure.ajaxUrl;
    var toData={
        "command": "queryOrderStatus",
        "bizParams": {
            orderNumber:orderNumber,
        }
    };
    toData.MD5 = hex_md5(ajaxY.configure.secretKey + JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        url:url,
        data:toData,
        success:success,
    });
}

//查询投注状态
ajaxY.quertBettStatus=function (orderNumber,success,error) {
    var toData={
        "command": "queryOrderStatus",
        "bizParams": {
            orderNumber:orderNumber,
        }
    };
    toData.MD5 = hex_md5(ajaxY.configure.secretKey + JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        url:ajaxY.configure.bettStatusUrl,
        data:toData,
        success:success,
        error:error
    });
}


//获取用户信息
ajaxY.getUserInfo=function (phone, success, error) {
    var toData={
        command:"getUserCenterInfo",
        bizParams:{phone:phone}
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}

//账户支付短信验证码验证
ajaxY.validAccountCode=function (phone, code, success, error) {
    var toData={
        command:"validateCode",
        bizParams:{phone:phone,code:code}
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}

//出票信息
ajaxY.printInfo=function (orderNumber,phone,success,error) {
    var toData={
        command:"queryReceiptInfo",
        bizParams:{
            orderNumber:orderNumber,
            phone:phone
        }
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}

//真票信息
ajaxY.realPrintInfo=function (orderNumber,phone,stage,success,error) {
    var toData={
        command:"queryLotteryInfo",
        bizParams:{
            orderNumber:orderNumber,
            phone:phone,
            stage:stage
        }
    };
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}

//设备信息
ajaxY.deviceInfo=function (id,success,error) {

    var toData={
        "command": "queryTermInfo",
        "bizParams": {
            clientId:'h5',
            clientCode:id || '123456'
        }
    };
    console.log(toData);
    toData.MD5=hex_md5(ajaxY.configure.secretKey+JSON.stringify(toData.bizParams));
    ajaxY.ajaxData({
        data:toData,
        success:success,
        error:error
    });
}