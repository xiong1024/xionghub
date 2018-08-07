
var base={};
base.configure={
    aheadTime:0*60*1000,//期次截期提前时间
    clientId:'02103000',//终端号
    recordLength:10,//历史开奖记录显示条数
    cartLength:5,//购物篮最多显示组数,
    multipleMax:55,//最大倍数
    add_stage_max:156,//最大追号期数
}
base.typePick={
    'ssq':0,
    '3d':1,
    'qlc':2,
    '东方6+1':5,
    '15选5':3,
    'K3':4
};
base.timeStr=['天','时','分','秒'];
var lott={
    curLottObj:null,
    init:function (lottType) {

        // var curW=screen.width;
        // var curF=parseInt($('html').css('fontSize'));
        // console.log(curW);
        // console.log(curF);
        // if(curW<640){
        //     $('html').css('fontSize',(curW/414) * curF)
        // }else{
        //     $('html').css('fontSize','20')
        // }


        //初始化当前彩种对象
        this.curLottObj=lottType;
        //浮层提示
        common.createFloatLayer($('.navBox>div'),'点击这里可以切换玩法哦!')
        //绑定事件
        this.bindEvent();

        //扩展
        console.log(this.curLottObj.extend);
        this.curLottObj.extend && this.curLottObj.extend();

        //加载玩法列表
        $.each(this.curLottObj.playList,function(i,obj){
            var li=$('<li data-type="'+parseInt(i)+'">'+obj.typeName+'</li>');
            li.appendTo($('.navBox .playList'));
        })
        //期次
        this.methods.getCurStage();

        //默认选择玩法

        var type=methodY.$_GET['opertionType']=='mod' && methodY.$_GET['type'] ? methodY.$_GET['type'] : $('.navBox span.title').attr('data-type');
        type=this.curLottObj.getPlayType(type);

        $(".navBox .playList li[data-type='"+type+"']").trigger('click');
        if(methodY.$_GET['opertionType']=='mod'){
            lott.curLottObj.editCode(type,methodY.$_GET['lott']);
        }
        //获取当前投注蓝的条数
        this.methods.getLottNote();
        //设备信息
        common.getDeviceMessage();
    },
    bindEvent:function () {
        //选择玩法
        $('.navBox').click(function(e) {
            var self=this;
            var target=(e || window.event).target || (e || window.event).srcElement;
            if(target.nodeName=='SPAN' || target.nodeName=='I' || target.nodeName=='HEADER'){
                $('.navBox ul.playList').slideToggle('fast',function () {
                    var self=this;
                    if($(self).css('display')=='none'){
                        $('body>.bg').remove();
                    }else{
                        if($('body>.bg').length==0){
                            var bg=$('<div class="bg"></div>');
                            $(bg).appendTo($('body'));
                            $('body>.bg').click(function () {
                                $(this).fadeOut('normal',function () {
                                    $(self).fadeOut('normal');
                                    $(this).remove();
                                })
                            })
                        }
                    }

                });
            }

        });
        //切换玩法
        $('.navBox .playList').click(function (e) {
            var target=(e || window.event).target || (e || window.event).srcElement;
            console.log(target);
            console.log(target.nodeName);
            if(target.nodeName=='LI'){
                $(target).addClass('selected').siblings().removeClass('selected');
                $('.navBox .title').text($(target).text()).attr('data-type',$(target).attr('data-type'));

                var curPlay=$(target).attr('data-type');
                //判断当前玩法是否支持机选
                console.log(lott.curLottObj);
                if(lott.curLottObj.playList['00'+curPlay].isRandom){
                    $('.footerBox .pickOpertion .randomPick').css('visibility','visible')
                }else{
                    $('.footerBox .pickOpertion .randomPick').css('visibility','hidden')
                }
                //切换对应玩法显示
                $('.contentBox>.'+lott.curLottObj.playList['00'+curPlay].note).siblings().hide();
                //清空选中号码
                $('.contentBox>.'+lott.curLottObj.playList['00'+curPlay].note).siblings().find('li.on').removeClass('on');
                $('.contentBox>.'+lott.curLottObj.playList['00'+curPlay].note).fadeIn('slow');

                lott.curLottObj.totalLott();


                //隐藏玩法列表
                $('.navBox .playList').fadeOut('normal',function () {
                    $('body>.bg').remove();
                });
            }
        })
        //选号事件
        $('.contentBox ol').click(function (e) {
            var target=(e || window.event).target || (e || window.event).srcElement;
            var  temp=null;
            if(target.nodeName=='LI'){
                temp=target;
            }else if($(target).parents('li').length>0){
                temp=$(target).parents('li').get(0);
            }
            if(temp){
                lott.curLottObj.pickCode(temp);
                lott.curLottObj.totalLott();
            }
        })
        //历史记录
        $(".noteBox>p>b").click(function () {
            $('.historyRecord').slideToggle();
            lott.methods.getHistoryRecord();
        })
        // 机选
        $('.footerBox .pickOpertion .randomPick').click(function () {
            $(this).children('ul').toggle();
        })
        $(document).click(function (e) {
            var target=(e || window.event).target || (e || window.event).srcElement;
            if($(target).parents('.randomPick').length==0){
                $('.footerBox .pickOpertion .randomPick>ul').hide();
            }
        })
        $('.footerBox .pickOpertion .randomPick>ul').click(function (e) {
            var target=(e || window.event).target || (e || window.event).srcElement;
            console.log(target);
            if(target.nodeName=='LI'){
                //截期
                if($('.noteBox>p>i').attr('data-stage')=='false'){
                    common.createAlertInfo('当前售彩期次已截止');
                    return false;
                }

                var num=$(target).attr('data-num');
                if(parseInt($('.footerBox .pickOpertion .addCar i').text())+parseInt(num)>5){
                    common.createAlertInfo('单次投注不能超过五组');
                    return false;
                }
                for(var i=0;i<num;i++){
                    lott.methods.addCart(lott.curLottObj.randomPick(),true);
                }
                methodY.openPage(lott.curLottObj.lottCartUrl);
            }
        })
        //加入购物篮
        $('.footerBox .pickOpertion .addCar').click(function(){

            //截期
            if($('.noteBox>p>i').attr('data-stage')=='false'){
                common.createAlertInfo('当前售彩期次已截止');
                return false;
            }

            var codeAttr=lott.curLottObj.getLottCode();
            console.log(codeAttr);
            var result=lott.curLottObj.validPick(codeAttr)
            if(result=='0000'){
                lott.methods.addCart(codeAttr);
            }else{
                common.createAlertInfo(result);
            }

        })

        //确认选号
        $('.footerBox .pickOpertion .pickOk').click(function () {
            //截期
            if($('.noteBox>p>i').attr('data-stage')=='false'){
                common.createAlertInfo('当前售彩期次已截止');
                return false;
            }

            var codeAttr=lott.curLottObj.getLottCode();
            console.log(codeAttr);
            var result=lott.curLottObj.validPick(codeAttr)
            if(result=='0000'){

                lott.methods.addCart(codeAttr);
                methodY.openPage(lott.curLottObj.lottCartUrl);
            }else{
                common.createAlertInfo(result);
            }

        })
        $('.navBox .cart').click(function () {
            //截期
            if($('.noteBox>p>i').attr('data-stage')=='false'){
                common.createAlertInfo('当前售彩期次已截止');
                return false;
            }
            methodY.openPage(lott.curLottObj.lottCartUrl);
        })
    },
    methods:{

        //期次
        getCurStage:function () {
            var stageFlag=true;
            var stageTimer=null;
            var lottType=lott.curLottObj.lottType;
            ajaxY.getStageInfo(function (data) {
                if(data.code=='0000'){
                    ajaxY.getServerTime(function (server) {
                        if(server.code=='0000'){
                            var cur=data.bizResult[base.typePick[lottType]];
                            $('.noteBox>p>span').text(cur.stage);//当前期次
                            var endTime=cur.endTime;
                            endTime=typeof(endTime) == 'string' ? endTime : '';
                            var serverTime=server.bizResult[0].serverTime;
                            if(endTime){
                                var resultT=(new Date(endTime.replace(' ','T'))).getTime()-(new Date(serverTime.replace(' ','T'))).getTime()-base.configure.aheadTime;//加‘T’，兼容IOS
                                if(resultT > 0){

                                    stageTimer && clearTimeout(stageTimer);
                                    var timeAttr=methodY.getDayByMS(resultT);
                                    var str='';
                                    $.each(timeAttr,function(k,v){
                                        str+=methodY.p(v)+base.timeStr[k];
                                    })
                                    $('.noteBox>p>i').text(str).attr('data-stage',true);
                                    //开始倒计时
                                    var countDownTimer=null;
                                    countDownTimer=setInterval(function () {
                                        resultT-=1000;
                                        if(resultT > 0){

                                            var timeAttr=methodY.getDayByMS(resultT);
                                            var str='';
                                            $.each(timeAttr,function(k,v){
                                                str+=methodY.p(v)+base.timeStr[k];
                                            })
                                            $('.noteBox>p>i').text(str);

                                        }else{

                                            common.createAlertInfo('当前售彩期次已截止');
                                            $('.noteBox>p>i').text('当前售彩期次已截止').attr('data-stage',false);
                                            clearInterval(countDownTimer);
                                            stageTimer=setTimeout(function () {
                                                lott.methods.getCurStage(lottType);
                                            },30*1000);
                                        }

                                    },1000)
                                }else{
                                    stageTimer=setTimeout(function () {
                                        lott.methods.getCurStage(lottType);
                                    },30*1000);
                                    common.createAlertInfo('当前售彩期次已截止');
                                    $('.noteBox>p>i').text('当前售彩期次已截止').attr('data-stage',false);
                                }

                            }else{
                                stageTimer=setTimeout(function () {
                                    lott.methods.getCurStage(lottType);
                                },30*1000);
                                common.createAlertInfo('当前售彩期次已截止');
                                $('.noteBox>p>i').text('当前售彩期次已截止').attr('data-stage',false);
                            }

                        }
                    })
                }
            })
        },
        //历史开奖记录
        getHistoryRecord:function () {
            ajaxY.getHistoryRecords(lott.curLottObj.lottType,function (data) {
                if(data.code==0000){
                    var arr=data.bizResult;
                    var html=lott.curLottObj.historyRecordFormate(arr);
                    $(".historyRecord ul").html(html);
                }else{
                    common.createAlertInfo(data.msg);
                }
            },function () {
                common.createAlertInfo("服务器异常！");
                return false;
            })
        },
        //获取当前投注篮注数
        getLottNote:function () {
            var lottery_data=methodY.getInfo('lottery_data');
            if(lottery_data.lotteryNumber){
                $('.footerBox .pickOpertion .addCar i').text(lottery_data.lotteryNumber.split(';').length);
            }else{
                $('.footerBox .pickOpertion .addCar i').text(0);
            }
        },
        //加入购物篮
        addCart:function (pickInfo,flag) {
            //投注码^玩法^投注方式^方式^倍数^注数^金额^机选/手选（0/1）

            console.log(pickInfo);

            var temp=lott.curLottObj.lottFormate(pickInfo);
            var tempLott= temp.code;
            var amount=temp.amount;
            console.log(temp);
            tempLott=methodY.rh(tempLott,';');
            if(parseInt($('.footerBox .pickOpertion .addCar i').text())+tempLott.split(';').length>5){
                common.createAlertInfo('单次投注不能超过五组');
                //清空选号
                $('.contentBox li.on').removeClass('on');
                return false;
            }

            //标识机选/首先
            var pick= flag == true ? 0 : 1;
            $.each(tempLott.split(';'),function (i, obj) {
                obj+='^1';
            })

            if(flag){

            }

            var data_okck={
                lotteryType:lott.curLottObj.lottType,
                lotteryNumber:tempLott,
            };
            var leng=$('footer>ul>li.info>a>span').text();
            leng++;
            var leng=$('footer>ul>li.info>a>span').text(leng);
            var lottery_data=methodY.getInfo('lottery_data');
            console.log(lottery_data);
            if($.isEmptyObject(lottery_data)){
                lottery_data=data_okck;
            }else{
                if(lottery_data.lotteryNumber){
                    lottery_data.lotteryNumber+=';'+tempLott;
                }else{
                    console.log(tempLott);
                    lottery_data.lotteryNumber=tempLott;
                }
            }
            console.log(lottery_data);
            $('.contentBox li.on').removeClass();
            methodY.setInfo('lottery_data',JSON.stringify(lottery_data));
            //获取当前投注蓝的条数
            lott.methods.getLottNote();

            //清空当前选号提示信息
            $('.footerBox .noteInfo label:eq(0) i').text(0);
            $('.footerBox .noteInfo label:eq(0) b').text(0);
        }

    }
}