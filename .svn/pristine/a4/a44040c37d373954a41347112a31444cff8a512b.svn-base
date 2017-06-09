/**
 * Created by Administrator on 2017/3/30 0030.
 */
//接口配置
//var BASEURL = "http://36.7.145.19:9380";
var BASEURL = "";
var api = {
    baseInfo: "api/infos/user/getBaseUserInfo",//用户基本信息
    goods: "api/goods/getGoodsTypelist",//商品接口
    totalInfo: "api/quotation/getTotalInfo",//今开昨收信息
    timeline: "api/quotation/getFS",//得到分时图数据
    kchart: "api/quotation/getkchart",//得到K线图数据
    open: "api/tran/position/open",//建仓
    cash: "api/tran/withdrawByBank",//提现
    toYeePay: "api/tran/pay/toYeePay",//易宝充值
    toWxPay: "api/tran/pay/toWxPay",//微信充值
    updatepwd: "api/tran/security/updatePwd",//修改密码
    fundsrecord: "api/customers/fundsRecord/getlist",//出入金列表
    flow: "api/customers/flow/getlist",//账户流水操盘记录
    positionlist: "api/tran/position/getCurrPositionlist",//当前持仓列表
    acctInfo: "api/tran/acct/get", //用户信息
    login: "api/oauth/token", //登陆
    hispositionlist: "api/tran/position/getHisPositionlist", //获得历史仓位列表
    getRegCode: "api/customers/regist/getvcode",//获取注册验证码
    getCashCode: "api/tran/sms/sendWithdrawsSms",//获取提现验证码
    getFree: "api/withdraws/getCashCharge",//提现手续费
    getRestPwdCode: "/api/customers/password/getvcode",//重置密码验证码
    restpwd: "/api/customers/password/reset",//重置密码
    infoTimer: "/api/tran/infoTimer/getInfoTimer",
    tranList: "/api/tran/getDepositWithdrawList"
}
//正则表达式
var reg = {
    bankCardReg: /^(\d{16}|\d{19})$/,//银行卡号正则
    idCardReg: /^(\d{18})$/,//身份证正则
    vCodeReg: /^\d{4}$/,//4位短信验证码
    moneyRed: /^[1-9]\d?$/,//金额正则
    nameReg: new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$")
}


var _z_ = new _Z();
_z_.verticalAlign(".ajaxLayer", ".loadImgWrap");
function showLoading() {
    $(".ajaxLayer").show();
}

function hideLoading() {
    $(".ajaxLayer").hide();
}
//ajax
var ajax = {
    //purl 是接口url
    //data是传入参数
    //callbacl是成功后的回调函数
    //async是同步异步开发，默认异步可不传，如需同步，则必须传false
    post: function (purl, data, callback, show, async) {
        var async = async == void(0) ? true : false;
        var show = show == null ? true : false;
        if (show) {
            showLoading();
        }
        $.ajax({
            type: 'POST',
            url: purl,
            async: async,
            timeout: 100000,
            data: JSON.stringify(data),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            success: function (result) {
                hideLoading();
                if (result.code == 401) {
                    showTradePwd();
                    return;
                }
                callback && callback(result);
            },
            error: function (info) {
                console.log(info);
                hideLoading();
                //location.href = './login.html';
            },
            complete: function (xhr, status) {
                hideLoading();
            }, beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'bearer ' + oauth.getToken());
            }

        });
    },
    get: function (purl, data, callback, show, async) {
        var async = async == void(0) ? true : false;
        var show = show == null ? true : false;
        if (show) {
            showLoading();
        }
        //data.token = util.getToken();
        //data.token_str = util.getTokenStr(data.token, API_TOKEN);
        $.ajax({
            type: 'GET',
            url: purl,
            data: data,
            dataType: 'json',
            timeout: 100000,
            async: async,
            success: function (result) {
                hideLoading();
                if (result.code == 401) {
                    showTradePwd();
                    return;
                }
                callback && callback(result);
            },
            error: function (info) {
                console.log(info);
                hideLoading();
                //location.href = './login.html';
            },
            complete: function (xhr, status) {
                hideLoading();
            }, beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'bearer ' + oauth.getToken());
            }
        });
    }
}

var oauth = {
    getToken: function () {
        var token = localStorage.getItem('AUTHORIZATION');
        return token;
    },
    setToken: function (token) {
        localStorage.setItem('AUTHORIZATION', token);
    },
    clean: function () {
        localStorage.removeItem('AUTHORIZATION');
    }
}
var util = {
    //格式化金额start
    formatMoney: function (src) {
        var pos = 2;
        var num = parseFloat(src).toFixed(pos);
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    },
    outputdollars: function (number) {
        if (number.length <= 3)
            return (number == '' ? '0' : number);
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    },
    outputcents: function (amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);
    },
    //格式化金额stop
    //格式化时间
    formatTimeForH5: function (now) {
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10 ? new Date(now).getDate() : '0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        //var second = new Date(now).getSeconds();
        return (hour == '0' ? '00' : hour) + ":" + (minute == '0' ? '00' : minute) + "\n" + month + "/" + date
    },
    checkEquipment: function () {
        //平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            xll: false,
            ipad: false
        };
        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
        //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
        if (system.win || system.mac || system.xll || system.ipad) {
            return 'pc';
        } else {

            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return 'wx';
            } else {
                return 'mobile';
            }
        }
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    },
    isLogin: function () {
        var isVer = sessionStorage.getItem('isVer');
        if (isVer == '1') {
            return true;
        } else {
            return false;
        }
    },
    checkMobile: function (mobile) {
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {
            return false;
        } else {
            return true;
        }
    }
}

//页面跳转
function urlTo(url) {
    if (!sessionStorage.getItem("isVer")) {
        showTradePwd();
        return;
    }
    location = url;
}


//交易密码弹出
function showTradePwd() {
    var mobile = localStorage.getItem('USER_MOBILE');
    if (!mobile || mobile == 'null' || '' == mobile || mobile == 'undefined') {
        location = "./login.html";
    } else {
        $(".alertLayer").show();
        $(".pwdOvTmBox").removeClass("hide");
    }
}
//隐藏交易密码
function hideTradePwd() {
    $(".alertLayer").hide();
    $(".pwdOvTmBox").addClass("hide");
}

$(".alertLayer").click(function () {
    hideTradePwd();
});

$(".pwdOvTmBox .subBtn").click(function () {
    var pwd = $(".pwdOvTmBox .inputPwd").val();
    var mobile = localStorage.getItem("USER_MOBILE");
    var data = {
        "captchaCode": " ",
        "captchaValue": " ",
        "clientId": "098f6bcd4621d373cade4e832627b4f6",
        "login_channel": " ",
        "password": pwd,
        "userName": mobile
    };
    ajax.post(api.login, data, function (ret) {
        if (ret.success) {
            sessionStorage.setItem("isVer", "1");//通过验证
            hideTradePwd();
            window.location.reload();
        } else {
            _z_.topAlert(ret.msg);
        }
    });
});


Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}


function dw2() {
    //窗口宽度
    var h = parseInt($(window).width());
    var f_width = parseInt($('.alertLayer').width());
    var f_width2 = parseInt($('.pwdOvTmBox').width());
    var f_width3 = parseInt($('.ajaxLayer').width());
    $('.alertLayer').css('left', (h - f_width) / 2 + 'px');
    $('.pwdOvTmBox').css('left', (h - f_width2) / 2 + 'px');
    $('.ajaxLayer').css('left', (h - f_width3) / 2 + 'px');


}
dw2();