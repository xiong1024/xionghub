
//用户信息
var userPhone={
    curUser:null,
    init:function () {
        this.bindEvent();
        var temp=localStorage.getItem('phoneLott');


        console.log(temp);
        if(!temp){
            $("#getPhone li.phoneHistory").hide();
        }else{
            $(".contentBox  input.validPhone").attr('readOnly',true);
            var telTxt=temp.replace(temp.substring(3,7),'****');
            $(".contentBox  input.validPhone").val(telTxt);
            $("#loginReg .validPhone").eq(1).val(temp);
            $("#getPhone .validPhone").eq(1).val(temp);
            $("#getPhone span.phoneRecord").text(telTxt);
            $("#getPhone li.phoneHistory").show();
        }
    },
    bindEvent:function () {
        //更换手机号
        $('#getPhone a#savePhoneRecord').click(function () {
            $(".contentBox  input.validPhone").attr('readOnly',false);
            $("#getPhone .validPhone").eq(1).val('');
            $("#getPhone  input.validPhone").val('').focus();
        })

        //确认手机号
        $("#getPhone .validPhone").eq(0).blur(function () {
            $("#getPhone .validPhone").eq(1).val($(this).val());
			var rephone = $("#getPhone .validPhone").eq(1).val();
			console.log(rephone);
			var telTxt=rephone.replace(rephone.substring(3,7),'****');
			$("#loginReg .validPhone").eq(1).val(telTxt);
        })
        $("#getPhoneBtn").click(function () {

            var phone=$("#getPhone .validPhone").eq(1).val() || $("#getPhone .validPhone").eq(0).val();
			var rephone = phone.replace(phone.substring(3,7),'****');
			$("#loginTel").val(rephone);
            if(phone==''){
                common.createAlertInfo('手机号码不能为空');
            }else if(validY.validPhone(phone)!='0000'){
                common.createAlertInfo(validY.validPhone(phone));
            }else{

                //需要实名
                // ajaxY.isReg(phone,function (data) {
                //     if(data.code=='0000'){ //注册
                //         ajaxY.isReal(phone,function (data) {
                //             if(data.code=='0000'){  //实名
                //                 ajaxY.getUserInfo(phone,function (data) {//获取当前手机号码用户信息
                //                     if(data.code=='0000'){
                //                         methodY.setInfo('phoneUser',JSON.stringify(data.bizResult));
                //                         if(common.getLoginStatus() && common.getLoginStatus().phone != data.bizResult.phone){
                //                             //如果当前输入的手机号和记录登陆用户不同，则清除原有登陆状态
                //                             common.delLoginStatus();
                //                         }
                //
                //                     }else {
                //                         common.createAlertInfo('获取用户信息异常');
                //                     }
                //                     $('.modalY').show();
                //                     $('#curTel').html($('#getPhone input.validPhone').val());
                //                     //跳转支付
                //                     // methodY.openPage('lottery-payType.html');
                //                 })
                //
                //             }else if(data.code=='9991'){//未实名
                //                 if(common.getLoginStatus()){
                //                     //登录
                //                     if(common.getLoginStatus() && common.getLoginStatus().phone == data.bizResult.phone){
                //                         //如果当前输入的手机号和记录登陆用户不同，则清除原有登陆状态
                //                         common.delLoginStatus();
                //                         $('#realNameInfo').slideDown('normal').siblings().hide();
                //                         $('#realNameTel').val(phone);
                //                     }else{
                //                         $('#loginReg').slideDown('normal').siblings().hide();
                //                     }
                //
                //                 }else{
                //                     //未登录
                //                     $('#loginReg').slideDown('normal').siblings().hide();
                //                 }
                //
                //
                //             }else{
                //                 common.createAlertInfo(data.msg);
                //             }
                //         })
                //     }else if(data.code=='9987'){//未注册
                //         $('#realNameInfo').slideDown('normal').siblings().hide();
                //
                //         $('#realNameTel').val(phone);
                //
                //     }else{
                //         common.createAlertInfo(data.msg);
                //     }
                // })

                localStorage.setItem('phoneLott',phone);
                //不需要实名
                ajaxY.getUserInfo(phone,function (data) {
                    if(data.code=='0000' || data.code=='5498'){//注册或者未注册
                        methodY.setInfo('phoneUser',JSON.stringify(data.bizResult));
                        methodY.setInfo('account',data.code=='5498' ? false : true);
                        $('.modalY').show();
                        $('#curTel').html($('#getPhone input.validPhone').val());
                        //methodY.openPage('lottery-payType.html');
                    }else{
                        common.createAlertInfo('获取用户信息异常')
                    }
                })

            }




        })
        //输入密码登录
        $("#loginRegBtn").click(function () {
            ajaxY.login({phone:$("#getPhone .validPhone").eq(1).val(),password:$('#loginReg #loginPwd').val()},function (data) {
                if(data.code=='0000'){
                    //实名
                    $('#realNameInfo').slideDown('normal').siblings().hide();

                    $('#realNameTel').val($("#getPhone .validPhone").eq(1).val());
                }else{
                    common.createAlertInfo(data.msg);
                }
            })
        })
        //实名认证
        $("#realNameInfoBtn").click(function () {

            if($("#realNameInfo #realName").val()==''){
                common.createAlertInfo('姓名不能为空');
            }else if(validY.validIdCard($("#realNameInfo #realIdCard").val())!='0000'){
                common.createAlertInfo(validY.validIdCard($("#realNameInfo #realIdCard").val()));
            }else{
                var phone=$("#getPhone .validPhone").eq(1).val();
                ajaxY.noReg({phone:phone,name:$("#realNameInfo #realName").val(),peopleNum:$("#realNameInfo #realIdCard").val()},function (data) {
                    if(data.code=='0000'){
                        ajaxY.getUserInfo(phone,function (data) {//获取当前手机号码用户信息
                            localStorage.setItem('testData',JSON.stringify(data));
                            if(data.code=='0000'){
                                methodY.setInfo('phoneUser',JSON.stringify(data.bizResult));
                                if(common.getLoginStatus() && common.getLoginStatus().phone != data.bizResult.phone){
                                    //如果当前输入的手机号和记录登陆用户不同，则清除原有登陆状态
                                    common.delLoginStatus();
                                }
                            }else {
                                common.createAlertInfo('获取用户信息异常');
                            }
                            //跳转支付
                            methodY.openPage('lottery-payType.html');
                        })

                    }else{
                        common.createAlertInfo(data.msg);
                    }
                })
            }
        })
    }
}
