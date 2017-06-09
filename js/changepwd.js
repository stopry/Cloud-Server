/**
 * Created by xiaobei on 2017/4/1.
 */
$(function () {
    var subDatas = {
        oldpwd: null,
        newpwd: null,
        newpwd2: null

    }

    function getUpdatePwd() {
        subDatas.oldpwd = $.trim($(".oldPwd").val());
        subDatas.newpwd = $.trim($(".newPwd").val());
        subDatas.newpwd2 = $.trim($(".newPwdCon").val());
        if (!subDatas.oldpwd) {
            _z_.topAlert("请填写原密码");
            return false;
        } else if (!subDatas.oldpwd) {
            _z_.topAlert("请填写新密码");
            return false;
        } else if (!subDatas.newpwd2) {
            _z_.topAlert("请填写新密码");
            return false;
        } else if (subDatas.newpwd != subDatas.newpwd2) {
            _z_.topAlert("两次密码不一致");
            return false;
        }
        return true;
    }

    $(".submitChangePwd").click(function () {
        if (getUpdatePwd()) {
            ajax.post(api.updatepwd, subDatas, function (ret) {
                if (ret.success) {
                    _z_.topAlert('修改成功');
                    $(".oldPwd").val('');
                    $(".newPwd").val('');
                    $(".newPwdCon").val('');
                    sessionStorage.removeItem("isVer");//清除登陆状态;
                    _z_.topAlert('修改密码成功,请重新登陆');
                    setTimeout(function(){
                        location = "./login.html";
                    },3000);
                } else {
                    _z_.topAlert(ret.msg);
                }
            });
        }
    })
})