
var ssq={
    lottType:'ssq',
    lottUrl:'lottery-ssq.html',
    lottCartUrl:'../lottery-ok.html?type=ssq&play='+$('.navBox span.title').attr('data-type'),
    playList:{
        '0011':{
            typeName:"双色球普通",
            isRandom:true,
            note:'simple',
            alias:[11,12]
        },
        '0015':{
            typeName:"双色球胆拖",
            isRandom:false,
            note:'bileDrag',
            alias:[15]
        }
    },
    //获取当前玩法
    getPlayType:function (code) {
        var type=null;
        $.each(ssq.playList,function (i, obj) {
            if(methodY.in_array(code,obj.alias)){
                type=parseInt(i);
            }
        })

        return type;
    },
    //修改
    editCode:function (type,lott) {
        var blueBall=lott.split('|')[1].split(',');
        if(type=='11'){
            var redBall=lott.split('|')[0].split(',');
            $.each(redBall,function (k, v) {
                $('.simple .redBall li:eq('+(parseInt(v)-1)+')').trigger('click');
            })
            $.each(blueBall,function (k, v) {
                $('.simple .blueBall li:eq('+(parseInt(v)-1)+')').trigger('click');
            })

        }else if(type=='15'){

            var bileBall=lott.split('|')[0].split('$')[0].split(',');
            var dragBall=lott.split('|')[0].split('$')[1].split(',');
            $.each(bileBall,function (k, v) {
                $('.bileDrag .bileBall li:eq('+(parseInt(v)-1)+')').trigger('click');
            })
            $.each(dragBall,function (k, v) {
                $('.bileDrag .dragBall li:eq('+(parseInt(v)-1)+')').trigger('click');
            })
            $.each(blueBall,function (k, v) {
                $('.bileDrag .blueBall li:eq('+(parseInt(v)-1)+')').trigger('click');
            })
        }
        // $.each(blueBall,function (k, v) {
        //     $('.contentBox .blueBall li:eq('+parseInt(v)+')').addClass('on');
        // })
    },
    //历史记录格式
    historyRecordFormate:function (arr) {
        var html="";
        // {lotteryNumber: "01,08,13,22,26,33#05", lotteryType: "ssq", stage: "2015105"}
        $(arr).each(function(index, element) {
            html+='<li>'
                +'<span>'+element.stage+'</span><label>';

            $.each((element.lotteryNumber).split('#')[0].split(','),function (k, v) {
                html+='<span>'+v+'</span>';
            })

            html+='</label></label><label class="blue">'+((element.lotteryNumber)).split("#")[1]+'</label>'
                +'</li>'
        });
        return html;
    },
    //选号
    pickCode:function (curCode) {
        var type=$('.navBox .title').attr('data-type');
        if(type=='11'){
            var red=$('.contentBox .redBall li.on').length;
            if(red > 15 && $(curCode).parents('.redBall').length>0 && !($(curCode).hasClass('on'))){
                common.createAlertInfo('最多选16个红球');
                return false;
            }
        }else if(type=='15'){
            var dm=$('.contentBox .bileDrag .bileBall li.on').length;
            if(dm>4 && $(curCode).parents('.bileBall').length>0 && !($(curCode).hasClass('on'))){
                common.createAlertInfo('最多选5个胆码');
                return false;
            }

            var curIndex=$(curCode).index();

            $(curCode).parent('ol').parent('div').siblings('div:not(.blueBall)').find('li:eq('+curIndex+')').removeClass('on');
        }
        $(curCode).toggleClass('on');
    },
    //获取选择号码
    getLottCode:function () {
        var type=$('.navBox .title').attr('data-type');
        var codeAttr;
        if(type=='11'){
            codeAttr={red:[],blue:[]};
            $('.contentBox .redBall li.on').each(function (i, obj) {
                codeAttr.red.push($(obj).text());
            })
            $('.contentBox .blueBall li.on').each(function (i, obj) {
                codeAttr.blue.push($(obj).text());
            })

        }else if(type=='15'){
            codeAttr={bile:[],drag:[],blue:[]};
            $('.contentBox .bileBall li.on').each(function (i, obj) {
                codeAttr.bile.push($(obj).text());
            })

            $('.contentBox .dragBall li.on').each(function (i, obj) {
                codeAttr.drag.push($(obj).text());
            })

            $('.contentBox .blueBall li.on').each(function (i, obj) {
                codeAttr.blue.push($(obj).text());
            })
        }
        return codeAttr;
    },
    //计算当前注数
    totalLott:function () {
        var type=$('.navBox .title').attr('data-type');
        var amount=0;
        if(type=='11'){
            amount=methodY.totalCount($('.contentBox .redBall li.on').length,6)*$('.contentBox .blueBall li.on').length;
        }else if(type=='15'){
            var dm=$('.contentBox .bileDrag .bileBall li.on').length;
            var tm=$('.contentBox .bileDrag .dragBall li.on').length;
            var blue=$('.contentBox .bileDrag .blueBall li.on').length
            if(dm>0 && dm<6 && tm>1 && (dm+tm)>6 && blue>0){
                amount=methodY.totalCount(tm,(6-dm))*blue;
            }


        }
        $('.footerBox .noteInfo label:eq(0)').show().siblings().hide();
        $('.footerBox .noteInfo label:eq(0) i').text(amount);
        $('.footerBox .noteInfo label:eq(0) b').text(amount*2);

    },
    //随机一注
    randomPick:function () {
        var codeAttr={red:[],blue:[]};
        $.each(methodY.createRandomArrNum(6,33,1),function(k,v){
            codeAttr.red.push(methodY.p(v));
        })
        $.each(methodY.createRandomArrNum(1,16,1),function(k,v){
            codeAttr.blue.push(methodY.p(v));
        })
        console.log(codeAttr);
        return codeAttr;

    },
    //投注格式
    lottFormate:function (pickInfo) {
        console.log(pickInfo);
        var type=$('.navBox .title').attr('data-type');
        var tempLott= '';
        var amount=0;
        if(type=='11'){//普通 pickInfo｛red:[],blue:[]｝;
            var omg=(pickInfo.red.length>6 || pickInfo.blue.length>1) ? 2 : 1;
            amount=methodY.totalCount(pickInfo.red.length,6)*pickInfo.blue.length;
            tempLott+=pickInfo.red.join(',')+'|'+pickInfo.blue.join(',')+'^1^'+omg+'^0^1^'+amount+'^'+(1*amount*2)+';';
        }else if(type=='15'){//胆拖 pickInfo {bile:[],drag:[],blue:[]}


            amount=methodY.totalCount(pickInfo.drag.length,6-pickInfo.bile.length)*pickInfo.blue.length;
            tempLott+=pickInfo.bile.join(',')+'$'+pickInfo.drag.join(',')+'|'+pickInfo.blue.join(',')+'^1^5^0^1^'+amount+'^'+(1*amount*2)+';';
        }

        return {code:tempLott,amount:amount};
    },
    //验证选号
    validPick:function (code) {
        console.log(code);
        var str='';
        var type=$('.navBox .title').attr('data-type');
        if(type=='11' || type=='12'){
            if($.isEmptyObject(code)){
                str='至少选择一注投注号码';
            } else if(code.red.length<6){
                str='至少选择6个红球';
            }else if((!code.blue) || code.blue.length==0){
                str='至少选择1个篮球';
            }else{
                str='0000';
            }
        }else if(type=='15'){
            if($.isEmptyObject(code)) {
                str = '至少选择一注投注号码';
            }else if((!code.bile) || code.bile.length==0){
                str='至少选择1个胆码';
            }else if((!code.bile) || code.bile.length>5){
                str='最多选择5个胆码';
            }else if((!code.drag) || code.drag.length<2){
                str='至少选择2个拖码';
            }else if((code.bile.length+code.drag.length)<7){
                str='胆码拖码加起来不能少于7个';
            }else if((!code.blue) || code.blue.length==0){
                str='至少选择1个篮球';
            }else{
                str='0000';
            }
        }
        return str;
    }
}