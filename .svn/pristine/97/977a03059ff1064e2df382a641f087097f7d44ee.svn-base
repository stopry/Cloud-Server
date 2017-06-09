$(function () {
    var pageNum = 1;
    var isloading = false;

    function getList() {
        if (isloading) return;
        isloading = true;
        ajax.get(api.hispositionlist + '?pageNum=' + pageNum, null, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                if (data.length < 10) {
                    $(".pullLoadTips").html("没有更多了")
                }
                var tableHtml = buildTable(data);
                $(".record").append(tableHtml);
            } else {
                _z_.topAlert(ret.msg);
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
            var status = '';
            if (item.status == '0') {
                status = '【持仓中】';
            } else if (item.status == '3') {
                status = '【平仓失败】';
            } else {
                status = '【已平仓】';
            }

            var name = item.name;
            var buySell = item.buySell == 1 ? '看涨' : '看跌';
            var count = item.amount;
            var openPrice = item.openPrice;
            var openTime = new Date(item.openTime).format('yyyy-MM-dd hh:mm:ss');
            var closePrice = item.closePrice == null ? '' : item.closePrice;
            var closeTime = item.closeTime == null ? '' : new Date(item.closeTime).format('yyyy-MM-dd hh:mm:ss');
            //var charge = item.depositType == 0 ? util.formatMoney(item.openCharge + item.closeCharge) : '0.00';
            var charge = util.formatMoney(item.openCharge + item.closeCharge);
            var useDeposit = item.useDeposit;
            var dian = item.stopProfitPrice - item.stopLossPrice;
            if (item.buySell == '2') {
                dian = dian * -1;
            }
            var grossProfit = util.formatMoney(item.grossProfit);
            var gpClass = '';
            var gpStr = '无';
            var gpType = '收市平仓';

            if (item.grossProfit > 0) {
                gpClass = 'zhuan';
                gpStr = '赚';
                gpType = '止盈';
            } else if (item.grossProfit < 0) {
                gpClass = '';
                gpStr = '亏';
                gpType = '止损';
            }
            result += '<table class="record-table">' +
                '<tr>' +
                '<td width="40%" colspan="2">' +
                '<span class="ypc">' + status + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td width="40%">' +
                '商品:&nbsp;' +
                '<span>' + name + '</span>' +
                '</td>' +
                '<td width="55%">' +
                '数量:&nbsp;' +
                '<span>' + count + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '建仓价:&nbsp;' +
                '<span>' + openPrice + '</span>' +
                '</td>' +
                '<td>' +
                '创建时间:&nbsp;' +
                '<span>' + openTime + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '定金:&nbsp;' +
                '<span>' + util.formatMoney(new Number(useDeposit) / new Number(count)) + '</span>' +
                '</td>' +
                '<td>' +
                '止盈止损点数:&nbsp;' +
                '<span>' + (dian / 2) + '(' + buySell + ')</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '平仓价:&nbsp;' +
                '<span>' + closePrice + '</span>' +
                '</td>' +
                '<td>' +
                '平仓时间:&nbsp;' +
                '<span>' + closeTime + '</span>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '平仓类型:&nbsp;' +
                '<span>' + gpType + '</span>' +
                '</td>' +
                '<td>' +
                '手续费:&nbsp; <span> ' + charge + ' </span> ' +
                '<tr>' +
                '<td colspan="2">' +
                '<div class="decline ' + gpClass + '">' +
                '<div class="state bor_rau3 fl">' + gpStr + '</div>' +
                '<span class="money fl">' + grossProfit + '</span>' +
                '</div>' +
                '</td>' +
                '</tr></table>';
            /*if (charge != '0.00') {
             result += '手续费:&nbsp; <span> ' + charge + ' </span> ';
             }*/

            /* result += '</td></tr>';
             if (item.depositType == '0' || (item.depositType == '1' && item.grossProfit >= 0)) {
             result += ;
             }

             result += ' </ table> ';*/
        }
        return result;
    }
})
