
//获取随机数 min=最小值 max=最大值
function random(min,max){return Math.floor(min+Math.random()*(max-min));}

//写入cookies name=名称 value=值 days=有效时间(毫秒)
function setCookie(name,value,days){
    var exp = new Date();
    exp.setTime(exp.getTime()+days);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//查询cookies name=名称
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){return unescape(arr[2]);}else{return null;}
}
//删除cookies name=名称
function delCookie(name){ 
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}
//清空cookie
function clearCookie(){

    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);


    if (keys) {
        for (var i = keys.length; i--;){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=getCookie(name);
            document.cookie=keys[i]+'='+cval+';expires=' + exp.toGMTString()+';path=/';
        }

    }
}
//获取GET参数 可以直接 $_GET['get参数']
var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
//滚动滚动条到指定位置 obj=被滚动对象, val=滚动值
function toScroll(obj,val){
	obj.scrollTop(val);
}
//判断数组中是否包含指定值
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}

//js获取当前日期时间“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate(date) {
    if(date){
        var date = new Date(date*1000); 
    }else{
        var date = new Date();
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return {"date":date.getFullYear() + seperator1 + month + seperator1 + strDate,"tiem":date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds(),"timestamp":Date.parse(date)/1000};
}

var r_kahao = /^(\d{4})\d+(\d{4})$/;//保留前四和后四位
var r_sjhao = /^(\d{3})\d+(\d{4})$/;//保留前三和后四位

//验证手机号码
function testPhoneNum(e){
    if(e==""){
        return "请输入您的手机号";
    }else if(!/^\d{11}$/i.test(e)){
        return "手机号码错误,请重新输入";
    }else if(!(/^1[34578]\d{9}$/.test(e))){
        return "手机号码格式错误，请重新输入";
    }else{
        return "ok";
    }
}
function popInfo(txt,callback){

    var timer =null;

    if($("body>.popInfo").length==0){

        $("body").append('<div class="popInfo"></div>');
    }
    if(txt){
        $("body>.popInfo").text(txt+'...').fadeIn('normal',function(){
            setTimeout(function(){
                $("body>.popInfo").fadeOut('slow',function(){
                    $(this).text('');
                    callback && callback();
                });
            },5000)
        });
    }

}

//验证密码
function testPassword(e){
    if(!/^[A-Za-z0-9]{6,20}$/i.test(e)){
        return "密码错误,请输入6-20位数字或字母的密码";
    }else{
        return "ok";
    }
}
//验证银行卡号
function testBankCard(e){
    if(!/^\d{16}|\d{19}$/.test(e)){
        return "银行卡号输入错误";
    }else{
        return "ok";
    }
}
//验证账单条形码
function testCateCode(e){
    if(e==""){
        return "请输入账单条形码";
    }else if(!/^\d*$/i.test(e)){
        return "输入错误，原因为：账单条形码只允许输入数字，请重新输入。";
    }else{
        return "ok";
    }
}

//验证身份证号
function validIdCard(card) {
    var result='0000';

    var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
        21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
        33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
        42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
        51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
        63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
    };

//检查号码是否符合规范，包括长度，类型
    var isCardNo = function(card) {
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        if(reg.test(card) === false) {
            return false;
        }
        return true;
    };
//取身份证前两位,校验省份
    var checkProvince = function(card) {
        var province = card.substr(0,2);
        if(vcity[province] == undefined) {
            return false;
        }
        return true;
    };
//检查生日是否正确
    var checkBirthday = function(card) {
        var len = card.length;
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        if(len == '15') {
            var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
            var arr_data = card.match(re_fifteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date('19'+year+'/'+month+'/'+day);
            return verifyBirthday('19'+year,month,day,birthday);
        }
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        if(len == '18') {
            var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            var arr_data = card.match(re_eighteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date(year+'/'+month+'/'+day);
            return verifyBirthday(year,month,day,birthday);
        }
        return false;
    };
//校验日期
    var verifyBirthday = function(year,month,day,birthday) {
        var now = new Date();
        var now_year = now.getFullYear();
        //年月日是否合理
        if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
            //判断年份的范围（3岁到100岁之间)
            var time = now_year - year;
            if(time >= 3 && time <= 100) {
                return true;
            }
            return false;
        }
        return false;
    };

//校验位的检测
    var checkParity = function(card) {
        //15位转18位
        card = changeFivteenToEighteen(card);
        var len = card.length;
        if(len == '18') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i, valnum;
            for(i = 0; i < 17; i ++) {
                cardTemp += card.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[cardTemp % 11];
            if (valnum == card.substr(17, 1)) {
                return true;
            }
            return false;
        }
        return false;
    };
//15位转18位身份证号
    var changeFivteenToEighteen = function(card) {
        if(card.length == '15') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i;
            card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
            for(i = 0; i < 17; i ++) {
                cardTemp += card.substr(i, 1) * arrInt[i];
            }
            card += arrCh[cardTemp % 11];
            return card;
        }
        return card;
    };


    //是否为空
    if(card === '') {
        result='请输入身份证号，身份证号不能为空';

    }
    //校验长度，类型
    if(isCardNo(card) === false) {
        result='您输入的身份证号码不正确，请重新输入';


    }
    //检查省份
    if(checkProvince(card) === false) {
        result='您输入的身份证号码不正确,请重新输入';


    }
    //校验生日
    if(checkBirthday(card) === false) {
        result='您输入的身份证号码生日不正确,请重新输入';


    }
    //检验位的检测
    if(checkParity(card) === false) {
        result='您的身份证校验位不正确,请重新输入';

    }
    return result;
}




//弹出层 type=弹出的组件名称 data=组件需要的参数（JSON格式）
function pop(type,data){
    var toHtml="";
    switch(type){
        case "choiceDate":plugIn.choiceDate.open(data);break;//日期选择
    }
}
//关闭弹出层
function offPop(name){
    switch(name){
        case "choiceDate":plugIn.choiceDate.off();break;//日期选择
    }
    $("body>#PopBox").remove();
}

//验证是否支持localStorage
function supports_html5_storage() {
    if('localStorage' in window && window['localStorage'] !== null){
        return true;
    }else{
        return false;
    }
}
//取出存储的信息
function getInfo(k){
    var info={};
    if(supports_html5_storage()) {
        info=localStorage[k] ? JSON.parse(localStorage[k]) : {};
    } else {
        info=getCookie(k) ? JSON.parse(getCookie(k)) : {};
    }
    return info;
}
//存储信息
function setInfo(k,v){
    if(supports_html5_storage()) {

        localStorage[k]=JSON.stringify(v);
    } else {
        setCookie(k,JSON.stringify(v));
    }
}



var getDeviceInfo = function(phone,phoneModel){
    console.log(phone);
    //alert(phone);
    //存储设备信息及用户手机号
    setCookie("_DeviceInfo",'{phone:"'+phone+'",device:'+phoneModel+'}',86400)
};

$(function(){
	
	//$.get("../../../../tool/api.php", { api: "lessphp",less:"Terminal/less/personal.less",css:"Terminal/css/personal.css"});

    var loginStatus=getCookie('loginStatus') ? JSON.parse(getCookie('loginStatus')) : {};

    var tempPhone=loginStatus.loginPhone || '';
    getDeviceInfo(loginStatus.loginPhone,'{system:"Android",type:"poss_lottery","company_name":"shanghai_xincai"}');
    if(window.Obj){
        var b=window.Obj.getPhoneInfo();
    }

    // if(!window.Obj||window.Obj=="undefined"){
    //     console.log(window.Obj);
    //     var loginStatus=getCookie('loginStatus') ? JSON.parse(getCookie('loginStatus')) : {};
    //
    //     getDeviceInfo(loginStatus.loginPhone,'{system:"Android",type:"poss_lottery","company_name":"shanghai_xincai"}');
    // }else if(!getCookie("_DeviceInfo")){
    //
    //     window.Obj.getPhoneMessage();
    //    alert(getCookie("_DeviceInfo"));
    // }
}); 