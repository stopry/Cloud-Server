/**
 * Created by xiaobei on 2017/3/28.
 */
$(function () {
    var h = parseInt($(window).height());

    var forgetPwdData = {
        tel:null,
        pwd:null,
        pwdt:null,
        vercode:null,
    }

    function getAcctInfo() {
        var openid = localStorage.getItem("WX_AUTH_OPENID");
        if (openid == null || '' == openid) {
            _z_.topAlert('请联系客服');
            return;
        }
        ajax.get(api.baseInfo, {openid: openid}, function (datas) {
            console.log(datas);
            var data = datas.data;
            if (datas.httpCode == 200) {
                forgetPwdData.tel = data.mobile;
                $('#mobileFix').html(data.mobile.substr(0, 3));
                $('#mobileSuf').html(data.mobile.substr(7, 4));
            } else {
                _z_.topAlert(datas.msg);
            }
        });
    }
    getAcctInfo();

    //提交表单
    function subForm(){
        forgetPwdData.pwd = $.trim($(".newPwd").val());
        forgetPwdData.pwdt = $.trim($(".newPwdCon").val());
        forgetPwdData.vercode = $.trim($(".verCodeIpt").val());
        if(!forgetPwdData.pwd){
            _z_.topAlert("请输入新密码");
            return;
        }else if(forgetPwdData.pwd.length>12||frightdata.pwd<6){
            _z_.topAlert("请输入正确长度密码");
            return;
        }else if(forgetPwdData.pwd!=forgetPwdData.pwdt){
            _z_.topAlert("两次密码不同");
            return;
        }else if(!reg.vCodeReg.test(forgetPwdData.vercode)){
            _z_.topAlert("请输入正确验证码");
            return;
        }else{
            ajax.post(api.restpwd,forgetPwdData,function(datas){
                if(!datas.httpCode==200){
                    _z_.topAlert(datas.msg);
                    return
                }
                _z_.topAlert("密码重置成功");
                sessionStorage.removeItem("isVer");//清除登陆状态;
                location = "./index.html";
            })
        }
    }

    $(".submitChangePwd").click(function(){
        subForm();
    })
    //验证码
    var canGet = true;
    var timer = 120;
    var interval;
    $(".getVerCode").click(function () {
        var $this = $(this);
        if (canGet) {
            canGet = false;
            ajax.post(api.getRestPwdCode, null, function (data) {
                if (data.httpCode == 200) {
                    _z_.topAlert('发送验证码成功');
                    $this.removeClass("active");
                    $this.html(120 + "秒后获取");
                    interval = setInterval(function () {
                        timer--;
                        $this.html(timer + "秒后获取");
                        if (timer <= 0) {
                            $this.addClass("active");
                            clearInterval(interval);
                            $this.html("重新获取");
                            canGet = true;
                            timer = 120;
                        }
                    }, 1000);
                } else {
                    _z_.topAlert('发送验证码失败');
                    canGet = true;
                    return;
                }
            });
        }
    });

})