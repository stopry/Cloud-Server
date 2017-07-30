/**
 * Created by Administrator on 2017/3/13 0013.
 */
$(function(){
    var flag = 1;
    $(".msgCode").keyup(function(){
        var ver = $.trim($(".msgCode").val());
        if(ver && ver.length >= 6 && flag == 1){
            $(".subBtn").addClass("active")
        }else{
            $(".subBtn").removeClass("active")
        }
    });
    var mobileReg = /^1[3-9][\d]{9}$/;//手机号正则
    var openidInit = localStorage.getItem('WX_AUTH_OPENID');
    var mobileInit = localStorage.getItem('tempMobile');
    var vcodeInit = localStorage.getItem('tempVcode');
    if(!mobileReg.test(mobileInit) || vcodeInit == null){
        window.location.href="regist.html";
    }

    //提交表单
    $(".subBtn").click(function(){
        if(!$(this).hasClass("active")){
            return;
        }
        var openid = localStorage.getItem('WX_AUTH_OPENID');
        var mobile = localStorage.getItem('tempMobile');
        var vcode = localStorage.getItem('tempVcode');
        var pwd = $.trim($(".msgCode").val());

        if(!mobileReg.test(mobile)){
            $.DialogByZ.Autofade({Content: "手机号码错误"});
            return;
        }
        if(vcode == ''){
            $.DialogByZ.Autofade({Content: "验证码错误"});
            return;
        }
        if(pwd == '' ||pwd.length <6){
            $.DialogByZ.Autofade({Content: "交易码应为不少于6位"});
            return;
        }
        if(openid == ''){
            $.DialogByZ.Autofade({Content: "请从公众号入口进入"});
            return;
        }
        var data = {
                params:{
                    mobile:mobile,
                    vcode:vcode,
                    password:pwd,
                    openId:openid
                }
            }
        $(".subBtn").removeClass("active");
        flag = 0;
        $.ajax({
            url:'/api/customers/regist/add',
            type:'POST',
            contentType:"application/json;charset=UTF-8",
            data:JSON.stringify(data),
            dataType: 'json',
            timeout : 10000,
            beforeSend:function(){
                $.DialogByZ.Loading('image/loading.png')
            },
            success:function(data){
                $.DialogByZ.Close();
                localStorage.removeItem('tempMobile');
                localStorage.removeItem('tempVcode');
                if(data.httpCode == '200'){
                    window.location.href="/index.html";
                }else{
                    $.DialogByZ.Autofade({Content: "设置交易密码失败"});
                }

            },
            complete:function(XMLHttpRequest,textStatus){
                $.DialogByZ.Close();
            },
            error:function(XMLHttpRequest,textStatus,errorThrown){
                $.DialogByZ.Close();
            }
        })
    })
})
