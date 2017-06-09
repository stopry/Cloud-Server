/**
 * Created by Administrator on 2017/3/13 0013.
 */

$(function () {
    var openid = util.getQueryString('openid');
    var t = util.getQueryString('t');
    if(openid == null || openid == '' || t == null || t == ''){
        location.href='./index.html'
    }
    var timer = 120;
    var flag = 1;

    $(".msgCode").keyup(function () {
        var ver = $.trim($(".msgCode").val());
        if (ver != '' && ver.length >= 5) {
            $(".subBtn").addClass("active")
        } else {
            $(".subBtn").removeClass("active")
        }
    });

    setInterval(function(){
        if(flag == 0){
            return;
        }
        var ver = $.trim($(".msgCode").val());
        if (ver != '' && ver.length >= 5) {
            $(".subBtn").addClass("active");
        } else {
            $(".subBtn").removeClass("active");
        }
    },300);
    var openid = util.getQueryString("openid");

    //提交表单
    $(".subBtn").click(function () {
        if (!$(this).hasClass("active") || flag == 0) {
            return;
        }
        var tjCode = $.trim($(".msgCode").val());

        var data = {
            tjCode: tjCode,
            openid: openid,
            t:t
        }
        $(".subBtn").removeClass("active");

        $.ajax({
            url: '/api/customers/regist/checkTJCode?tjCode='+data.tjCode+'&openid='+data.openid+'&t='+data.t,
            type: 'GET',
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            timeout: 10000,
            beforeSend: function () {
                $(".msgCode").val('');
                $.DialogByZ.Loading('image/loading.png');
                flag = 0;
            },
            success: function (data) {
                if (data.httpCode == '200') {
                    window.location.href = "./main.html";
                } else {
                    var ver = $.trim($(".msgCode").val());
                    if (ver != '' && ver.length >= 5) {
                        $(".subBtn").addClass("active")
                    } else {
                        $(".subBtn").removeClass("active")
                    }
                    $.DialogByZ.Autofade({Content: data.msg});
                }
                flag = 1;
            },
            complete: function (XMLHttpRequest, textStatus) {
                $.DialogByZ.Close();
                flag = 1;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.DialogByZ.Close();
                flag = 1;
            }
        })
    })
})
