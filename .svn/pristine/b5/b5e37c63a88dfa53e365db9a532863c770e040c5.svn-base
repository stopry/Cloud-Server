$(function () {
    var pageNum = 1;
    var isloading = false;

    function getList() {
        if (isloading) return;
        isloading = true;
        ajax.get(api.tranList+"?pageNum="+pageNum, null, function (ret) {
            if (ret.success) {
                if(ret.obj.length<10){
                    $(".pullLoadTips").html("没有更多了");
                }
                var tableHtml = buildTable(ret.obj);
                $(".chain-money").append(tableHtml);
            } else {
                _z_.topAlert(ret.msg);
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
                channelName = '银行自助划转';
            }else if(channel == '6'){
                channelName = '支付宝';
            }
            var fixStr = fix+channelName+(item.tranType == '1'? '充值': '');
            var fixStr2 = item.tranType == '1'? '充': '提';
            var fixclass = item.tranType == '1'? '':'outmoney';
            var tranAmount = new Number(item.amount);
            var charge = new Number(item.charge);
            var sts = item.status;
            var stsStr = '处理中'
            if(sts == '1'){
                stsStr = '成功';
            }else if(sts == '2'){
                stsStr = '失败'+(item.remark == null?'':','+item.remark);
            }
            result += '<ul class="chain-ul">' +
                '<li>' +
                '<div class="fl cz">'+fixStr+'</div>' +
                '<div class="fr ddh">订单号：'+item.id+'</div>' +
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
                '<li>状态:'+stsStr+
                '</li></ul>';
        }

        return result;
    }
})
