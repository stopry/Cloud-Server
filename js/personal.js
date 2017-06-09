/**
 * Created by Administrator on 2017/3/31 0031.
 */
$(function () {
    var acctInfo = {
        initialBalance: 0.00, // 期初余额
        balance: 0.00, //可用余额
        frozenBalance: 0.00,//冻结资金
        useDeposit: 0.00,//已用保证金
        usableDeposit: 0.00,//可用保证金
        usableLimit: 0.00,//可出金额度
        wxName: '', //昵称
        hearimgUrl: '' //头像地址
    };

    function getAcctInfo() {
        ajax.get(api.acctInfo, null, function (ret) {
            var data = ret.obj;
            if (ret.success) {
                resetAcctInfo(data);
                initHtml();
            } else {
                _z_.topAlert(datas.msg);
            }
        });
    }
    getAcctInfo();

    //重新设置账户信息对象
    function resetAcctInfo(data) {
        acctInfo.initialBalance = data.initialBalance;
        acctInfo.balance = data.balance;
        acctInfo.frozenBalance = data.frozenBalance;
        acctInfo.useDeposit = data.useDeposit;
        acctInfo.usableDeposit = data.usableDeposit;
        acctInfo.useableLimit = data.useableLimit;
        acctInfo.wxName = data.wxName;
        acctInfo.hearimgUrl = data.hearimgUrl;
        console.log(acctInfo);
    }

    //初始化界面
    function initHtml() {
        $('#tx').attr("src", acctInfo.hearimgUrl);
        $('#zc').html(util.formatMoney(acctInfo.usableDeposit+acctInfo.useDeposit));
        $('#kybzj').html(util.formatMoney(acctInfo.usableDeposit));
        $('#zybzj').html(util.formatMoney(acctInfo.useDeposit));
    }

});