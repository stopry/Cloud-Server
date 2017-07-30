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
        if(!mobileReg.test(val)){
            $(".subBtn").removeClass("active");
        }else if(mobileReg.test(val)&&$(".msgCode").val()){
            $(".subBtn").addClass("active");
        }
    })

    $(".getcode").click(function(){
        if($(this).hasClass('active')){
            timer--;
            var data = {"params":{"mobile":$('#mobile').val()}}
            $.ajax({
                url:'/api/customers/regist/getvcode',
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

    $(".msgCode").keyup(function(){
        var val = $.trim($(".mobile").val());
        var ver = $.trim($(".msgCode").val());
        if(mobileReg.test(val)&&ver&&flag==1){
            $(".subBtn").addClass("active")
        }else{
            $(".subBtn").removeClass("active")
        }
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
