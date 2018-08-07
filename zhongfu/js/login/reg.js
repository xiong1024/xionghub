

var reg={
    validCodeTimer:null,//验证码计时器
    timeOut:60,//验证码超时
    init:function () {
        this.bindEvent();
    },
    bindEvent:function () {
        $('.validCodeBtn').click(function () {
            methodY.reClick(this);//重复点击
            if($(this).attr('data-flag')=='true'){
                if(validY.validPhone($('#regTel').val()) != '0000'){
                    common.createAlertInfo("手机号码有误，请重填");
                    return false;
                }else{
                    $(this).css('backgroundColor','#ccc').attr('data-flag',false);
                    $("#codeTimer").text('('+reg.timeOut+')');
                    ajaxY.getMessageCode($('#regTel').val(),1,function (data) {
                        if(data.code=='0000'){
                            reg.validCodeTimer = setInterval(function(){
                                reg.timeOut--;;
                                $("#codeTimer").text('('+reg.timeOut+')');
                                if(reg.timeOut<=0){
                                    $('.validCodeBtn').css('backgroundColor','#ff9c00').attr('data-flag',true);
                                    $("#codeTimer").empty();
                                    clearInterval(reg.validCodeTimer);
                                }
                                return;
                            },1000);
                        }
                    })
                }
            }

        })
        $('#regUserBtn').click(function () {
            var userInfo={phone:$('#regTel').val(),password:$('#regPwd').val(),refPhone:'',code:$('#validCode').val()}
            //格式验证
            if(reg.methods.validForm(userInfo)){
                //登录
                ajaxY.reg(userInfo,function (data) {
                    if(data.code=='0000'){
                        common.createAlertInfo('注册成功',function () {
                            //跳转登录
                            methodY.openPage('login.html');
                        });

                    }else{
                        common.createAlertInfo(data.msg);
                    }
                })
            }
        })
        //回车
        $('#regUser input ').last().keydown(function(e){
            var e= e || (window.event);
            if(e.keyCode==13){
                $('input').blur();
                $('#regUserBtn').trigger('click');
            }
        });
    },
    methods:{
        validForm:function(userInfo){
            var flag=true;
            if(userInfo.phone=='' || userInfo.password==''){
                common.createAlertInfo("手机号码或密码为空");
                flag=false;
            }else if(validY.validPhone(userInfo.phone) != '0000'){
                common.createAlertInfo("手机号码有误，请重填");
                $("#regTel").addClass('error');
                $('#regTel').focus();
                flag=false;
            }else if(userInfo.password.length!=6){
                common.createAlertInfo('请设置6位密码!')
                $("#regPwd").addClass('error');
                $('#regPwd').focus();
                flag=false;
            }else if(userInfo.code==''){
                common.createAlertInfo('请输入验证码!')
                $("#validCode").addClass('error');
                $('#validCode').focus();
                flag=false;
            }else{
                flag=true;
            }
            return flag;
        }
    }
}
