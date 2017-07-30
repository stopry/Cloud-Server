﻿$(function () {
    var pageNum = 1;
    var isloading = false;

    function getList() {
        if (isloading) return;
        isloading = true;
        ajax.get(api.fundsrecord+"?pageNum="+pageNum, null, function (datas) {
            console.log(datas)
            if (datas.httpCode == 200) {
                if(datas.data.length<10){
                    $(".pullLoadTips").html("没有更多了");
                }
                var tableHtml = buildTable(datas.data);
                $(".chain-money").append(tableHtml);
            } else {
                _z_.topAlert(datas.msg);
                $(".pullLoadTips").html("没有更多了");
            }
            isloading = false;
            pageNum++
        })
    };
    $(window).on("scroll", function () {
        var h = parseInt($(window).height());
        var top = $(window).scrollTop();
        if ($(document).height() == h + top) {
            getList()
        }
    })
    getList();

    function buildTable(data) {
        var result = '';
        for(var i=0;i<data.length;i++){
            var item = data[i];
            var fix =  item.tranType == '1'? '【充值】': '【提现】';
            var channel = item.tranChannel;
            var channelName = '';
            if(channel == '1'){
                channelName = '微信';
            }else if(channel == '2'){
                channelName = '银联';
            }else if(channel == '3'){
                channelName = '银企直联';
            }else if(channel == '4'){
                channelName = '线下-现金支付';
            }else if(channel == '5'){
                channelName = '线下-银行转账';
            }else if(channel == '6'){
                channelName = '支付宝';
            }
            var fixStr = fix+channelName+(item.tranType == '1'? '充值': '提现');
            var fixStr2 = item.tranType == '1'? '充': '提';
            var fixclass = item.tranType == '1'? '':'outmoney';
            var tranAmount = new Number(item.tranAmount);
            var charge = new Number(item.charge);
            result += '<ul class="chain-ul">' +
                '<li>' +
                '<div class="fl cz">'+fixStr+'</div>' +
                '<div class="fr ddh">订单号：'+item.tranNo+'</div>' +
                '</li>' +
                '<li>' +
                '<div class="block fl">' +
                '<span class="block-span bor_rau3 fl mk1 '+fixclass+'">'+fixStr2+'</span>' +
                '<span>'+tranAmount.toFixed(2)+'</span>' +
                '</div>' +
                '<div class="block fl">' +
                '<span class="block-span bor_rau3 fl mk2">费</span>' +
                '<span>'+charge.toFixed(2)+'</span>' +
                '</div>' +
                '<div class="fr time">'+new Date(item.tranTime).format('yyyy-MM-dd hh:mm:ss')+'</div>' +
                '</li>' +
                '</ul>';
        }

        return result;
    }
})