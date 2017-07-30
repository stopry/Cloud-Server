/**
 * Created by xiaobei on 2017/4/1.
 */
$(function () {
    var subDatas = {
        params: {
            pwd: null,
            newPwd: null,
            newPwd2: null
        }
    }

    function getUpdatePwd() {
        subDatas.params.pwd = $.trim($(".oldPwd").val());
        subDatas.params.newPwd = $.trim($(".newPwd").val());
        subDatas.params.newPwd2 = $.trim($(".newPwdCon").val());
        if (!subDatas.params.pwd) {
            _z_.topAlert("请填写原密码");
            return false;
        } else if (!subDatas.params.newPwd) {
            _z_.topAlert("请填写新密码");
            return false;
        } else if (!subDatas.params.newPwd2) {
            _z_.topAlert("请填写新密码");
            return false;
        } else if (subDatas.params.newPwd != subDatas.params.newPwd2) {
            _z_.topAlert("两次密码不一致");
            return false;
        }
        return true;
    }

    $(".submitChangePwd").click(function () {
        if (getUpdatePwd()) {
            ajax.post(api.updatepwd, subDatas, function (datas) {
                if (datas.httpCode == 200) {
                    _z_.topAlert('修改成功');
                    $(".oldPwd").val('');
                    $(".newPwd").val('');
                    $(".newPwdCon").val('');
                    sessionStorage.removeItem("isVer");//清除登陆状态;
                    location = "./index.html";
                } else {
                    _z_.topAlert(datas.msg);
                }
            });
        }
    })
})