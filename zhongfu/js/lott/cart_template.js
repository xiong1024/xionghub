
var baseCart={};
baseCart.configure={
    clientId:'02103000',//终端号
    recordLength:10,//历史开奖记录显示条数
    cartLength:5,//购物篮最多显示组数,
    multipleMax:50,//最大倍数
    add_stage_max:156,//最大追号期数
}
//购物篮
var cart=cart || {
    curLottObj:null,
    curPlay:null,
    init:function (lottType) {

        //初始化当前彩种对象
        this.curLottObj=lottType;
        //当前玩法
        this.curPlay=methodY.$_GET['play'];

        //是否可以追号
        if(lottType.lottType=='K3'){
            $(".opertionList .markInfo>label:eq(1)").hide();
        }

        //common.getDeviceMessage();


        //初始化绑定事件
        this.bindEvent();
        //初始化购物篮
        var lottery_data=methodY.getInfo('lottery_data');
        if(lottery_data.lotteryNumber){
            this.methods.setCartList(lottery_data.lotteryNumber,$('.contentBox .carList ul'));
        }

        //计算当前购物篮注数、金额
        this.methods.totalAmount();

    },
    bindEvent:function () {

        //购物篮事件
        $('.contentBox .carList ul').click(function (e) {
            var target = (e || window.event).target || (e || window.event).srcElement;
            if (target.nodeName == 'LI' || $(target).parents('li').length > 0) {
                var cur = target.nodeName == 'LI' ? target : $(target).parents('li').get(0);
                var index = $(this).children('li').index($(cur));

                //删除对应存储数据
                // var lottery_data = methodY.getInfo('lottery_data');
                // var tempAttr = [];
                // console.log(index);
                // $.each(lottery_data.lotteryNumber.split(';'), function (i, obj) {
                //     console.log($(cur).children('p').attr('title').split(' ').join(','));
                //     console.log(obj.split('^')[0]);
                //
                //     if (($(cur).children('p').attr('title').split(' ').join(','))!=obj.split('^')[0]) {
                //         tempAttr.push(obj);
                //     }
                // })
                // console.log(tempAttr);
                // lottery_data.lotteryNumber = tempAttr.join(';');
                // methodY.setInfo('lottery_data', JSON.stringify(lottery_data));

                //从购物篮中删除本条数据
                $(cur).remove();

                $(".cartList>ul>li").length==0 && $(".cartList>ul").hide().siblings('p').show();
                //更新存储数据
                var lottery_data = methodY.getInfo('lottery_data');
                var lottAttr=lottery_data.lotteryNumber.split(';').reverse();
                var tempAttr=methodY.attr_delByIndex(lottAttr,index).reverse();

                lottery_data.lotteryNumber = tempAttr.join(';');
                methodY.setInfo('lottery_data',JSON.stringify(lottery_data));

                //统计注数
                cart.methods.totalAmount();

                if (target.className == 'icon-delete') {

                } else {//修改
                    var type = '';
                    $.each(cart.curLottObj.typePick, function (k, v) {
                        if (v == $(cur).children('h1').find('span').first().text()) {
                            type = k;
                        }
                    })

                    var url =cart.curLottObj.lottUrl + '?opertionType=mod&type=' + type + '&lott=' + $(cur).children('p').attr('title').split(' ').join(',');
                   methodY.openPage(url);
                }
            }
        })


        //自选
        $('.opertionList .handPickOne').click(function () {
            methodY.openPage(cart.curLottObj.lottUrl);
        })
        //机选一注
        $('.opertionList .randomPickOne').click(function () {
            var result=cart.methods.cartMax();
            if(result=='0000'){
                var typeP=$(".contentBox>div.carList li:eq(0)").attr('data-type') || cart.curPlay;

                var tempLott=cart.curLottObj.randomOne(typeP);
                console.log(tempLott);
                var lottery_data=methodY.getInfo('lottery_data');
                if(lottery_data.lotteryNumber){
                    // var tempAttr=lottery_data.lotteryNumber.split(';');
                    // var tempAttrR=methodY.rh(tempLott,';').split(';');
                    // lottery_data.lotteryNumber=$.merge(tempAttrR,tempAttr).join(';');
                    lottery_data.lotteryNumber+=';'+methodY.rh(tempLott,';');
                }else{
                    lottery_data.lotteryNumber=methodY.rh(tempLott,';');
                }
                console.log(lottery_data);
                methodY.setInfo('lottery_data',JSON.stringify(lottery_data));

                cart.methods.setCartList(methodY.rh(tempLott,';'),$('.contentBox .carList ul'),true);
                cart.methods.totalAmount();
            }else {
                common.createAlertInfo(result);
            }

        })

        //倍数
        $('.opertionList .markInfo>label:eq(0) input').keyup(function (e) {
            if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}
            this.value= this.value >baseCart.configure.multipleMax ? baseCart.configure.multipleMax :this.value;


            cart.methods.totalAmount();
        })
        $('.opertionList .markInfo>label:eq(0) input').blur(function (e) {

            this.value= this.value ? this.value :1;

            cart.methods.totalAmount();
        })
        //期数
        $('.opertionList .markInfo>label:eq(1) input').keyup(function (e) {
            if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}
            this.value= this.value >baseCart.configure.add_stage_max ? baseCart.configure.add_stage_max :this.value;


            cart.methods.totalAmount();
        })
        $('.opertionList .markInfo>label:eq(1) input').blur(function (e) {

            this.value= this.value ? this.value :1;

            cart.methods.totalAmount();
        })



        //清空
        $('.opertionList .opertions>a:eq(0)').click(function () {
            sessionStorage.removeItem('lottery_data');//清空存储的投注信息
            sessionStorage.removeItem('lottInfo');//清空存储的投注信息
            window.location.reload();
        })

        //确认投注
        $('.opertionList .opertions>a:eq(1)').click(function () {
            var lottery_data=methodY.getInfo('lottery_data');
            if(lottery_data.lotteryNumber=='' || lottery_data.lotteryNumber===undefined){
                common.createAlertInfo('至少选择一组投注号码');
                return false;
            }

            console.log(cart.curLottObj.lottIndex)

            //查询当前期次
            ajaxY.getStageInfo(function (data) {

                if(data.code='0000'){
                    if(data.bizResult[cart.curLottObj.lottIndex].stage){
                        //生成投注信息
                        var lottType=cart.curLottObj.lottType == 'd3' ? '3d' : cart.curLottObj.lottType;
                        var lottInfo={
                            lottType: lottType,//彩种
                            lottNumber:cart.curLottObj.getLottNumber(methodY.getInfo('lottery_data').lotteryNumber),//投注码
                            amount:$('.opertionList .opertions>label>i').text(),//总注数
                            multiple:$('.opertionList .markInfo>label:eq(0)>input').val(),//倍数
                            add_stage:$('.opertionList .markInfo>label:eq(1)>input').val(),//追号
                            isStop:$('.opertionList .isStop>input:checked').val() || 0,//中奖是否停止
                            payBonus:$('.opertionList .opertions>label>b').text(),//支付金额
                            stage:data.bizResult[cart.curLottObj.lottIndex].stage,
                            lotteryDate:data.bizResult[cart.curLottObj.lottIndex].lotteryDate
                        }
                        //存储投注信息
                        methodY.setInfo('lottInfo',JSON.stringify(lottInfo));
                        console.log(lottInfo);
                        //填写中奖通知号码
                        methodY.openPage('lottery-phone.html');
                    }else{
                        common.createAlertInfo('当前期次已截期');
                    }
                }
            });


        })
    },
    methods:{
        //放入购物蓝
        setCartList:function(code,selector,flag) {
            var flag=flag || false;//true : 像前追加，false:像后追加
            var codeAttr=code.split(';');
            $.each(codeAttr,function (i, obj) {
                var info=obj.split('^');
                var li=$('<li data-type="'+info[1]+info[2]+'"></li>');

                var p=$('<p></p>');
                var str='';
                if(info[0].split(',').length>11){
                    for(var i=0;i<9;i++){
                        var temp=info[0].split(',')[i];
                        var tempStr=temp;
                        console.log(temp.indexOf('|'));
                        if(temp.indexOf('|')>0){
                            tempStr=temp.split('|')[0]+'<span>'+'&nbsp;'+temp.split('|')[1]+'</span>';
                        }
                        str+=tempStr+' ';
                    }
                    str+='...';
                }else{
                    var temp=info[0].split(',').join(' ');
                    var tempStr=temp;
                    console.log(temp.indexOf('|'));
                    if(temp.indexOf('|')>0){
                        tempStr=temp.split('|')[0]+'<span>'+'&nbsp;'+temp.split('|')[1]+'</span>';
                    }
                    str=tempStr;
                }
                p.html(str);
                p.attr('title',info[0].split(',').join(' '));
                li.append(p);
                console.log(cart.curLottObj);
                var h1=$('<h1><span>'+cart.curLottObj.typePick[info[1]+info[2]]+'</span><span>'+info[5]+'注'+parseInt(info[5])*2+'元</span></h1>');
                li.append(h1);
                var i=$('<i class="icon-delete"></i>')
                li.append(i);
                li.prependTo(selector)
                //flag ? li.prependTo(selector) : li.appendTo(selector);

            })
        },
        //计算当前投注蓝注数
        totalAmount:function  () {
            var lottery_data=methodY.getInfo('lottery_data');

            var amount=0;
            var multiple=1;
            var add_stage=1;
            lottery_data.lotteryNumber && $.each(lottery_data.lotteryNumber.split(';'),function (i,obj) {
                if(obj){
                    amount+=parseInt(obj.split('^')[5]);
                }
            })

            multiple=$('.opertionList>ul>li.markInfo>label:eq(0) input').val() || 1;
            add_stage=$('.opertionList>ul>li.markInfo>label:eq(1) input').val() || 1;
            $('.opertionList>ul>li.opertions>label>i').text(amount);
            $('.opertionList>ul>li.opertions>label>b').text(amount*2*multiple*add_stage);
            if(amount>0){
                $('.carList ul').show();
            }else{
                $('.carList ul').hide();
            }
        },
        //购物蓝条数限制
        cartMax:function () {
            var str='0000';
            if($('.contentBox .carList ul>li').length>4){

                str='单次投注不能超过五组';
            }
            return str;
        },
    }
}
