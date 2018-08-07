

var order={};
order.configure={
    clientId:'02110000'//(localStorage.getItem('deviceInfo') ? JSON.parse(localStorage.getItem('deviceInfo')).clientId : '02103000') || '02103000',//终端号
}
//支付窗口
var payType={
    accountTimer:null,
    orderTimer:null,
    countTimer:null,
    bettTimer:null,
    accountFlag:false,
    payInfo:null,
    curUser:null,
    count:0,
    payList:{
        '2':{//账户
            name:'账户支付',
            note:'未登录，<a>立即登录</a>',
            img:'<img src="../../resource/images/lott/head.png" />',
            status:'disabled',
            isShow:true
        },
        '10':{//支付宝
            name:'支付宝支付',
            note:'快捷无需手续费',
            img:'<img src="../../resource/images/lott/zfb.png" />',
            status:'',
            isShow:true,
            interface:'alp_OrderTrader'
        },
        '11':{//微信
            name:'微信',
            note:'快捷无需手续费',
            img:'<img src="../../resource/images/lott/weixin.png" />',
            status:'',
            isShow:true,
            interface:'wxp_OrderTrader'
        },
        '19':{//银行卡
            name:'银行卡',
            note:'快捷无需手续费',
            img:'<img src="../../resource/images/lott/bank.png" />',
            status:'',
            isShow:false,
            interface:'huiFuPayOrder'
        },
        '20':{//支付宝
            name:'支付宝',
            note:'快捷无需手续费',
            img:'<img src="../../resource/images/lott/zfb.png" />',
            status:'',
            isShow:false,
            interface:'huiFuPayOrder'
        },
        '21':{//微信
            name:'微信',
            note:'快捷无需手续费',
            img:'<img src="../../resource/images/lott/weixin.png" />',
            status:'',
            isShow:false,
            interface:'huiFuPayOrder'
        }
    },
    init:function () {
        this.bindEvent();
        var lottInfo=methodY.getInfo('lottInfo');
        console.log(methodY.getCookie('loginUser'));
        //订单金额
        $('.payList>p>label>span').text(lottInfo.payBonus);
        //加载支付方式列表
        methodY.getInfo('account') ? this.payList[2].isShow=true : this.payList[2].isShow=false;
        payType.methods.setPayList($('.payList>ul'),payType.payList,methodY.getCookie('loginUser'),lottInfo.payBonus);

        //更新账户状态
        payType.accountTimer=setInterval(function () {
            var curUser=methodY.getCookie('loginUser') || {};

            if(payType.curUser && curUser.phone!=payType.curUser.phone){
                payType.methods.setPayList($('.payList>ul'),payType.payList,curUser,lottInfo.payBonus);
            }

        },30*1000)
    },
    bindEvent:function () {
        //返回
        $('.navBox .backUp').click(function () {
            window.history.back();
        })
        //首页
        $('.navBox .backHome').click(function () {
            var obj=window.Obj || null;
            if(obj){
                obj.gameQuit();
            }else{
                methodY.openPage('index.html');
            }
        })
        //支付方式
        $('.payList>ul').click(function (e) {
            var target=(e || window.event).target || (e || window.event).srcElement;

            if(target.nodeName=='LI' || $(target).parents('li').length>0){
                if(target.nodeName=='A' && ( $(target).parents('li').attr('data-type')=='2' || $(target).parents('li').attr('data-type')=='5')){
                    //绑定账户支付登陆事件
                    $(".contentBox .account").slideDown('normal').siblings().hide();

                    // var curPhone= methodY.getInfo('phoneUser').phone;
                    //
                    // $('.contentBox .account input.validPhone').val(curPhone);
                    // return false;


                    var curPhone= localStorage.getItem('phoneLott');
                    if(curPhone){
                        $('.contentBox .account input.validPhone').val(curPhone);
                        $('.contentBox .account input.validPhone').attr('readonly',true);
                    }else{
                        $('.contentBox .account input.validPhone').attr('readonly',false);
                    }

                    return false;
                };
                var curNode= target.nodeName=='LI'?target : $(target).parents('li').get(0);
                if(!$(curNode).hasClass('disabled')){
                    $(curNode).addClass('checked').siblings('li').removeClass('checked');
                }
            }
        })
        //确认支付
        $('#payOk').click(function () {
            methodY.reClick(this,'提交中...');//避免重复点击
            $(".payBg").fadeIn('fast');
            payType.methods.loadCountDown();
            //投注信息
            var lottInfo=methodY.getInfo('lottInfo');


            var curPhone=localStorage.getItem('phoneLott');
            ajaxY.getUserInfo(curPhone,function (data) {//获取当前手机号码用户信息
                if(data.code=='0000' || data.code=='5498'){

                    var curUser=data.bizResult || {};
                    payType.payInfo={
                        userInfo:{
                            phone:curUser.phone || curPhone,
                            userName:curUser.name || '',
                            peopleNum:curUser.peopleNum || ''
                        },//用户信息
                        clientId:order.configure.clientId,//终端号
                        lottType:lottInfo.lottType,//彩种
                        price:2,//彩票价格
                        stage:lottInfo.stage,//期次
                        lotteryNumber:lottInfo.lottNumber,//投注号码
                        amount:lottInfo.amount,//总注数
                        multiple:lottInfo.multiple,//倍数
                        add_stage:lottInfo.add_stage,//追号
                        isStop:lottInfo.isStop,//中奖后是否停止追号
                        orderNumber:methodY.getOrderNumber(order.configure.clientId),//订单号
                        orderTime:methodY.getNowStr('-'),//订单时间
                        orderType:'lott',//订单类型
                        payType:$('.payList>ul>li.checked').attr('data-type'),//支付类型,
                        lotteryDate:lottInfo.lotteryDate,
                        payBous:lottInfo.payBonus,
                    }

                    console.log(payType.payInfo);
                    if(payType.payInfo.payType=='2'){//账户支付短信验证码
                        $(".validCode").slideDown('normal').siblings().hide();
                    }else if(payType.payInfo.payType=='10' || payType.payInfo.payType=='11'){
                        payType.methods.payOk(payType.payInfo,function (data) {

                            $(".qrocodeBox").fadeIn('normal');
                            $("#qrcodeCanvas").empty();
                            var payTypeTxt={
                                '10':'支付宝',
                                '11':'微信'
                            }
                            var payNote=payTypeTxt[payType.payInfo.payType];

                            $("#qrcodeCanvas").qrcode(data.bizResult);
                            $('.qrcodeCanvas>h1>span').text(payNote);
                            $('.qrcodeCanvas>h4>span').text(lottInfo.payBonus+'.00');

                        });
                    }else if(payType.payInfo.payType=='19' || payType.payInfo.payType=='20' || payType.payInfo.payType=='21'){//第三方支付
                        //银行卡支付
                        payType.methods.payOk(payType.payInfo,function (data) {
                            if(data.code=='0000'){
                                var payTypeTemp={
                                    '19':'02',//刷卡
                                    '20':'03',//支付宝
                                    '21':'04',//微信
                                }
                                //通知第三方
                                var cardPayInfo={
                                    orderId:payType.payInfo.orderNumber,
                                    orderAmt:lottInfo.payBonus,
                                    payType:payTypeTemp[payType.payInfo.payType],
                                    companyName:'华夏鑫彩',
                                    merchantNo:'3100026000030900',
                                    terminalNo:'68265721',
                                    bgRetUrl:'http://150.242.239.206:8006/front-v4/huiFuNotify.do'
                                }
                                console.log(cardPayInfo);
                                var obj=window.Obj || null;
                                if(obj){
                                    obj.payByCard(JSON.stringify(cardPayInfo))
                                }
                            }
                        })
                    }
                }else {
                    common.createAlertInfo('获取用户信息异常');
                }
            })

            //var curUser=methodY.getInfo('phoneUser') || {};
            // payType.payInfo={
            //     userInfo:{
            //         phone:curUser.phone,
            //         userName:curUser.name || '',
            //         peopleNum:curUser.peopleNum || ''
            //     },//用户信息
            //     clientId:order.configure.clientId,//终端号
            //     lottType:lottInfo.lottType,//彩种
            //     price:2,//彩票价格
            //     stage:lottInfo.stage,//期次
            //     lotteryNumber:lottInfo.lottNumber,//投注号码
            //     amount:lottInfo.amount,//总注数
            //     multiple:lottInfo.multiple,//倍数
            //     add_stage:lottInfo.add_stage,//追号
            //     isStop:lottInfo.isStop,//中奖后是否停止追号
            //     orderNumber:methodY.getOrderNumber(order.configure.clientId),//订单号
            //     orderTime:methodY.getNowStr('-'),//订单时间
            //     orderType:'lott',//订单类型
            //     payType:$('.payList>ul>li.checked').attr('data-type'),//支付类型,
            //     lotteryDate:lottInfo.lotteryDate,
            //     payBous:lottInfo.payBonus,
            // }
            //
            // if(payType.payInfo.payType=='2'){//账户支付短信验证码
            //     $(".validCode").slideDown('normal').siblings().hide();
            // }else{
            //     payType.methods.payOk(payType.payInfo,function (data) {
            //
            //         $(".qrocodeBox").fadeIn('normal');
            //         $("#qrcodeCanvas").empty();
            //         var payTypeTxt={
            //             '10':'支付宝',
            //             '11':'微信'
            //         }
            //         var payNote=payTypeTxt[payType.payInfo.payType];
            //
            //         $("#qrcodeCanvas").qrcode(data.bizResult);
            //         $('.qrcodeCanvas>h1>span').text(payNote);
            //         $('.qrcodeCanvas>h4>span').text(lottInfo.payBonus+'.00');
            //
            //
            //     });
            // }

        });

        //二维码关闭
        $('.qrocodeBox .icon-delete').click(function () {
            $("#qrcodeModal").show();
        })

        $('#telCanel').click(function () {
            $('.modalY').hide();
        })
        $('#telOk').click(function () {
            $('.modalY').hide();
            //关闭查询订单定时器
            clearTimeout(payType.orderTimer);
            payType.countTimer=null;
            clearInterval(payType.countTimer);
            payType.count=0;
            $(".qrocodeBox").fadeOut('fast');
            $("#qrcodeCanvas").empty();
            $('.payBg').fadeOut('fast');
            $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
        })

        //登陆账户——返回
        $('.account .loginBackBtn').click(function () {
            $(".account").hide().siblings('.payList').show();
            $('.account input').val('');//重置
        })

        //确认登陆账户
        $('.account .loginAccountBtn').click(function () {

            var curPhone= methodY.getInfo('phoneUser').phone;
            var txtPhone=$(this).parent('li').siblings('li').find('input.validPhone').val();

            //登陆验证
            var userInfo={
                phone:txtPhone,
                password:$(this).parent('li').siblings('li').find('input.validPwd').val()
            };
            if(userInfo.password){

                ajaxY.login(userInfo,function (data) {
                    if(data.code=='0000'){
                        if(curPhone && txtPhone==curPhone){//如果登陆账户和中奖通知号码相同

                            var loginUser=methodY.getInfo('phoneUser');
                            common.setLoginStatus(loginUser);
                            payType.curUser=loginUser;
                            //重新加载支付方式列表
                            payType.methods.setPayList($('.payList>ul'),payType.payList,loginUser,$('.payList>p>label>span').text());
                            //返回支付窗口
                            $('.payList').show().siblings().hide();

                            $(".account input").val('');
                        }else{//不同，重新请求获取用户信息
                            ajaxY.getUserInfo(txtPhone,function (data) {
                                common.setLoginStatus(data.bizResult);
                                payType.curUser=data.bizResult;
                                //重新加载支付方式列表
                                payType.methods.setPayList($('.payList>ul'),payType.payList,data.bizResult,$('.payList>p>label>span').text());
                                //返回支付窗口
                                $('.payList').show().siblings().hide();
                                $(".account input").val('');
                            })
                        }

                    }else{
                        common.createAlertInfo(data.msg);
                    }
                },function () {
                    common.createAlertInfo('获取用户信息异常')
                })
            }else{
                common.createAlertInfo('密码不能为空!')
            }


        })

        //短信验证码
        //获取验证码
        $("#getMessageCodeBtn").click(function () {
            methodY.reClick(this);//避免重复点击
            var flag=$(this).attr('data-flag');
            if(flag=='true'){
                $('#getMessageCodeBtn').attr('data-flag',false);
                ajaxY.getMessageCode(payType.payInfo.userInfo.phone,1,function (data) {
                    if(data.code=='0000'){
                        var timeOut=60;//验证码超时

                        var validCodeTimer=null;
                        setTimeout(function(){
                            validCodeTimer = setInterval(function(){
                                timeOut--;
                                $("#codeTimer").text('('+timeOut+')');
                                if(timeOut<=0){
                                    $('#getMessageCodeBtn').attr('data-flag',true);
                                    $('#getMessageCodeBtn').css('backgroundColor','#ff9c00');
                                    $("#codeTimer").empty();
                                    clearInterval(validCodeTimer);

                                }
                                return;
                            },1000);
                            return;
                        },30);
                    }else{
                        common.createAlertInfo(data.msg);
                    }
                })
            }

        })
        //返回
        $(' .validCode .validCodeBackBtn').click(function () {
            $(" .validCode").hide().siblings('.payList').show();
            $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
            $(" .validCode input").val('');
        })
        //确定
        $('.validCode .validCodeBtn').click(function () {
            methodY.reClick(this);//避免重复点击


            if(!($("#validCode").val())){
                $("#validCode").addClass('error');
                common.createAlertInfo("请输入验证码");
                return false;
            }else{
                ajaxY.validAccountCode(payType.payInfo.userInfo.phone,$("#validCode").val(),function (data) {
                    $('.validCode .validCodeBtn').text('确定').removeClass('disabled').attr('disabled',false)
                    if(data.code=='0000'){
                        $(".validCode").fadeOut('fast',function () {

                            $(".payList").show();
                            $(".payBg").fadeIn('fast');
                        });
                        payType.methods.payOk(payType.payInfo)
                    }else{

                        common.createAlertInfo(data.msg);
                    }
                })
            }
        })

        //离开支付页面，清除更新账户状态定时器
        window.onpagehide=function () {
            clearInterval(payType.accountTimer);//情况更新账户状态定时器
        }
    },
    methods:{
        setPayList:function (selector,payList,loginUser,payBonus) {
            selector.empty();
            console.log(loginUser);
            var loginUser=loginUser || null;
            var payBonus=payBonus || 0;
            var payList=JSON.parse(JSON.stringify(payList));

            console.log(payList);
            if(loginUser){
                if(parseInt(loginUser.balancedub)+parseInt(loginUser.couponOneMoney)<parseInt(payBonus)){
                    payList[2].note='账户余额不足';
                }else if(parseInt(loginUser.balancedub)+parseInt(loginUser.couponOneMoney)>=parseInt(payBonus)){
                    payList[2].note='账户余额：'+loginUser.balancedub+' '+'购彩金：'+loginUser.couponOneMoney;
                    payList[2].status='';

                }
            }

            console.log(payList);
            $.each(payList,function (i, obj) {
                if(!obj.isShow){
                    return true;
                }
                var li=$('<li data-type="'+i+'"></li>');
                li.addClass(obj.status);
                var h4=$('<h4></h4>');
                var $i=$('<i></i>');
                var $b=$('<b></b>');

                h4.html(obj.name).appendTo(li);
                $i.html(obj.note).appendTo(li);
                $b.html(obj.img).appendTo(li);

                li.appendTo(selector);
            })
            //默认选择第一个支付方式
            selector.find('li:not(.disabled):eq(0)').addClass('checked');
        },
        payOk:function (payInfo,callback) {
            var rbiz={
                "Active": {
                    "joinTime": "",
                    "name": "",
                    "org": "",
                    "price": "",
                    "reserved1": "",
                    "reserved2": "",
                    "reserved3": "",
                    "status": "",
                    "type": ""
                },
                "Obligate": {
                    "reserved1": "1",
                    "reserved2": "",
                    "reserved3": "",
                    "reserved4": "",
                    "reserved5": "",
                    "reserved6": "",
                    "reserved7": "",
                    "reserved8": "",
                    "reserved9": ""
                },
                "basic": {
                    "activeType": "",
                    "clientId":payInfo.clientId,
                    "orderBonus":methodY.totalQuadrature(payInfo.amount,payInfo.price,payInfo.multiple,payInfo.add_stage),//订单金额
                    "orderNumber": payInfo.orderNumber,//唯一订单号（前端生成）
                    "orderTime": payInfo.orderTime,
                    "orderType": payInfo.orderType,
                    "payBonus": methodY.totalQuadrature(payInfo.amount,payInfo.price,payInfo.multiple,payInfo.add_stage),//支付金额
                    "payType": payInfo.payType,//支付方式（1银行卡支付，2账户余额支付，3支付宝支付，4积分支付5优惠卷支付6微信支付）
                    "userName": payInfo.userInfo.phone,//用户名（手机号）
                },
                "biz": {
                    "IDCard": payInfo.userInfo.peopleNum,//身份证
                    "amount": payInfo.amount,//总注数（不包含倍数、不包含追号的注数）
                    "amount_addstage_no": (payInfo.add_stage )> 1 ? payInfo.add_stage : 0,//总追号期数
                    "isActive": "",//是否参与2元购彩活动用户(否：传入0，是：传入参加活动人的手机号)
                    "isAddStage": (payInfo.add_stage > 1) ? 1 : 0,//是否追号（0否，1是）
                    "isStop": payInfo.isStop,//是否中奖后停止追号（0否，1是）
                    "lotteryNumber": payInfo.lotteryNumber,//投注号码
                    "lotteryType": payInfo.lottType,
                    "multiple":payInfo.multiple,//倍数
                    "orderBonus": methodY.totalQuadrature(payInfo.amount,payInfo.multiple,payInfo.price),//单期总金额（注数*倍数）
                    "reallyName": payInfo.userInfo.userName,//真实姓名
                    "remark": "",
                    "stage": payInfo.stage,//期次
                    "userName": payInfo.userInfo.phone,
                },
                "pay": [
                    {
                        "batchComputing": "",//结算批次号-针对银行卡
                        "cardType": "1",//卡片类型(0芯片卡、1磁道卡)-针对银行卡
                        "merchantID": "",//商户号
                        "operationType": "1",//操作类型(1交易、2冲正、3撤销)
                        "passwordCode": "",//加密后密码-针对银行卡
                        "payBonus": methodY.totalQuadrature(payInfo.amount,payInfo.price,payInfo.multiple,payInfo.add_stage),//支付金额（积分由前端计算抵换多少金额）
                        "payCard": "",//帐号（银行卡号、钱包账号、积分帐号、抵用卷号,扫码号）
                        "payCardTradeNumber": "",//流水号(POS流水、支付宝流水、微信流水)
                        "payChannel": "0",//支付渠道（0线下、1线上）
                        "payType": payInfo.payType,//支付类型(1银行卡支付，2钱包支付，3支付宝支付,4积分支付，5抵用卷支付6微信支付7WAP支付宝8WAP微信9WAP银行卡)
                        "posNumber": "",//POS编号-针对银行卡
                        "responseCode": "200",//返回码（银行返回码、微信返回码、支付宝返回码）
                        "responseMsg": "",//返回信息（同上）
                        "termPayTradeNumber": "",//终端支付交易流水
                        "trackInfo": "",//磁道信息-针对银行卡
                        "tradeDate": "",
                        "tradeTime": ""
                    }
                ]
            }

            if(payInfo.payType=='2'){//账户支付（余额、购彩金）

                console.log(rbiz.pay);
                var curUser=methodY.getInfo('phoneUser') || {};
                console.log(methodY.getInfo('phoneUser'))
                console.log(curUser.couponOneMoney);
                console.log(rbiz.basic.payBonus);
                if(curUser.couponOneMoney>=rbiz.basic.payBonus){
                    rbiz.basic.payType='5';
                    rbiz.pay[0].payType='5';//购彩金支付
                }else if(curUser.couponOneMoney>0){
                    rbiz.basic.payType+=',5';
                    rbiz.pay[0].payBonus=rbiz.pay[0].payBonus-curUser.couponOneMoney;
                    rbiz.pay.push({
                        "batchComputing": "",//结算批次号-针对银行卡
                        "cardType": "1",//卡片类型(0芯片卡、1磁道卡)-针对银行卡
                        "merchantID": "",//商户号
                        "operationType": "1",//操作类型(1交易、2冲正、3撤销)
                        "passwordCode": "",//加密后密码-针对银行卡
                        "payBonus":curUser.couponOneMoney,//支付金额（积分由前端计算抵换多少金额）
                        "payCard": "",//帐号（银行卡号、钱包账号、积分帐号、抵用卷号,扫码号）
                        "payCardTradeNumber": "",//流水号(POS流水、支付宝流水、微信流水)
                        "payChannel": "0",//支付渠道（0线下、1线上）
                        "payType":'5',//支付类型(1银行卡支付，2钱包支付，3支付宝支付,4积分支付，5抵用卷支付6微信支付7WAP支付宝8WAP微信9WAP银行卡)
                        "posNumber": "",//POS编号-针对银行卡
                        "responseCode": "200",//返回码（银行返回码、微信返回码、支付宝返回码）
                        "responseMsg": "",//返回信息（同上）
                        "termPayTradeNumber": "",//终端支付交易流水
                        "trackInfo": "",//磁道信息-针对银行卡
                        "tradeDate": "",
                        "tradeTime": ""
                    })
                }
                ajaxY.betting(rbiz,function (data) {

                    if(data.code=='0000'){

                        common.createAlertInfo('投注成功');
                        //投注成功

                        console.log(payInfo);

                        $('.payBg').fadeOut('fast');
                        $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                        //打票

                        payType.methods.lotteryPrint(payInfo);

                        //清空购物篮
                        sessionStorage.removeItem('lottery_data');
                        //清空存储投注信息
                        sessionStorage.removeItem('lottInfo');
                        //清楚登陆状态
                        common.delLoginStatus();
                        //返回购彩首页
                        //methodY.openPage('index.html');
                    }else{
                        common.createAlertInfo(data.msg);
                        $('.payBg').fadeOut('fast');
                        $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                    }

                })
            }else if(payInfo.payType=='10' || payInfo.payType=='11'){//扫码支付(支付宝扫码、微信扫码)

                rbiz.pay[0].payType=12;
                rbiz.basic.payType=12;
                var tempType=null;
                (payInfo.payType=='10') && (tempType=5);
                (payInfo.payType=='11') && (tempType=2);
                var toData={
                    'command':'wxPayTrade',
                    'bizParams':{
                        orderBonus:methodY.totalQuadrature(payInfo.amount,payInfo.price,payInfo.multiple,payInfo.add_stage),
                        orderNumber:payInfo.orderNumber,
                        rbiz:rbiz,
                        dynamicId:'',
                        payType:tempType,
                        defaultBank:''
                    }

                }

                // var toData={
                //     'command':payType.payList[payInfo.payType].interface,
                //     'bizParams':{
                //         money:methodY.totalQuadrature(payInfo.amount,payInfo.price,payInfo.multiple,payInfo.add_stage),
                //         orderNumber:payInfo.orderNumber,
                //         rbiz:rbiz
                //     }
                //
                // }
                ajaxY.createOrder(toData,function (data) {

                    if(data.code=='0000'){//下单成功
                        callback && callback(data);//创建二维码
                        // //30秒后超时，自动关闭二维码
                        // setTimeout(function () {
                        //     payType.methods.qrcodeBoxClose();
                        // },60*1000);
                        payType.methods.queryOrderStatus(payInfo,rbiz);//跟踪订单状态
                    }else{
                        common.createAlertInfo(data.msg,function () {
                            $('.payBg').fadeOut('fast');
                            $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                        });
                    }
                })

            }else if(payInfo.payType=='19' || payInfo.payType=='20' ||　payInfo.payType=='21'){
                var toData={
                    'command':payType.payList[payInfo.payType].interface,
                    'bizParams':{
                        money:methodY.totalQuadrature(payInfo.amount,payInfo.price,payInfo.multiple,payInfo.add_stage),
                        orderNumber:payInfo.orderNumber,
                        rbiz:rbiz
                    }

                }
                var flag=payInfo.payType=='19' ? true : false;
                console.log(toData);
                ajaxY.createOrder(toData,function (data) {

                    if(data.code=='0000'){//下单成功
                        callback && callback(data);
                        payType.methods.queryOrderStatus(payInfo,rbiz);//跟踪订单状态
                    }else{
                        common.createAlertInfo(data.msg,function () {
                            $('.payBg').fadeOut('fast');
                            $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                        });
                    }
                },true)
            }
        },
        qrcodeBoxClose:function () {
            clearInterval(payType.orderTimer);//清空查询订单状态定时器

            $("#qrcodeCanvas").empty();
            $('.payList').show().siblings('.qrocodeBox').hide();
        },
        queryOrderStatus:function (payInfo,rbiz) {

            ajaxY.queryOrderStatus(payInfo.orderNumber,function (data) {

                if(data.code=='0000'){//支付成功
                    //关闭二维码
                    payType.methods.qrcodeBoxClose();
                    $('#payOk').text('投注中..');

                    $('.payBg').fadeOut('fast');
                    clearTimeout(payType.countTimer);
                    console.log(payInfo);

                    $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                    //打票

                    payType.methods.lotteryPrint(payInfo);

                    sessionStorage.removeItem('lottery_data');
                    //清空存储投注信息
                    sessionStorage.removeItem('lottInfo');
                    methodY.delCookie('loginStatus');

                    common.createAlertInfo('投注成功',function () {
                        var ty=(payType.payInfo.lottType == '3d' ? 'd3': payType.payInfo.lottType);
                        var url=ty+'/lottery-'+ty+'.html';
                        console.log(url);
                        //methodY.openPage(url)
                        //返回购彩首页
                        // methodY.openPage('index.html');
                    });

                    //投注状态
                    // setTimeout(function () {
                    //     payType.methods.queryBettStatus(payInfo);
                    // },3000)

                }else if(data.code=='5000'){//支付中
                    $('#payOk').text('支付中..');
                    payType.orderTimer=setTimeout(function () {//定时查询订单状态
                        payType.methods.queryOrderStatus(payInfo,rbiz);
                    },3000)
                    console.log(data.msg);
                }else{
                    //关闭二维码
                    payType.methods.qrcodeBoxClose();
                    //支付失败
                    common.createAlertInfo('支付失败',function () {
                        $('.payBg').fadeOut('fast');
                        clearTimeout(payType.countTimer);
                        $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                    });
                }
            })
        },
        queryBettStatus:function (payInfo) {

            //投注状态
            ajaxY.quertBettStatus(payInfo.orderNumber,function (bett) {
               // alert(bett.code);
                if(bett.code=='0000'){
                    //投注成功
                   $('.payBg').fadeOut('fast');
                    clearTimeout(payType.countTimer);
                    console.log(payInfo);

                    $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                    //打票

                    payType.methods.lotteryPrint(payInfo);

                    sessionStorage.removeItem('lottery_data');
                    //清空存储投注信息
                    sessionStorage.removeItem('lottInfo');
                    methodY.delCookie('loginStatus');

                    common.createAlertInfo('投注成功',function () {
                        var ty=(payType.payInfo.lottType == '3d' ? 'd3': payType.payInfo.lottType);
                        var url=ty+'/lottery-'+ty+'.html';
                        console.log(url);
                        //methodY.openPage(url)
                        //返回购彩首页
                       // methodY.openPage('index.html');
                    });

                }else if(bett.code=='40003'){
                    $('#payOk').text('投注中..');
                    //common.createAlertInfo('订单投注中')
                    payType.bettTimer=setTimeout(function () {//定时查询订单状态
                        payType.methods.queryBettStatus(payInfo);
                    },3000)
                }else if(bett.code=='40002'){
                    $('.payBg').fadeOut('fast');
                    clearTimeout(payType.countTimer);
                    $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                    common.createAlertInfo('订单投注失败',function () {

                    });
                }else  if(bett.code='40004'){
                    $('.payBg').fadeOut('fast');
                    clearTimeout(payType.countTimer);
                    $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
                    common.createAlertInfo('订单不存在');
                }
            })
        },
        lotteryPrint:function (payInfo) {
            var self=this;
            if(payInfo.lottType=='K3'){
                var payL={

                    '2':'账户余额支付',
                    '3':'支付宝支付',
                    '4':'积分支付',
                    '5':'优惠卷支付',
                    '6':'微信支付',
                    '7':'WAP支付宝',
                    '8':'WAP微信',

                    '10':'支付宝主扫',
                    '11':'微信主扫',

                    '19':'银行卡支付',
                    '20':'支付宝被扫',
                    '21':'微信被扫'
                };
                var noteK3 = {
                    '1': '三不同号单选',
                    '2': '二同号单选',
                    '3': '三同号单选',
                    '5': '和值',
                    '6': '二不同号',
                    '7': '二同号复选',
                    '8': '三同号通选',
                    '9': '三连号通选',
                }
                var lotterN=[];
                $.each(payInfo.lotteryNumber.split(';'),function(i,obj){
                    if(obj){
                        lotterN.push(obj.split('^')[0]+' '+noteK3[obj.split('^')[2]]);
                    }
                })

                var printInfo={
                    lottNumber:payInfo.amount,
                    amount_addstage_no:payInfo.add_stage,
                    lotteryNumber:lotterN.join(';'),
                    insertTime:payInfo.orderTime,
                    isStop:payInfo.isStop,
                    lotteryType:payInfo.lottType,
                    lotteryDate:payInfo.lotteryDate,
                    userName:payInfo.userInfo.phone,
                    stage:payInfo.stage,
                    mulriple:payInfo.multiple,
                    lotteryName:"快三",
                    buyLottType:"代购",
                    orderBonus:parseInt(payInfo.amount) * payInfo.multiple * payInfo.add_stage * 2,
                    FCnumberCode:localStorage.getItem('deviceInfo') ? JSON.parse(localStorage.getItem('deviceInfo')).FCnumberCode : '000000000001',
                    orderTime:methodY.getNowStr('-'),
                    payType:payL[payInfo.payType]+'：'+payInfo.amount*payInfo.multiple*payInfo.add_stage*2+'.00',
                    type:"lott",
                    orderNumber:payInfo.orderNumber
                }

                //彩票打印
                var android=window.android || null;
                if(android){
                    var b=android.printInfo(JSON.stringify(printInfo));

                }else{
                    common.createAlertInfo('android不存在！');
                }
                //真票
                //self.realLotteryPrint(payInfo.orderNumber,payInfo.userInfo.phone,payInfo.stage)
            }else{
                ajaxY.printInfo(payInfo.orderNumber,payInfo.userInfo.phone,function (data) {

                    if(data.code=='0000'){
                        var android=window.android || null;
                        if(android){
                            common.createAlertInfo('出票');
                            var b=android.printInfo(JSON.stringify(data.bizResult));
                        }else{
                            common.createAlertInfo('android不存在！');
                        }
                    }else{
                        common.createAlertInfo(data.code+':'+data.msg);
                    }


                })
                //真票
                //self.realLotteryPrint(payInfo.orderNumber,payInfo.userInfo.phone,payInfo.stage)

            }
        },
        realLotteryPrint:function (orderNumber,phone,stage) {
            //真票打印
            ajaxY.realPrintInfo(orderNumber,phone,stage,function (data) {
                var printInfo=data.bizResult;

                var android=window.android || null;
                if(android){
                    var b=android.printBluetoothInfo(JSON.stringify(data));
                }else{
                    common.createAlertInfo('设备未连接');
                }
            })
        },
        loadCountDown:function () {
            payType.countTimer=setInterval(function () {
                payType.count++;
                $("#loadCountDown").text(payType.count);
            },3000)
        },
    }
}

function closeOrder() {
    payType.countTimer=null;
    clearTimeout(payType.countTimer);
    clearInterval(payType.orderTimer);//清空查询订单状态定时器

    $('.payBg').fadeOut('fast');
    $('#payOk').text('确定').removeClass('disabled').attr('disabled',false);
    window.location.reload();
}