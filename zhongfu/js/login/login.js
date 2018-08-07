

var login={
    init:function () {
        this.bindEvent();
    },
    bindEvent:function () {
        $('#loginRegBtn').click(function () {
            var userInfo={phone:$('#loginTel').val(),password:$('#loginPwd').val()}
            //格式验证
            if(login.methods.validForm(userInfo)){
                //登录
                ajaxY.login(userInfo,function (data) {
                    if(data.code=='0000'){
                        //存入登录状态
                        methodY.setCookie('loginStatus',{loginPhone:userInfo.phone});
                        //跳转个人中心
                        methodY.openPage('../personal/index.html');
                    }else{
                        common.createAlertInfo(data.msg);
                    }
                })
            }
        })
        //回车
        $('#loginReg input ').last().keydown(function(e){
            var e= e || (window.event);
            if(e.keyCode==13){
                $('input').blur();
                $('#loginRegBtn').trigger('click');
            }
        });
    },
    methods:{
        validForm:function(userInfo){
            var flag=true;
            if(userInfo.phone=='' || userInfo.password==''){
                common.createAlertInfo("帐号或密码为空");
                $('#loginPwd').focus();
                flag=false;
            }else if(validY.validPhone(userInfo.phone) != '0000'){
                common.createAlertInfo("手机号码有误，请重填");
                $("#loginTel").addClass('error');
                $('#loginTel').focus();
                flag=false;
            }else{
                flag=true;
            }
            return flag;
        }
    }
}