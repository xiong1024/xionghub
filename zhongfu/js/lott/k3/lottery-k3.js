


var K3={
    lottType:'K3',
    lottUrl:'lottery-k3.html',
    lottCartUrl:'../lottery-ok.html?type=K3&play='+$('.navBox span.title').attr('data-type'),
    playList:{
        '0015':{
            typeName:"和值",
            isRandom:true,
            note:'sum',
            alias:[15],
        },

        '0012':{
            typeName:"二同号",
            isRandom:true,
            note:'twoSame',
            alias:[12,17],
        },
        '0013':{
            typeName:"三同号",
            isRandom:true,
            note:'threeSame',
            alias:[13,18],
        },

        '0016':{
            typeName:"二不同",
            isRandom:true,
            note:'noTwoSame',
            alias:[16],
        },
        '0011':{
            typeName:"三不同",
            isRandom:true,
            note:'nothreeSame',
            alias:[11,19,111],
        },
    },
    //获取当前玩法
    getPlayType:function (code) {
        var type=null;
        $.each(K3.playList,function (i, obj) {
            if(methodY.in_array(code,obj.alias)){
                type=parseInt(i);
            }
        })

        return type;
    },
    //修改
    editCode:function (type,lott) {

        if(type=='15'){// 和值 {sum:[]}
            $('.contentBox .sum li.on')
            var sum=lott.split(',');
            $.each(sum,function (i, obj) {
                $('.contentBox .sum li>div[data-num="'+obj+'"]').parent().trigger('click');
            })
        }else if(type=='12'){//二同 {singleBall:{same:[],noSame:[]},plural:[]}
            var curType=methodY.$_GET['type'];
            if(curType==12){
                var twoSame=lott.split(',');
                var twoSameTemp={same:[],noSame:[]};
                $.each(twoSame,function (k, v) {
                    if(twoSame.indexOf(v)!=twoSame.lastIndexOf(v)){
                        twoSameTemp.same.push(v)
                    }else{
                        twoSameTemp.noSame.push(v);
                    }
                })
                $('.contentBox .twoSame .singleBall .sameBall li>div[data-num="'+twoSameTemp.same.join('')+'"]').parent().trigger('click');
                $('.contentBox .twoSame .singleBall .noSameBall li>div[data-num="'+twoSameTemp.noSame.join('')+'"]').parent().trigger('click');
            }else if(curType=='17'){//二同复选
                var twoSamePlural=lott.split(',');

                $.each(twoSamePlural,function (i, obj) {
                    $('.contentBox .twoSame .pluralBall li>div[data-num="'+obj+'"]').parent().trigger('click');
                })

            }


        }else if(type=='13'){//三同 {singleBall:[],allBall:[]}
            var curType=methodY.$_GET['type'];
            if(curType==13){
                var threeSame=lott.split(',');

                $('.contentBox .threeSame .singleBall li>div[data-num="'+threeSame.join('')+'"]').parent().trigger('click');
            }else if(curType=='18'){//三同通选
                $('.contentBox .threeSame .allBall li').trigger('click');
            }
        }else if(type=='16'){//二不同 {noTwoSame:[]}
            var twoSame=lott.split(',');
            var twoSameTemp=methodY.re_array(twoSame.join('').split(''));
            $.each(twoSameTemp,function (k, v) {
                $('.contentBox .noTwoSame li>div[data-num="'+v+'"]').parent().trigger('click');
            })

        }else if(type=='11'){//三不同 {singleBall:[],allBall:[]}
            var curType=methodY.$_GET['type'];
            if(curType==19){//三不同通选

                $('.contentBox .nothreeSame .allBall li').trigger('click');

            }else{//三不同单选（单、复）
                var noThreeSame=lott.split(',');
                $.each(noThreeSame,function (k, v) {
                    $('.contentBox .nothreeSame .singleBall li>div[data-num="'+v+'"]').parent().trigger('click');
                })
            }
        }

    },
    //历史记录格式
    historyRecordFormate:function (arr) {
        var html="";
        // {lotteryNumber: "01,08,13,22,26,33#05", lotteryType: "ssq", stage: "2015105"}
        $(arr).each(function(index, element) {
            html+='<li>'
                +'<span>'+element.stage+'</span><label>';

            console.log(element);
            $.each((element.lotteryNumber).split(','),function (k, v) {
                html+='<span>'+v+'</span>';
            })

            html+='</label>'
                +'</li>'
        });
        return html;
    },
    //选号
    pickCode:function (curCode) {
        var type=$('.navBox .title').attr('data-type');
        $(curCode).toggleClass('on');
        if(type==12){//二同单选 同号和不同号不能相同（过滤22 2；33 3的情况） 方法：找到当前选中号（li）的index与已选中号的(li)index匹配
            var curIndex=$(curCode).index();

            $(curCode).parent('ol').siblings('ol').children('li:eq('+curIndex+')').removeClass('on');

        }
    },
    //获取选择号码
    getLottCode:function () {
        var type=$('.navBox .title').attr('data-type');
        var codeAttr=null;
        // var note=K3.playList['00'+type].note;
        //
        // $('.contentBox .'+note+' li.on').each(function (i, obj) {
        //     codeAttr[note].push($(obj).text());
        // })
        if(type=='15'){
            codeAttr={sum:[]};
            $('.contentBox .sumBall li.on').each(function (i, obj) {
                codeAttr.sum.push($(obj).children('div').attr('data-num'));
            })
        }else if(type=='12'){
            codeAttr={singleBall:{same:[],noSame:[]},plural:[]};
            $('.contentBox .twoSame .singleBall .sameBall li.on').each(function (i, obj) {
                codeAttr.singleBall.same.push($(obj).children('div').attr('data-num'));
            })
            $('.contentBox .twoSame .singleBall .noSameBall li.on').each(function (i, obj) {
                codeAttr.singleBall.noSame.push($(obj).children('div').attr('data-num'));
            })
            $('.contentBox .twoSame .pluralBall li.on').each(function (i, obj) {
                codeAttr.plural.push($(obj).children('div').attr('data-num'));
            })

        }else if(type=='13'){
            codeAttr={singleBall:[],allBall:[]};
            $('.contentBox .threeSame .singleBall li.on').each(function (i, obj) {
                codeAttr.singleBall.push($(obj).children('div').attr('data-num'));
            })
            $('.contentBox .threeSame .allBall li.on').each(function (i, obj) {
                codeAttr.allBall.push($(obj).children('div').attr('data-num'));
            })
        }else if(type=='16'){
            codeAttr={noTwoSame:[]};
            $('.contentBox .noTwoSame li.on').each(function (i, obj) {
                codeAttr.noTwoSame.push($(obj).children('div').attr('data-num'));
            })
        }else if(type=='11'){
            codeAttr={singleBall:[],allBall:[]};
            $('.contentBox .nothreeSame .singleBall li.on').each(function (i, obj) {
                codeAttr.singleBall.push($(obj).children('div').attr('data-num'));
            })
            $('.contentBox .nothreeSame .allBall li.on').each(function (i, obj) {
                codeAttr.allBall.push($(obj).children('div').attr('data-num'));
            })
        }

        return codeAttr;
    },
    //计算当前注数
    totalLott:function () {
        var type=$('.navBox .title').attr('data-type');
        var amount=0;

        if(type=='15'){
            amount=$('.contentBox .sum .sumBall li.on').length;
        }else if(type=='12'){
            var singleL= $('.contentBox .twoSame .singleBall .sameBall li.on').length * $('.contentBox .twoSame .singleBall .noSameBall li.on').length;
            var pluralL= $('.contentBox .twoSame .pluralBall li.on').length;
            amount = singleL+pluralL;
        }else if(type=='13'){
            var singleL=  $('.contentBox .threeSame .singleBall li.on').length;
            var pluralL= $('.contentBox .threeSame .allBall li.on').length;
            amount = singleL+pluralL;
        }else if(type=='16'){
            amount=methodY.totalCount($('.contentBox .noTwoSame li.on').length,2);
        }else if(type=='11'){
            var singleL=  methodY.totalCount($('.contentBox .nothreeSame .singleBall li.on').length,3);
            var pluralL= $('.contentBox .nothreeSame .allBall li.on').length;
            amount = singleL+pluralL;
        }


        $('.footerBox .noteInfo label:eq(0)').show().siblings().hide();
        $('.footerBox .noteInfo label:eq(0) i').text(amount);
        $('.footerBox .noteInfo label:eq(0) b').text(amount*2);

    },
    //随机一注
    randomPick:function () {
        var type=$('.navBox .title').attr('data-type');
        var codeAttr=null;
        if(type=='15'){
            codeAttr={sum:[]};
            $.each(methodY.createRandomArrNum(1,13,0),function(k,v){
                codeAttr.sum.push($('.contentBox .sum .sumBall li:eq('+v+')').children('div').attr('data-num'));
            })
        }else if(type=='12'){
            codeAttr={singleBall:{same:[],noSame:[]},plural:[]};

            $.each(methodY.createRandomArrNum(1,5,0),function(k,v){
                codeAttr.singleBall.same.push($('.contentBox .twoSame .singleBall .sameBall li:eq('+v+')').children('div').attr('data-num'));
                $.each(methodY.createRandomArrNum(1,5,0),function(i,obj){
                    obj==v && obj>0 && (obj=obj-1);
                    obj==v && obj==0 && (obj=5);
                    codeAttr.singleBall.noSame.push($('.contentBox .twoSame .singleBall .noSameBall li:eq('+obj+')').children('div').attr('data-num'));
                })
            })

        }else if(type=='13'){
            codeAttr={singleBall:[],allBall:[]};

            $.each(methodY.createRandomArrNum(1,5,0),function(k,v){
                codeAttr.singleBall.push($('.contentBox .threeSame .singleBall li:eq('+v+')').children('div').attr('data-num'));
            })

        }else if(type=='16'){
            codeAttr={noTwoSame:[]};

            $.each(methodY.createRandomArrNum(2,5,0),function(k,v){
                codeAttr.noTwoSame.push($('.contentBox .noTwoSame li:eq('+v+')').children('div').attr('data-num'));
            })
        }else if(type=='11'){
            codeAttr={singleBall:[],allBall:[]};

            $.each(methodY.createRandomArrNum(3,5,0),function(k,v){
                codeAttr.singleBall.push($('.contentBox .nothreeSame .singleBall li:eq('+v+')').children('div').attr('data-num'));
            })
        }



        console.log(codeAttr);
        return codeAttr;

    },
    //投注格式
    lottFormate:function (pickInfo) {
        var type=$('.navBox .title').attr('data-type');

        var tempLott= '';//投注信息
        var amount=0;//注数

        if(type=='15'){// 和值 {sum:[]}
            amount=pickInfo.sum.length;
            tempLott+=pickInfo.sum.join(',')+'^1^5^0^1^'+amount+'^'+(1*amount*2)+';';
        }else if(type=='12'){//二同 {singleBall:{same:[],noSame:[]},plural:[]}
            if(pickInfo.singleBall.same.length>0 && pickInfo.singleBall.noSame.length>0){//二同单式
                $.each(pickInfo.singleBall.same,function (i, obj) {

                    $.each(pickInfo.singleBall.noSame,function (k, v) {
                        var tempAttr=[];
                        $.merge(tempAttr,obj.split(''));
                        tempAttr.push(v);
                        tempAttr.sort();
                        amount++;

                        tempLott+=tempAttr.join(',')+"^1^2^0^1^1^2;";
                    })
                })
            }
            if(pickInfo.plural.length>0){//二同复选
                amount+=pickInfo.plural.length;
                tempLott+=pickInfo.plural.join(',')+"^1^7^0^1^"+pickInfo.plural.length+"^"+pickInfo.plural.length * 2+";";
            }
        }else if(type=='13'){//三同 {singleBall:[],allBall:[]}
            if(pickInfo.singleBall.length>0){//三同单式
                $.each(pickInfo.singleBall,function (i, obj) {
                    amount++;
                    tempLott+=obj.split('').join(',')+"^1^3^0^1^1^2;";
                })
            }
            if(pickInfo.allBall.length>0){//三同通选
                amount++;
                tempLott+=pickInfo.allBall.join(',')+'^1^8^0^1^1^2;'
            }
        }else if(type=='16'){//二不同 {noTwoSame:[]}
            var temp=[];
            for(var i=0;i<pickInfo.noTwoSame.length;i++){
                for(var k=i+1;k<pickInfo.noTwoSame.length;k++){
                    temp.push(pickInfo.noTwoSame[i]+''+pickInfo.noTwoSame[k]);
                }
            }
            amount=temp.length;
            tempLott+=temp.join(',')+"^1^6^0^1^"+amount+"^"+amount * 2+";";
        }else if(type=='11'){//三不同 {singleBall:[],allBall:[]}
            if(pickInfo.singleBall.length>0){
                var omg=pickInfo.singleBall.length>3 ? '11' : '1';
                amount=methodY.totalCount(pickInfo.singleBall.length,3);
                tempLott+=pickInfo.singleBall.join(',')+'^1^'+omg+'^0^1^'+amount+'^'+(1*amount*2)+';';
            }
            if(pickInfo.allBall.length>0){
                amount+=1;
                tempLott+=pickInfo.allBall.join(',')+'^1^9^0^1^1^2;'
            }
        }


        return {code:tempLott,amount:amount};
    },
    //验证选号
    validPick:function (code) {
        console.log(code);
        var str='';
        var type=$('.navBox .title').attr('data-type');

        if(parseInt($('.footerBox .noteInfo>label:eq(0)>i:eq(0)').text())>0){
            str='0000';
        }else{
            str='至少选择一注投注号码';
        }

        return str;
    },
    //k3扩展
    extend:function () {

        $('.contentBox .sum .fastBall>ol').click(function (e) {

            var target=(e || window.event).target || (e || window.event).srcElement;

            if(target.nodeName=='DIV'){

                $('.contentBox .sum .sumBall li.on').removeClass('on');

                var type=$(target).attr('data-type');
                if(type=='lg'){
                    ($(target).parent()).siblings('li').children('div[data-type="gt"]').parent().removeClass('on');
                }
                if(type=='gt'){
                    console.log(($(target).parent()).siblings('li').children('div[data-type="lg"]').parent().get(0));
                    ($(target).parent()).siblings('li').children('div[data-type="lg"]').parent().removeClass('on');
                }
                if(type=='even') {
                    ($(target).parent()).siblings('li').children('div[data-type="odd"]').parent().removeClass('on');
                }
                if(type=='odd'){
                    ($(target).parent()).siblings('li').children('div[data-type="even"]').parent().removeClass('on');
                }

                $('.contentBox .sum .fastBall li.on>div').each(function(i,obj){
                    var temp=$(obj).attr('data-type');

                    var attrNum=$('.contentBox .sum .sumBall li.on').length>0 ? $('.contentBox .sum .sumBall li.on>div') : $('.contentBox .sum .sumBall li>div');
                    attrNum.each(function(k,v){

                        if(temp=='lg'){
                            parseInt($(v).attr('data-num'))>10 && $(v).parent().addClass('on');
                            parseInt($(v).attr('data-num'))<11 && $(v).parent().removeClass('on');
                        }
                        if(temp=='gt'){
                            parseInt($(v).attr('data-num'))>10 && $(v).parent().removeClass('on');
                            parseInt($(v).attr('data-num'))<11 && $(v).parent().addClass('on');
                        }
                        if(temp=='even') {
                            (parseInt($(v).attr('data-num')))%2==0 && $(v).parent().addClass('on');
                            (parseInt($(v).attr('data-num')))%2!=0 && $(v).parent().removeClass('on');
                        }
                        if(temp=='odd'){

                            (parseInt($(v).attr('data-num')))%2==0 && $(v).parent().removeClass('on');
                            (parseInt($(v).attr('data-num')))%2!=0 && $(v).parent().addClass('on');
                        }
                    })
                })

                K3.totalLott();
            }
        })
    }
}
