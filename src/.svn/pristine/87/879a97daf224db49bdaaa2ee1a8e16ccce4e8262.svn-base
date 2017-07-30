/**
 * Created by Administrator on 2017/3/30 0030.
 */
$(function(){

    var acctInfo = {
        initialBalance: 0.00, // 期初余额
        balance: 0.00, //可用余额
        frozenBalance: 0.00,//冻结资金
        useDeposit: 0.00,//已用保证金
        usableDeposit: 0.00,//可用保证金
        usableLimit: 0.00,//可出金额度
        wxName: '', //昵称
        hearimgUrl: '', //头像地址
        mobile: '' //手机号码
    };

    function getAcctInfo() {
        ajax.post(api.acctInfo, null, function (datas) {
            console.log(datas);
            var data = datas.data;
            if (datas.httpCode == 200) {
                resetAcctInfo(data);
                initHtml();
            } else {
                _z.topAlert(datas.msg);
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
        acctInfo.usableLimit = data.usableLimit;
        acctInfo.wxName = data.wxName;
        acctInfo.hearimgUrl = data.hearimgUrl;
        acctInfo.mobile = data.mobile;
    }

    //初始化界面
    function initHtml() {
        $('#tx').attr("src", acctInfo.hearimgUrl);
        $('#wxName').html(acctInfo.wxName);
        $('#zc').html(util.formatMoney(acctInfo.usableLimit));
    }


    var formData = {
        money:5000,//充值金额
        type:2,//充值方式-支付宝
    }
    //充值金额选择
    $(document).on("click",".selMoneyWrap .selItem",function(){
        var val = $(this).data("val");
        formData.money = val;
        $(this).addClass("seled").siblings(".selItem").removeClass("seled");
        console.log(val);
    })
    //充值方式
    $(document).on("click",".per-list.recharge .list",function(){
        $(this).addClass("chceked").siblings(".list").removeClass("chceked");
        var type = $(this).data("type");
        formData.type = type;
        /*if(type==2){
            $(".ylPayInput").removeClass("hide");
        }else{
            $(".ylPayInput").addClass("hide");
        }*/
        console.log(type);
    })
    //银联支付需要的数据
    ylPayDatas = {
        carNum:null,
        name:null,
        idCard:null
    }
    //充值提交数据
    var rechargeDatas= {};
    //得到充值数据
    function getRechargeDatas(){
        rechargeDatas.amount = formData.money;
        rechargeDatas.payType = formData.type;
        rechargeDatas.remark = "null";
/*        if(rechargeDatas.payType==2){//充值方式为银联支付
            ylPayDatas.carNum = $.trim($(".ylPayInput .ctrCardNum").val());//银行卡号
            ylPayDatas.name = $.trim($(".ylPayInput .realName").val());//真实姓名
            ylPayDatas.idCard = $.trim($(".ylPayInput .idCard").val());//身份证
            if(!ylPayDatas.carNum){
                _z_.topAlert("请输入银行卡号");
                return false;
            }else if(!reg.bankCardReg.test(ylPayDatas.carNum)){
                _z_.topAlert("请输入正确银行卡号");
                return false;
            }else if(!ylPayDatas.name){
                _z_.topAlert("请输入真实姓名");
                return false;
            }else if(!reg.nameReg.test(ylPayDatas.name)){
                _z_.topAlert("请输入正确姓名");
                return false;
            }else if(!ylPayDatas.idCard){
                _z_.topAlert("请输入身份证号");
                return false;
            }else if(!reg.idCardReg.test(ylPayDatas.idCard)){
                _z_.topAlert("请输入正确身份证号");
                return false;
            }
            return $.extend(rechargeDatas, ylPayDatas);
            //return true;
        }*/
        return rechargeDatas;
    };
    //提交充值
    function subRecharge(){
        var recDatas = getRechargeDatas();
        if(!recDatas) return;
        console.log(recDatas);
        /*ajax.post(api.recharge,recDatas,function(datas){
            if(datas.httpCode==200){

            }else{
                _z_.topAlert(datas.msg);
            }
        })*/
        _z_.topAlert("待商户申请中……");
    }
    $(".rechageSub .submitBtn").click(function(){
        console.log(4)
        subRecharge();
    })
})