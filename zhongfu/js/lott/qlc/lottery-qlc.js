

var qlc={
    lottType:'qlc',
    lottUrl:'lottery-qlc.html',
    lottCartUrl:'../lottery-ok.html?type=qlc&play='+$('.navBox span.title').attr('data-type'),
    playList:{
        '0011':{
            typeName:"七乐彩普通",
            isRandom:true,
            note:'simple',
            alias:[11,12]
        }
        // '0015':{
        //     typeName:"七乐彩胆拖",
        //     isRandom:false,
        //     note:'bileDrag',
        //     alias:[15]
        // }
    },
    //获取当前玩法
    getPlayType:function (code) {
        var type=null;
        $.each(qlc.playList,function (i, obj) {
            if(methodY.in_array(code,obj.alias)){
                type=parseInt(i);
            }
        })

        return type;
    },
    //修改
    editCode:function (type,lott) {

        if(type=='11'){
            var ball=lott.split('|')[0].split(',');
            $.each(ball,function (k, v) {
                $('.simple .ball li:eq('+(parseInt(v)-1)+')').trigger('click');
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
            var ball=$('.contentBox .ball li.on').length;
            if(ball > 14 && $(curCode).parents('.ball').length>0 && !($(curCode).hasClass('on'))){
                common.createAlertInfo('最多选15个号码');
                return false;
            }
        }else if(type=='15'){
            var dm=$('.contentBox .bileDrag .bileBall li.on').length;
            console.log($(curCode).hasClass('on'));
            if(dm>5 && $(curCode).parents('.bileBall').length>0 && !($(curCode).hasClass('on'))){
                common.createAlertInfo('最多选6个胆码');
                return false;
            }
            if(!$(curCode).hasClass('on')){//胆拖码不能相同
                $(curCode).parent().parent().siblings().find('li').eq(parseInt($(curCode).text())-1).removeClass('on');
            }
        }
        $(curCode).toggleClass('on');

    },
    //获取选择号码
    getLottCode:function () {
        var type=$('.navBox .title').attr('data-type');
        var codeAttr;
        if(type=='11'){
            codeAttr={ball:[]};
            $('.contentBox .ball li.on').each(function (i, obj) {
                codeAttr.ball.push($(obj).text());
            })


        }else if(type=='15'){
            codeAttr={bile:[],drag:[]};
            $('.contentBox .bileBall li.on').each(function (i, obj) {
                codeAttr.bile.push($(obj).text());
            })

            $('.contentBox .dragBall li.on').each(function (i, obj) {
                codeAttr.drag.push($(obj).text());
            })


        }
        return codeAttr;
    },
    //计算当前注数
    totalLott:function () {
        var type=$('.navBox .title').attr('data-type');
        var amount=0;
        if(type=='11'){
            amount=methodY.totalCount($('.contentBox .ball li.on').length,7);
        }else if(type=='15'){
            var dm=$('.contentBox .bileDrag .bileBall li.on').length;
            var tm=$('.contentBox .bileDrag .dragBall li.on').length;

            if(dm>0 && dm<7 && tm>1 && (dm+tm)>7){
                amount=methodY.totalCount(tm,(7-dm));
            }


        }
        $('.footerBox .noteInfo label:eq(0)').show().siblings().hide();
        $('.footerBox .noteInfo label:eq(0) i').text(amount);
        $('.footerBox .noteInfo label:eq(0) b').text(amount*2);

    },
    //随机一注
    randomPick:function () {
        var codeAttr={ball:[]};
        $.each(methodY.createRandomArrNum(7,30,1),function(k,v){
            codeAttr.ball.push(methodY.p(v));
        })

        console.log(codeAttr);
        return codeAttr;

    },
    //投注格式
    lottFormate:function (pickInfo) {
        var type=$('.navBox .title').attr('data-type');
        var tempLott= '';
        var amount=0;
        if(type=='11' || type=='12'){//普通 pickInfo｛red:[],blue:[]｝;
            var omg=(pickInfo.ball.length>7) ? 2 : 1;
            amount=methodY.totalCount(pickInfo.ball.length,7);
            tempLott+=pickInfo.ball.join(',')+'^1^'+omg+'^0^1^'+amount+'^'+(1*amount*2)+';';

        }else if(type=='15'){//胆拖 pickInfo {bile:[],drag:[],blue:[]}


            amount=methodY.totalCount(pickInfo.drag.length,6-pickInfo.bile.length);
            tempLott+=pickInfo.bile.join(',')+'$'+pickInfo.drag.join(',')+'^1^5^0^1^'+amount+'^'+(1*amount*2)+';';
        }

        return {code:tempLott,amount:amount};
    },
    //验证选号
    validPick:function (code) {
        console.log(code);
        var str='';
        var type=$('.navBox .title').attr('data-type');
        if(type=='11'){
            if($.isEmptyObject(code)){
                str='至少选择一注投注号码';
            } else if(code.ball.length<7){
                str='至少选择7个号码';
            }else if(code.ball.length>16){
                str='最多选择15个号码';
            }else{
                str='0000';
            }
        }else if(type=='15'){
            if($.isEmptyObject(code)) {
                str = '至少选择一注投注号码';
            }else if((!code.bile) || code.bile.length==0){
                str='至少选择1个胆码';
            }else if((!code.bile) || code.bile.length>6){
                str='最多选择6个胆码';
            }else if((!code.drag) || code.drag.length<2){
                str='至少选择2个拖码';
            }else if((code.bile.length+code.drag.length)<7){
                str='胆码拖码加起来不能少于7个';
            }else{
                str='0000';
            }
        }
        return str;
    }
}