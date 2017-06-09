/**
 * Created by Administrator on 2017/3/13 0013.
 */

$(function(){
    var timer = 120;
    var flag = 1;
    var mobileReg = /^1[3-9][\d]{9}$/;//手机号正则
    $(".mobile").keyup(function(){
        var val = $.trim($(this).val());
        if(mobileReg.test(val) && timer == 120){
            $(".getcode").addClass("active")
        }else{
            $(".getcode").removeClass("active")
        }
        checkCanDo();
    });

    $(".msgCode").keyup(function(){
        checkCanDo();
    });

    $(".pwd").keyup(function(){
        checkCanDo();
    });

    $(".tjCode").keyup(function(){
        checkCanDo();
    });


    function checkCanDo(){
        var mobile = $.trim($('.mobile').val());
        var vCode = $.trim($('.vCode').val());
        var pwd = $.trim($('.pwd').val());
        var tjCode = $.trim($('.tjCode').val());
        if(!mobileReg.test(val) && vCode != null && vCode.length >= 4 && vCode != '' && pwd != null && pwd != '' && pwd.length >=4 && tjCode != '' && tjCode != null && tjCode.length >=6){
            $(".subBtn").addClass("active");
        }else {
            $(".subBtn").removeClass("active");
        }
    }

    $(".getcode").click(function(){
        if($(this).hasClass('active')){
            timer--;
            var data = {"params":{"mobile":$('#mobile').val()}}
            $.ajax({
                url:'/api/sms/sendRegSms',
                type:'POST',
                contentType:"application/json;charset=UTF-8",
                data:JSON.stringify(data),
                dataType: 'json',
                timeout : 10000,
                success:function(data){
                    if(data.httpCode != '200'){
                        $.DialogByZ.Autofade({Content: data.msg});
                        return;
                    }
                    $.DialogByZ.Autofade({Content: "发送成功"});
                }
            });
            $(this).removeClass("active");
            var that = $(this);
            var stval = setInterval(function(){
                that.html(timer+"秒后重新获取");
                timer--;
                if(timer<=0){
                    clearInterval(stval);
                    timer = 120;
                    that.html("重新获取");
                    that.addClass("active");
                }
            },1000)
            return;
        }
        //console.log('输入有误')
    })


    //提交表单
    $(".subBtn").click(function(){
        if(!$(this).hasClass("active")){
            //console.log('输入有误');
            return;
        }
        var val = $.trim($(".mobile").val());
        var vcode = $.trim($(".msgCode").val());
        var data = {
                params:{
                    mobile:val,
                    vcode:vcode
                }
            }
        $(".subBtn").removeClass("active");
        flag = 0;
        $.ajax({
            url:'/api/customers/regist/checkVcode',
            type:'POST',
            contentType:"application/json;charset=UTF-8",
            data:JSON.stringify(data),
            dataType: 'json',
            timeout : 10000,
            beforeSend:function(){
                $.DialogByZ.Loading('image/loading.png')
            },
            success:function(data){
                if(data.httpCode == '200'){
                    localStorage.setItem("tempMobile",val);
                    localStorage.setItem("tempVcode",vcode);
                    window.location.href="./setpwd.html";
                }else{
                    $.DialogByZ.Autofade({Content: data.msg});
                }
            },
            complete:function(XMLHttpRequest,textStatus){
                $.DialogByZ.Close();
                flag = 1;
            },
            error:function(XMLHttpRequest,textStatus,errorThrown){
                $.DialogByZ.Close();
                flag = 1;
            }
        })
    })
})
