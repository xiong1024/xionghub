

var lotteryCart={
    ssq:{
        lottType:'ssq',
        orderType:'lott',
        lottIndex:0,
        lottUrl:'ssq/lottery-ssq.html',
        typePick:{
            11:'单式投注',
            12:'复式投注',
            15:'胆拖投注'
        },
        //获取当前玩法
        getPlayType:function (code) {
            var type=code=='12' ? '11' : code;
            return type;
        },
        //机选一注
        randomOne:function (type) {
            var codeAttr={red:[],blue:[]};
            $.each(methodY.createRandomArrNum(6,33,1),function(k,v){
                codeAttr.red.push(methodY.p(v));
            })
            $.each(methodY.createRandomArrNum(1,16,1),function(k,v){
                codeAttr.blue.push(methodY.p(v));
            })
            var amount=methodY.totalCount(codeAttr.red.length,6)*codeAttr.blue.length;
            var tempLott=codeAttr.red.join(',')+'|'+codeAttr.blue.join(',')+'^1^1^0^1^'+amount+'^'+(1*amount*2)+';';
            return tempLott;
        },
        //投注格式
        getLottNumber:function(lotteryNumber){
            var lottStr=[];
            $.each(lotteryNumber.split(';'),function (i, obj) {
                var number=obj.split('^')[0];//号码
                var info=obj.split('^').splice(1);//信息

                info[3]=$('.opertionList .markInfo>label:eq(0) input').val();
                info[5]=parseInt(info[3])*parseInt(info[4])*2;

                var temp=number+'^'+info.join('^');
                lottStr.push(temp);
            })


            return lottStr.join(';');
        }
    },
    qlc:{
        lottType:'qlc',
        orderType:'lott',
        lottIndex:2,
        lottUrl:'qlc/lottery-qlc.html',
        typePick:{
            11:'单式投注',
            12:'复式投注',
            15:'胆拖投注'
        },
        //获取当前玩法
        getPlayType:function (code) {
            var type=code=='12' ? '11' : code;
            return type;
        },
        //机选一注
        randomOne:function (type) {
            var codeAttr={ball:[]};
            $.each(methodY.createRandomArrNum(7,30,1),function(k,v){
                codeAttr.ball.push(methodY.p(v));
            })

            var amount=methodY.totalCount(codeAttr.ball.length,7);
            var tempLott=codeAttr.ball.join(',')+'^1^1^0^1^'+amount+'^'+(1*amount*2)+';';
            return tempLott;
        },
        //投注格式
        getLottNumber:function(lotteryNumber){
            var lottStr=[];
            $.each(lotteryNumber.split(';'),function (i, obj) {
                var number=obj.split('^')[0];//号码
                var info=obj.split('^').splice(1);//信息

                info[3]=$('.opertionList .markInfo>label:eq(0) input').val();
                info[5]=parseInt(info[3])*parseInt(info[4])*2;

                var temp=number+'^'+info.join('^');
                lottStr.push(temp);
            })


            return lottStr.join(';');
        }
    },
    d3:{
        lottType:'3d',
        orderType:'lott',
        lottIndex:1,
        lottUrl:'3d/lottery-3d.html',
        typePick:{
            11:'直选单式',
            12:'直选复式',
            21:'组选',
            83:'组三包号',
            93:'组六包号'
        },
        //获取当前玩法
        getPlayType:function (code) {
            var type=code=='12' ? '11' : code;
            return type;
        },
        //机选一注
        randomOne:function (type) {

            var codeAttr;
            var tempLott='';
            var amount=0;
            if(type=='11' || type=='12'){
                codeAttr={bits:[],ten:[],hundred:[]}
                codeAttr.bits.push(methodY.createRandomArrNum(1,9,1));
                codeAttr.ten.push(methodY.createRandomArrNum(1,9,1));
                codeAttr.hundred.push(methodY.createRandomArrNum(1,9,1));


                amount=codeAttr.hundred.length * codeAttr.ten.length * codeAttr.bits.length ;
                tempLott=codeAttr.hundred.join('')+','+codeAttr.ten.join('')+','+codeAttr.bits.join('')+'^1^1^0^1^'+amount+'^'+(1*amount*2)+';';

            }else if(type=='83'){
                codeAttr={groupThree:[]};
                $.each(methodY.createRandomArrNum(2,9,1),function(k,v){
                    codeAttr.groupThree.push(v);
                })

                var len=codeAttr.groupThree.length;
                amount=len * (len - 1);
                tempLott=codeAttr.groupThree.join(',')+'^8^3^0^1^'+amount+'^'+(1*amount*2)+';';

            }else if (type=='21'){
                codeAttr={groupSix:[]};
                $.each(methodY.createRandomArrNum(3,9,1),function(k,v){
                    codeAttr.groupSix.push(v);
                })
                var len=codeAttr.groupSix.length;
                amount=methodY.totalCount(len,3);
                tempLott=codeAttr.groupSix.join(',')+'^2^1^0^1^1^2;';
            }else if(type=='93'){
                codeAttr={groupSix:[]};
                $.each(methodY.createRandomArrNum(3,9,1),function(k,v){
                    codeAttr.groupSix.push(v);
                })
                var len=codeAttr.groupSix.length;
                amount=methodY.totalCount(len,3);
                tempLott=codeAttr.groupSix.join(',')+'^9^3^0^1^'+amount+'^'+(1*amount*2)+';';
            }

            return tempLott;



        },
        //投注格式
        getLottNumber:function(lotteryNumber){
            var lottStr=[];
            $.each(lotteryNumber.split(';'),function (i, obj) {
                var number=obj.split('^')[0];//号码
                var info=obj.split('^').splice(1);//信息

                info[3]=$('.opertionList .markInfo>label:eq(0) input').val();
                info[5]=parseInt(info[3])*parseInt(info[4])*2;

                var temp=number+'^'+info.join('^');
                lottStr.push(temp);
            })


            return lottStr.join(';');
        }
    },
    K3:{
        lottType:'K3',
        orderType:'K3',
        lottIndex:4,
        lottUrl:'k3/lottery-k3.html',
        typePick:{
            '15':'和值',
            '12':'单式二同',
            '17':'二同号复选',
            '13':'单式三同',
            '18':'三同号通选',
            '16':'二不同',
            '11':'单式三不同',
            '19':'三连号通选',
            '111':'复式三不同'
        },
        //获取当前玩法
        getPlayType:function (code) {
            var type=code;//=='12' ? '11' : code;
            return type;
        },
        //机选一注
        randomOne:function (type) {
            var codeAttr=null;
            var tempLott= '';//投注信息
            var amount=0;//注数

            if(type=='15'){
                var numAttr = [];
                for (var i = 3; i < 19; i++) {
                    numAttr.push(i);
                }
                codeAttr={sum:[]};
                $.each(methodY.createRandomArrNum(1,13,0),function(k,v){
                    codeAttr.sum.push(numAttr[v]);
                })
                amount=1;
                tempLott+=codeAttr.sum.join(',')+'^1^5^0^1^'+amount+'^'+(1*amount*2)+';';
            }else if(type=='12' || type=='17'){
                var numAttrSame = [11, 22, 33, 44, 55, 66];
                var numAttrNoSame = [1, 2, 3, 4, 5, 6];

                codeAttr={singleBall:{same:[],noSame:[]},plural:[]};

                $.each(methodY.createRandomArrNum(1,5,0),function(k,v){
                    codeAttr.singleBall.same.push(numAttrSame[v]);
                    $.each(methodY.createRandomArrNum(1,5,0),function(i,obj){
                        obj==v && obj>0 && (obj=obj-1);
                        obj==v && obj==0 && (obj=5);
                        codeAttr.singleBall.noSame.push(numAttrNoSame[obj]);
                    })
                })



                tempLott+=codeAttr.singleBall.same[0].toString().split('').join(',')+','+codeAttr.singleBall.noSame[0]+"^1^2^0^1^1^2;";
            }else if(type=='13' || type=='18'){

                var numAttr = [111, 222, 333, 444, 555, 666];
                codeAttr={singleBall:[],allBall:[]};

                $.each(methodY.createRandomArrNum(1,5,0),function(k,v){
                    codeAttr.singleBall.push(numAttr[v]);
                })

                tempLott+=codeAttr.singleBall[0].toString().split('').join(',')+"^1^3^0^1^1^2;";
            }else if(type=='16'){
                var numAttr = [1, 2, 3, 4, 5, 6];
                codeAttr={noTwoSame:[]};

                $.each(methodY.createRandomArrNum(2,5,0),function(k,v){
                    codeAttr.noTwoSame.push(numAttr[v]);
                })
                tempLott+=codeAttr.noTwoSame.join(',')+"^1^6^0^1^1^2;";
            }else if(type=='11' || type=='19'){
                var numAttr = [1, 2, 3, 4, 5, 6];
                codeAttr={singleBall:[],allBall:[]};

                $.each(methodY.createRandomArrNum(3,5,0),function(k,v){
                    codeAttr.singleBall.push(numAttr[v]);
                })

                tempLott+=codeAttr.singleBall.join(',')+'^1^1^0^1^1^2;';
            }
            return tempLott;
        },
        //投注格式
        getLottNumber:function(lotteryNumber){
            console.log(lotteryNumber);
            var lottStr=[];
            $.each(lotteryNumber.split(';'),function (i, obj) {
                var number=obj.split('^')[0];//号码
                var tempNumber=[];
                var info=obj.split('^').splice(1);//信息
                console.log(info);
                if(info[1]=='8' || info[1]=='9'){
                    tempNumber.push(0);
                }else{
                    $.each(number.split(','),function (k, v) {
                        if(v){
                            tempNumber.push(methodY.p(v));
                        }
                    })
                }

                info[3]=$('.opertionList .markInfo>label:eq(0) input').val();
                info[5]=parseInt(info[3])*parseInt(info[4])*2;

                var temp=tempNumber.join(',')+'^'+info.join('^');
                lottStr.push(temp);
            })


            return lottStr.join(';');
        }
    },
}