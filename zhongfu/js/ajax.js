
var configure={
    url:"http://60.174.212.11:10006/front-v4/query.do",//上海正式
    bindUrl:'http://60.174.212.11:10006/front-v4/api.do',
    // url:"http://59.52.25.51:20006/front-v4/query.do",//请求地址
    timeout:1000,//请求超时时间（毫秒
    secretKey:"1hblS7t",//秘钥
};
var ajax={};//方法库


ajax.interactive=function (type,data,success,error,flag) {
    var flag=flag==undefined?true : false;
    var url=flag ? configure.url : configure.bindUrl;
    $.ajax({
        url:url,
        type:type,
        data:JSON.stringify(data),
        dataType:"json",
        success:function(data){
            if(success){

                eval(success+'('+JSON.stringify(data)+')');
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
            eval(error?error:"ajaxError"+'('+JSON.stringify(data)+')');
        }
    });
}
ajax.ajaxData=function(type,data,success,error){
    $.ajax({
        url:configure.url,
        type:type,
        data:JSON.stringify(data),
        dataType:"json",
        success:function(data){
            if(success){
                success(data);
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
            if(error){
                error();
            }else{
                console.log(data);
            }

        }
    });
}
function ajaxError(data){
    console.log(data);
} 


ajax.getMessageCode=function (phone,status,success,error) {
    var toData={
        command:"getMessageCode",
        bizParams:{phone:phone,status:status}
    };
    toData.MD5=hex_md5(configure.secretKey+JSON.stringify(toData.bizParams));
    ajax.interactive("POST",toData,success,error);
}






