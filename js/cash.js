/**
 * Created by xiaobei on 2017/3/28.
 */
$(function () {
    var h = parseInt($(window).height());

    function autoSize() {
        $(".areaList .listWrap").height(h - 90)
        _z_.absverticalAlign(window, ".cashConfirmLayer");
    }

    autoSize();
    _init_area();
    //表单数据
    var cashDatas = {
        money: null,//提现金额
        channel: null,//提现方式
        bankName: null,//提现银行
        province: null,//开户省
        city: null,//开户市
        cardNo: null,//卡号
        name: null,//姓名
        vcode: null,//验证码
    }

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
        ajax.get(api.acctInfo, null, function (ret) {
            var data = ret.obj;
            if (ret.success) {
                resetAcctInfo(data);
                initHtml();
            } else {
                _z_.topAlert(ret.msg);
            }
        });
    }

    function getBankInfo() {
        ajax.get('api/tran/acct/getBank', null, function (ret) {
            var data = ret.obj;
            if (ret.success) {
                if(data!=null){
                    $('.bankName').html(data.bankName);
                    cashDatas.bankName = data.bankName;
                    $('.provice').html(data.province);
                    cashDatas.province = data.province;
                    $('.city').html(data.city);
                    cashDatas.city = data.city;
                    $('.bankCardNum').val(data.cardNo);
                    $('.ckrNameIpt').val(data.name);
                }
            } else {
                _z_.topAlert(ret.msg);
            }
        });
    }

    getAcctInfo();
    getBankInfo();

    //重新设置账户信息对象
    function resetAcctInfo(data) {
        acctInfo.initialBalance = data.initialBalance;
        acctInfo.balance = data.balance;
        acctInfo.frozenBalance = data.frozenBalance;
        acctInfo.useDeposit = data.useDeposit;
        acctInfo.usableDeposit = data.usableDeposit;
        acctInfo.usableLimit = data.usableLimit;
        acctInfo.wxName = decodeURI(data.wxName);
        acctInfo.hearimgUrl = data.hearimgUrl;
        acctInfo.mobile = data.mobile;
    }

    //初始化界面
    function initHtml() {
        $('#tx').attr("src", acctInfo.hearimgUrl);
        $('#wxName').html(acctInfo.wxName);
        $('#ktxje').html(util.formatMoney(acctInfo.usableLimit));
        $('#mobileFix').html(acctInfo.mobile.substr(0, 3));
        $('#mobileSuf').html(acctInfo.mobile.substr(7, 4));
    }


    //地区选择
    $(".toSelArea").click(function () {
        var proList = "";//省份列表
        var cityList = "";//城市列表
        $("#s_province option").each(function () {
            proList += '<li class="listItem porel feedBtn provListItem" onclick="void(0);">' +
                '<span>' + $(this).attr("value") + '</span>' +
                '<i class="icon iconfont icon-right"></i>' +
                '</li>'
        });
        $(".provList .listWrap").html(proList);
        $(".provList").addClass("active");
    });


    //选择省份
    $(document).on("click", ".provList .listWrap .listItem", function () {
        var citylist = "";
        var pro = $(this).find("span").html();
        if (pro == "省份") return;
        cashDatas.province = pro;
        $("#s_province").val(pro).change();
        $("#s_city option").each(function () {
            citylist += '<li class="listItem porel feedBtn" onclick="void(0);">' +
                '<span>' + $(this).attr("value") + '</span>' +
                '<i class="icon iconfont icon-right"></i>' +
                '</li>'
        });
        $(".cityList .listWrap").html(citylist);
        $(".provList").removeClass("active");
        $(".cityList").addClass("active");
    });
    //选择城市
    $(document).on("click", ".cityList .listWrap .listItem", function () {
        var citylist = "";
        var city = $(this).find("span").html();
        if (city == "地级市") return;
        cashDatas.city = city;
        $(".provList").removeClass("active");
        $(".cityList").removeClass("active");
        console.log(cashDatas);
        $(".areaWrap .provice").html(cashDatas.province);
        $(".areaWrap .city").html(cashDatas.city);
    });
    //选择银行
    $(".toSelBank").click(function () {
        $(".bankList").addClass("active");
    })

    $(this).on("click", ".bankList .listWrap .listItem", function () {
        var pic = $(this).find("img").attr("src");
        var bank = $(this).find("span").html();
        cashDatas.bankName = bank;
        $(".bankWrap .bankImg").attr("src", pic);
        $(".bankWrap .bankName").html(bank);
        $(".bankList").removeClass("active");
    })
    //省份返回上一页
    $(".provList .closeThis").click(function () {
        $(".provList").removeClass("active");
    })
    //城市返回上一页
    $(".cityList .closeThis").click(function () {
        $(".cityList").removeClass("active");
        $(".provList").addClass("active");
    })
    //银行返回上一页
    $(".bankList .closeThis").click(function () {
        $(".bankList").removeClass("active");
    })

    //验证码
    var canGet = true;
    var timer = 120;
    var interval;
    $(".getVerCode").click(function () {
        var $this = $(this);
        if (canGet) {
            canGet = false;
            ajax.get(api.getCashCode, null, function (ret) {
                if (ret.success) {
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

    var subDatas = {};//提交数据
    function getSubDatas() {
        subDatas.money = new Number($.trim($(".txjeIpt").val()));//提现金额
        subDatas.bankName = cashDatas.bankName;//银行名称
        subDatas.name = $.trim($(".ckrNameIpt").val());//持卡人姓名
        subDatas.cardNo = $.trim($(".bankCardNum").val());//银行卡号
        subDatas.province = cashDatas.province;
        subDatas.city = cashDatas.city;
        subDatas.vcode = $.trim($(".verCodeIpt").val());//短信验证码
        subDatas.channel = '2'; //提现方式
    }

    //弹出提交层
    function showCashAlert() {
        var free = $('#free').html();
        $(".cashTable .bankName").html(subDatas.bankName);
        $(".cashTable .bankNum").html(subDatas.cardNo);
        $(".cashTable .txje").html(subDatas.money);
        $(".cashTable .dzje").html(parseInt(subDatas.money) - free);
        $(".cashTable .sxf").html(free + "元");
        $(".alertLayer").show();
        $(".cashConfirmLayer").removeClass("hide");
    }

    function hideCashAlert() {
        $(".alertLayer").hide();
        $(".cashConfirmLayer").addClass("hide");
    }

    $(".cancelCash").click(function () {
        hideCashAlert();
    })
    $(".oklCash").click(function () {
        subCash();
    });

    var flag = 0;
    //提交提现申请
    function subCash() {
        if(flag != 0){
            return;
        }
        flag = 1;
        getSubDatas();
        ajax.post(api.cash, subDatas, function (ret) {
            if (ret.success) {
                _z_.topAlert("提现申请成功!");
                getAcctInfo();
                setTimeout(function(){
                   location.href="./personal.html"
                });
            } else {
                _z_.topAlert(ret.msg);
            }
            hideCashAlert();
            flag = 0;
        });
    };

    $(".txjeIpt").blur(function () {
        var money = $.trim($(".txjeIpt").val());
        if(new Number(money) > 100000){
            money = 100000;
        }
        $('#free').html('2.00');
/*        ajax.get(api.getFree + "?money=" + money, null, function (ret) {
            if (ret.success) {
                $('#free').html(util.formatMoney(ret.obj));
            } else {
                $('#free').html('2.00');
            }
        });*/
    });

    $(".submitBtn").click(function () {
        var bankCardReg = /^(\d{16}|\d{19})$/;//银行卡号正则
        var vCodeReg = /^\d{4}$/;//4位短信验证码
        var moneyRed = /^[1-9]\d*$/;//金额正则
        var nameReg = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$");
        getSubDatas();
        if (!subDatas.money) {
            _z_.topAlert("请输入提现金额");
            return;
        } else if (!moneyRed.test(subDatas.money)) {
            _z_.topAlert("请输入正确金额");
            return;
        } else if (new Number(subDatas.money) > new Number($("#ktxje").html())) {
            _z_.topAlert("金额不能超过可提现额度");
            return;
        } else if (new Number(subDatas.money) < 2) {
            _z_.topAlert("提现金额不能小于2元");
            return;
        } else if (new Number(subDatas.money) > 100000) {
            _z_.topAlert("单笔提现金额不能大于100000元");
            return;
        } else if (!subDatas.bankName) {
            _z_.topAlert("请选择提现银行");
            return
        } else if (!cashDatas.city) {
            _z_.topAlert("请选择开户省市");
            return;
        } else if (!subDatas.cardNo) {
            _z_.topAlert("请填写银行卡号");
            return;
        } else if (!bankCardReg.test(subDatas.cardNo)) {
            _z_.topAlert("请填写有效卡号")
            return;
        } else if (!subDatas.name) {
            _z_.topAlert("请填写持卡人姓名")
            return;
        } else if (!nameReg.test(subDatas.name)) {
            _z_.topAlert("请填写有效姓名")
            return;
        } else if (!subDatas.vcode) {
            _z_.topAlert("请填写验证码")
            return;
        } else if (!vCodeReg.test(subDatas.vcode)) {
            _z_.topAlert("请填写有效验证码")
            return;
        } else {
            showCashAlert();
        }
    })
})