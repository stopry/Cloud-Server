﻿/**
 * Created by Administrator on 2017/3/30 0030.
 */
//接口配置
//var BASEURL = "http://36.7.145.19:9380";
var BASEURL = "";
var api = {
    baseInfo: "api/infos/user/getBaseUserInfo",//用户基本信息
    goods: "api/infos/goods/getGoodsTypelist",//商品接口
    totalInfo: "api/prices/index/getTotalInfo",//今开昨收信息
    timeline: "api/prices/timeline/get",//得到分时图数据
    kchart: "api/prices/kchart/get",//得到K线图数据
    open: "api/trades/position/open",//建仓
    cash: "api/withdraws/bankcard/cash",//提现
    recharge: "api/deposits/userDep",//充值
    updatepwd: "api/customers/password/update",//修改密码
    fundsrecord: "api/customers/fundsRecord/getlist",//出入金列表
    flow: "api/customers/flow/getlist",//账户流水操盘记录
    positionlist: "api/trades/position/getlist",//当前持仓列表
    acctInfo: "api/customers/account/get", //用户信息
    login: "api/customers/account/login", //登陆
    hispositionlist: "api/trades/hisposition/getlist", //获得历史仓位列表
    getRegCode: "api/customers/regist/getvcode",//获取注册验证码
    getCashCode: "api/withdraws/vcode/getvcode",//获取提现验证码
    getFree: "api/withdraws/getCashCharge",//提现手续费
    getRestPwdCode: "/api/customers/password/getvcode",//重置密码验证码
    restpwd: "/api/customers/password/reset",//重置密码
}
//正则表达式
var reg = {
    bankCardReg: /^(\d{16}|\d{19})$/,//银行卡号正则
    idCardReg: /^(\d{18})$/,//身份证正则
    vCodeReg: /^\d{4}$/,//4位短信验证码
    moneyRed: /^[1-9]\d?$/,//金额正则
    nameReg: new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$"),
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
    post: function (purl, data, callback, async) {
        var async = async == void(0) ? true : false;
        showLoading();
        $.ajax({
            type: 'POST',
            url: purl,
            async: async,
            timeout: 10000,
            data: JSON.stringify(data),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            success: function (result) {
                hideLoading();
                if (result.httpCode == 401) {
                    showTradePwd();
                    return;
                }
                callback && callback(result);
            },
            error: function (info) {
                console.log(info);
                hideLoading();
                _z_.topAlert('网络错误!');
            },
            complete: function (xhr, status) {
                hideLoading();
            }

        });
    },
    get: function (purl, data, callback, async) {
        var async = async == void(0) ? true : false;
        showLoading();
        //data.token = util.getToken();
        //data.token_str = util.getTokenStr(data.token, API_TOKEN);
        $.ajax({
            type: 'GET',
            url: purl,
            data: data,
            dataType: 'json',
            timeout: 10000,
            async: async,
            success: function (result) {
                hideLoading();
                if (result.httpCode == 401) {
                    showTradePwd();
                    return;
                }
                callback && callback(result);
            },
            error: function (info) {
                console.log(info);
                hideLoading();
                _z_.topAlert('网络错误!');
            },
            complete: function (xhr, status) {
                hideLoading();
            }
        });
    }
}

var util = {
    //格式化金额start
    formatMoney: function (number) {
        number = number.toString()
        number = number.replace(/\,/g, "");
        if (isNaN(number) || number == "")return "";
        number = Math.round(number * 100) / 100;
        if (number < 0)
            return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
        else
            return this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
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
    //显示用户信息
    //setUserUI:function(info){
    //    var info = JSON.parse(info);
    //
    //}
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
    if (mobile == 'null' || '' == mobile || mobile == 'undefined') {
        location = "./regist.html";
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
        "mobile": mobile,
        "password": pwd
    }
    ajax.post(api.login, data, function (datas) {
        if (datas.httpCode == 200) {
            sessionStorage.setItem("isVer", "1");//通过验证
            hideTradePwd();
            window.location.reload();
        } else {
            _z_.topAlert(datas.msg);
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