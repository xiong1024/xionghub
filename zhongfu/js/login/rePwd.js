
var rePwd={
    validCodeTimer:null,//验证码计时器
    timeOut:60,//验证码超时
    init:function () {
        this.bindEvent();
    },
    bindEvent:function () {
        $('.validCodeBtn').click(function () {
            methodY.reClick(this);//重复点击
            if($(this).attr('data-flag')=='true'){
                if(validY.validPhone($('#reTel').val()) != '0000'){
                    common.createAlertInfo("手机号码有误，请重填");
                    return false;
                }else{
                    $(this).css('backgroundColor','#ccc').attr('data-flag',false);
                    $("#codeTimer").text('('+rePwd.timeOut+')');
                    ajaxY.getMessageCode($('#reTel').val(),1,function (data) {
                        if(data.code=='0000'){
                            rePwd.validCodeTimer = setInterval(function(){
                                rePwd.timeOut--;;
                                $("#codeTimer").text('('+rePwd.timeOut+')');
                                if(rePwd.timeOut<=0){
                                    $('.validCodeBtn').css('backgroundColor','#ff9c00').attr('data-flag',true);
                                    $("#codeTimer").empty();
                                    clearInterval(rePwd.validCodeTimer);
                                }
                                return;
                            },1000);
                        }
                    })
                }
            }

        })
        $('#rePwdBtn').click(function () {
            var userInfo={phone:$('#reTel').val(),newPassword:$('#rePwd').val(),code:$('#validCode').val()}
            //格式验证
            if(rePwd.methods.validForm(userInfo)){
                //登录
                ajaxY.rePwd(userInfo,function (data) {
                    if(data.code=='0000'){
                        common.createAlertInfo('密码重置成功!',function () {
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
        $('#rePwdInfo input ').last().keydown(function(e){
            var e= e || (window.event);
            if(e.keyCode==13){
                $('input').blur();
                $('#rePwdBtn').trigger('click');
            }
        });
    },
    methods:{
        validForm:function(userInfo){
            var flag=true;
            if(userInfo.phone=='' || userInfo.newPassword==''){
                common.createAlertInfo("手机号码或密码为空");
                flag=false;
            }else if(validY.validPhone(userInfo.phone) != '0000'){
                common.createAlertInfo("手机号码有误，请重填");
                $("#reTel").addClass('error');
                $('#reTel').focus();
                flag=false;
            }else if(userInfo.newPassword.length!=6){
                common.createAlertInfo('请设置6位密码!')
                $("#rePwd").addClass('error');
                $('#rePwd').focus();
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