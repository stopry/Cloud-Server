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


    var wxData = {
        appId: null,
        timeStamp: null,//时间戳，自1970年以来的秒数
        nonceStr: null, //随机串
        package: null,
        signType: "MD5",         //微信签名方式：
        paySign: null, //微信签名
    }

    function getAcctInfo() {
        ajax.get(api.acctInfo, null, function (ret) {
            var data = ret.obj;
            if (ret.success) {
                resetAcctInfo(data);
                initHtml();
            } else {
                _z.topAlert(ret.msg);
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
        $('#wxName').html(decodeURI(acctInfo.wxName));
        $('#zc').html(util.formatMoney(acctInfo.useDeposit + acctInfo.usableDeposit));
    }


    var formData = {
        money:5000,//充值金额
        type:2,//充值方式-支付宝
    };

    $('.otherBtn').click(function(){
        $('.otherNum').toggleClass('hide');
        if($('.otherNum').hasClass('hide')){
            $('.otherNum').blur().val('');
            $('.selMoneyWrap .selItem').eq(0).addClass('seled');
        }else{
            $('.otherNum').focus();
            $('.selMoneyWrap .selItem').removeClass('seled');
        }
    });

    //充值金额选择
    $(document).on("click",".selMoneyWrap .selItem",function(){

        $('.otherNum').addClass('hide').blur().val('');

        var val = $(this).data("val");
        formData.money = val;
        $(this).addClass("seled").siblings(".selItem").removeClass("seled");
        console.log(val);
    })
    //充值方式
    $('.payType').on("click",function(){
        $(this).addClass("chceked").siblings(".list").removeClass("chceked");
        var type = $(this).data("type");
        formData.type = type;
    });
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

        if(!$('.otherNum').hasClass('hide')){
            formData.money = $('.otherNum').val();
        }else{
            formData.money = $('.selMoneyWrap .selItem.seled').data("val");
        }

        rechargeDatas.money = formData.money;
        rechargeDatas.type = util.checkEquipment() == 'wx'?"1":"2";
        return rechargeDatas;
    };
    //提交充值
    function subRecharge(){
        var recDatas = getRechargeDatas();

        console.log(recDatas,'充值数据');

        if(!recDatas) return;
        var type = formData.type;
        if(formData.type == '3'){
            $(".ajaxLayer").show();
            ajax.post(api.toWxPay,recDatas,function(ret){
                if(ret.success){
                    var obj = ret.obj;
                    if(util.checkEquipment() == 'wx'){
                        toWxPay(obj)
                    }else{
                        location.href = './pay_scan_code/index.html?qrCode='+obj.qrCode;
                    }
                }else{
                    _z_.topAlert(ret.msg);
                }
            });
        }else if(formData.type == '2'){
            ajax.post(api.toYeePay,recDatas,function(ret){
                if(ret.success){
                    var data = ret.obj;
                    console.log(data.payurl);
                    window.location.href = data.payurl;
                }else{
                    _z_.topAlert(ret.msg);
                }
            });
        }
    }
    function toWxPay(obj){
        wxData.appId = obj.appId;
        wxData.timeStamp = obj.timeStamp + "";
        wxData.nonceStr = obj.nonceStr;
        wxData.package = obj.package;
        wxData.paySign = obj.paySign;
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady(wxData);
        }
    }
    function onBridgeReady(data) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": data.appId,     //公众号名称，由商户传入
                "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": data.nonceStr, //随机串
                "package": data.package,
                "signType": "MD5",         //微信签名方式：
                "paySign": data.paySign//微信签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    location.href = 'personal.html';
                }
            }
        );
    }

    $(".rechageSub .submitBtn").click(function(){
        subRecharge();
    });
})