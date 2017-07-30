$(function () {
    var pageNum = 1;
    var isloading = false;

    function getList() {
        if (isloading) return;
        isloading = true;
        ajax.get(api.hispositionlist + '?pageNum=' + pageNum, null, function (datas) {
            console.log(datas)
            if (datas.httpCode == 200) {
                var data = datas.data;
                if(data.length<10){
                    $(".pullLoadTips").html("没有更多了")
                }
                var tableHtml = buildTable(data);
                $(".record").append(tableHtml);
            } else {
                _z_.topAlert(datas.msg);
                $(".pullLoadTips").html("没有更多了")
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
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var status = item.status == '0' ? '【持仓中】' : '【已平仓】';
            var name = item.name;
            var buySell = item.buySell == '1' ? '看涨' : '看跌';
            var count = item.amount;
            var openPrice = new Number(item.openPrice).toFixed(0);
            var openTime = new Date(item.openTime).format('yyyy-MM-dd hh:mm:ss');
            var closePrice = new Number(item.closePrice).toFixed(0);
            var closeTime = new Date(item.closeTime).format('yyyy-MM-dd hh:mm:ss');
            var charge = (new Number(item.openCharge) + new Number(item.closeCharge)).toFixed(2);
            var useDeposit = new Number(item.useDeposit).toFixed(2);
            var dian = new Number(item.stopProfitPrice) - new Number(item.stopLossPrice);
            var grossProfit = new Number(item.grossProfit).toFixed(2);
            var gpClass = '';
            var gpStr = '亏';
            var gpType = '止损';

            if (grossProfit > 0) {
                gpClass = 'zhuan';
                gpStr = '赚';
                gpType = '止盈';
            }
            result += '<table class="record-table">' +
                '<tr>' +
                '<td width="40%" colspan="2">' +
                '<span class="ypc">' + status + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td width="40%">' +
                '商品:' +
                '<span>' + name + '</span>' +
                '</td>' +
                '<td width="55%">' +
                '数量:' +
                '<span>' + count + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '建仓价:' +
                '<span>' + openPrice + '</span>' +
                '</td>' +
                '<td>' +
                '创建时间:' +
                '<span>' + openTime + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '定金:' +
                '<span>' + useDeposit + '</span>' +
                '</td>' +
                '<td>' +
                '止盈止损点数:' +
                '<span>' + ((dian) / 2).toFixed(0) + '(' + buySell + ')</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '平仓价:' +
                '<span>' + closePrice + '</span>' +
                '</td>' +
                '<td>' +
                '平仓时间:' +
                '<span>' + closeTime + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '平仓类型:' +
                '<span>' + gpType + '</span>' +
                '</td>' +
                '<td>' +
                '手续费:' +
                '<span>' + charge + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2">' +
                '<div class="decline ' + gpClass + '">' +
                '<div class="state bor_rau3 fl">' + gpStr + '</div>' +
                '<span class="money fl">' + grossProfit + '</span>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>';
        }
        return result;
    }
})
