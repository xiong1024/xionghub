
var d3={
    lottType:'3d',
    lottUrl:'lottery-3d.html',
    lottCartUrl:'../lottery-ok.html?type=d3&play='+$('.navBox span.title').attr('data-type'),
    playList:{
        '0011':{
            typeName:"3D-直选",
            isRandom:true,
            note:'direct',
            alias:[11,12],
        },
        '0083':{
            typeName:"3D-组三",
            isRandom:true,
            note:'groupThree',
            alias:[83]
        },
        '0093':{
            typeName:"3D-组六",
            isRandom:true,
            note:'groupSix',
            alias:[93,21]
        }
    },
    //获取当前玩法
    getPlayType:function (code) {
        var type=null;
        $.each(d3.playList,function (i, obj) {
            if(methodY.in_array(code,obj.alias)){
                type=parseInt(i);
            }
        })


        return type;
    },
    //修改
    editCode:function (type,lott) {
        var lottAttr=lott.split(',');
        if(type=='11'){

            $.each(lottAttr,function (k, v) {
                var code=v.split('');

                $.each(code,function (i, obj) {

                    $(".contentBox>div.direct>div:eq("+k+") li:eq("+obj+")").trigger('click');
                })
            })

        }else if(type=='83'){
            $.each(lottAttr,function (k, v) {
                $('.contentBox .groupThree li:eq('+v+')').trigger('click');
            })
        }else if(type=='93'){
            $.each(lottAttr,function (k, v) {
                $('.contentBox .groupSix li:eq('+v+')').trigger('click');
            })
        }

    },
    //历史记录格式
    historyRecordFormate:function (arr) {
        var html="";
        //{lotteryNumber: "8,2,7", lotteryType: "3d", stage: "2017200"}
        $(arr).each(function(index, element) {
            html+='<li>'
                +'<span>'+element.stage+'</span><label>';

            $.each((element.lotteryNumber).split('#')[0].split(','),function (k, v) {
                html+='<span>'+v+'</span>';
            })

            html+='</label></label>'
                +'</li>'
        });
        return html;
    },
    //选号
    pickCode:function (curCode) {
        var type=$('.navBox .title').attr('data-type');

        $(curCode).toggleClass('on');
    },
    //获取选择号码
    getLottCode:function () {
        var type=$('.navBox .title').attr('data-type');
        var codeAttr;
        if(type=='11'){
            codeAttr={hundred :[],ten:[],bits:[]};
            $('.contentBox .hundred li.on').each(function (i, obj) {
                codeAttr.hundred.push($(obj).text());
            })
            $('.contentBox .ten li.on').each(function (i, obj) {
                codeAttr.ten.push($(obj).text());
            })
            $('.contentBox .bits li.on').each(function (i, obj) {
                codeAttr.bits.push($(obj).text());
            })

        }else if(type=='83'){
            codeAttr={groupThree:[]};
            $('.contentBox .groupThree li.on').each(function (i, obj) {
                codeAttr.groupThree.push($(obj).text());
            })
        }else if(type=='93'){
            codeAttr={groupSix:[]};
            $('.contentBox .groupSix li.on').each(function (i, obj) {
                codeAttr.groupSix.push($(obj).text());
            })
        }
        return codeAttr;
    },
    //计算当前注数
    totalLott:function () {
        var type=$('.navBox .title').attr('data-type');
        var amount=0;
        if(type=='11' || type=='12'){
            var hundred=$('.contentBox .hundred  li.on').length;
            var ten=$('.contentBox .ten  li.on').length;
            var bits=$('.contentBox .bits  li.on').length
            amount=hundred * ten * bits;
        }else if(type=='83'){
            var len=$('.contentBox>.groupThree li.on').length;
            if(len>1){
                amount=len * (len - 1);
            }
        }else if(type=='93'){
            var len=$('.contentBox>.groupSix li.on').length;
            if(len>2){
                amount=methodY.totalCount(len,3);
            }
        }
        $('.footerBox .noteInfo label:eq(0)').show().siblings().hide();
        $('.footerBox .noteInfo label:eq(0) i').text(amount);
        $('.footerBox .noteInfo label:eq(0) b').text(amount*2);

    },
    //随机一注
    randomPick:function () {
        var codeAttr;
        var type=$('.navBox .title').attr('data-type');
        if(type=='11'){
            codeAttr={bits:[],ten:[],hundred:[]}
            codeAttr.bits.push(methodY.createRandomArrNum(1,9,1));
            codeAttr.ten.push(methodY.createRandomArrNum(1,9,1));
            codeAttr.hundred.push(methodY.createRandomArrNum(1,9,1));

        }else if(type=='83'){
            codeAttr={groupThree:[]};
            $.each(methodY.createRandomArrNum(2,9,1),function(k,v){
                codeAttr.groupThree.push(v);
            })


        }else if(type=='93'){
            codeAttr={groupSix:[]};
            $.each(methodY.createRandomArrNum(3,9,1),function(k,v){
                codeAttr.groupSix.push(v);
            })

        }
        console.log(codeAttr);
        return codeAttr;

    },
    //投注格式
    lottFormate:function (pickInfo) {
        var type=$('.navBox .title').attr('data-type');
        var tempLott= '';
        var amount=0;
        if(type=='11' || type=='12'){//普通 pickInfo｛red:[],blue:[]｝;
            var hundred=pickInfo.hundred.length;
            var ten=pickInfo.ten.length;
            var bits=pickInfo.bits.length;
            var omg=(hundred * ten * bits) > 1 ? 2 : 1;
            amount=hundred * ten * bits ;
            tempLott+=pickInfo.hundred.join('')+','+pickInfo.ten.join('')+','+pickInfo.bits.join('')+'^1^'+omg+'^0^1^'+amount+'^'+(1*amount*2)+';';
        }else if(type=='83'){

            var len=pickInfo.groupThree.length;
            amount=len * (len - 1);
            tempLott+=pickInfo.groupThree.join(',')+'^8^3^0^1^'+amount+'^'+(1*amount*2)+';';
        }else if(type=='93'){

            var len=pickInfo.groupSix.length;
            amount=methodY.totalCount(len,3);
            if(amount>1){
                tempLott+=pickInfo.groupSix.join(',')+'^9^3^0^1^'+amount+'^'+(1*amount*2)+';';
            }else if(amount==1){
                tempLott+=pickInfo.groupSix.join(',')+'^2^1^0^1^'+amount+'^'+(1*amount*2)+';';
            }
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
            } else if(code.hundred.length<1){
                str='至少选择1个百位号码';
            }else if(code.ten.length<1){
                str='至少选择1个十位号码';
            }else if(code.bits.length<1){
                str='至少选择1个个位号码';
            }else{
                str='0000';
            }
        }else if(type=='83'){

            if($.isEmptyObject(code)) {
                str = '至少选择一注投注号码';
            }else if(code.groupThree.length<2){
                str='至少选择2个号码';
            }else{
                str='0000';
            }
        }else if(type=='93'){
            if($.isEmptyObject(code)) {
                str = '至少选择一注投注号码';
            }else if(code.groupSix.length<3){
                str='至少选择3个号码';
            }else{
                str='0000';
            }
        }
        return str;
    }
}