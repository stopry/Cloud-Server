/**
 * Created by xiaobei on 2017/3/23.
 */
$(function () {

    if(oauth.getToken() == null || oauth.getToken() == ''){
        location.href="./login.html"
    }

    //获取用户基础数据
    getBaseInfo();
    function getBaseInfo() {
        ajax.get(api.acctInfo, {}, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                console.log(data);
                $(".head.bor_rau3 img").attr("src", data.hearimgUrl);
                $(".userYe").html(util.formatMoney(data.usableDeposit + data.useDeposit));
                $(".userJyq").html(data.djj);
            } else {
                _z_.topAlert(ret.msg);
                setTimeout(function(){
                    location.href="./login.html";
                },3000);
            }
        })
    }


    var currIndex = 0;
    var countDown = 30;//倒计时
    var interval;
    var enableCntPos = true;//是否可建仓
    var residueCount = 30;

    var newTime = '';
    var kType = '1';
    var first = true;
    var tempLen = 0;
    var startValueIndex = 30;
    var fstep = 20;
    //首页全屏
    function autoSize() {
        var h = $(window).height();
        $("#chart").height(parseInt(h) - parseInt($(".indexTop").height()) - parseInt($(".indexBot").height()));
    }

    autoSize();
    $(window).resize(function () {
        autoSize();
    })

    // var _z_ =  _z_;
    _z_.verticalAlign(".ajaxLayer", ".loadImgWrap");
    _z_.absverticalAlign("body", ".pwdOvTmBox");

    //图表类型
    var chartType = 0;
    var proList;//商品列表用来选择选择止盈止损点数据
    var protype;//当前选中商品类型 用来设置显示当前持仓列表
    //创建图表
    var option = {};
    var app = null;
    $(window).resize(function () {
        autoSize();
        //页面resize后重新显示图表以保证页面内容始终是全屏
        app = echarts.init(document.getElementById('chart'));//得到图表容器
        app.showLoading();//显示加载动画
        app.setOption(option);//图表容易设置配置并画图
        app.hideLoading();//回执完毕隐藏加载动画
    })
    function createMyChart() {
        app = echarts.init(document.getElementById('chart'));//得到图表容器
        app.showLoading();//显示加载动画
        app.setOption(option);//图表容器设置配置并画图
        app.hideLoading();//回执完毕隐藏加载动画
    };

    //创建分时图
    function creatF() {
        option = {
            title: {
                show: false,
            },
            animation: false,
            tooltip: {
                trigger: 'axis',
                axis: 'auto',
                axisPointer: {
                    type: 'cross',
                    label: {
                        precision: 0,
                        backgroundColor: '#CC0000'
                    }
                }
            },
            grid: {
                //show:true,
                x: 0,
                y: 8,
                x2: 5,
                y2: 30,
                //bottom:80
            },
            xAxis: {
                type: 'category',
                data: fdate,
                boundaryGap: false,
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 14,
                        color: '#999',
                    },
                    interval: function (index, value) {
                        if (index == 0) {
                            return false;
                        }
                        if (value != 'undefined' &&
                            ( new String(value).indexOf(':05') > 0 || new String(value).indexOf(':10') > 0
                            || new String(value).indexOf(':15') > 0 || new String(value).indexOf(':20') > 0
                            || new String(value).indexOf(':25') > 0 || new String(value).indexOf(':30') > 0
                            || new String(value).indexOf(':35') > 0 || new String(value).indexOf(':40') > 0
                            || new String(value).indexOf(':45') > 0 || new String(value).indexOf(':50') > 0
                            || new String(value).indexOf(':55') > 0 || new String(value).indexOf(':00') > 0)) {
                            return true;
                        }
                    }
                },
            },
            yAxis: [
                {
                    show: true,
                    type: 'value',
                    max: fmax,
                    min: fmin,
                    axisLine: {
                        show: false,
                    },
                    interval: fstep,
                    axisLabel: {
                        show: true,
                        inside: true,
                        textStyle: {
                            color: '#999',
                            fontSize: 14,
                        },
                        formatter: function (value, index) {
                            if (index === 0) {
                                return "";
                            }
                            return value;
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#EFEFEF',
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '价格',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(125,179,220)',
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#B2D6F2'
                            }, {
                                offset: 1,
                                color: '#B2D6F2'
                            }])
                        }
                    },
                    data: fserdata,
                    markLine: {
                        data: [
                            {yAxis: fserdata[fserdata.length - 1]}
                        ],
                        symbol: [
                            'pin', 'circle'
                        ],
                        label: {
                            normal: {
                                show: true,
                                position: 'start'

                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#3C990B',
                                width: '1'
                            },
                        }
                    },
                    markPoint: {
                        silent: false,
                        data: [
                            {yAxis: fserdata[fserdata.length - 1], xAxis: fdate[fdate.length - 1]}
                        ],
                        symbol: 'rect',
                        symbolSize: [45, 20],
                        label: {
                            normal: {
                                show: true,
                                offset: [2, -2]
                            }
                        },
                        symbolOffset: [-25, 0],
                        itemStyle: {
                            normal: {
                                color: '#3C990B',
                                opacity: 0.8
                            }
                        }
                    }
                }
            ]
        };
        createMyChart()
    }

    //创建K线图
    var fma;

    function creatK() {
        option = {//图表配置
            backgroundColor: '#fff',//图表背景色
            legend: {//头部导航
                show: false,
                inactiveColor: '#777',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                //show:true,
                x: 11,
                y: 26,
                x2: 18,
                y2: 35,
                //bottom:80
            },
            tooltip: {
                trigger: 'axis',
                axis: 'angle',
                axisPointer: {
                    type: 'cross',
                    label: {
                        precision: 0,
                        backgroundColor: '#A90000'
                    }
                }
            },
            xAxis: [{//横坐标
                type: 'category',
                data: kdates,
                position: 'bottom',
                axisTick: {
                    inside: true,
                },
                offset: 10,
                boundaryGap: false,
                axisLabel: {
                    rotate: 0,
                    textStyle: {
                        fontSize: 14,
                        color: '#999'
                    },
                    interval: function (index, value) {
                        if (startValueIndex <= 20 && index % 4 == 0) {
                            return true;
                        } else if (startValueIndex <= 30 && startValueIndex > 20 && index % 6 == 0) {
                            return true;
                        } else if (startValueIndex <= 40 && startValueIndex > 30 && index % 8 == 0) {
                            return true;
                        } else if (startValueIndex <= 50 && startValueIndex > 40 && index % 10 == 0) {
                            return true;
                        } else if (startValueIndex <= 60 && startValueIndex > 50 && index % 12 == 0) {
                            return true;
                        } else if (startValueIndex <= 70 && startValueIndex > 60 && index % 14 == 0) {
                            return true;
                        } else if (startValueIndex <= 80 && startValueIndex > 70 && index % 16 == 0) {
                            return true;
                        } else if (startValueIndex <= 90 && startValueIndex > 80 && index % 18 == 0) {
                            return true;
                        } else if (startValueIndex > 90 && index % 20 == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    formatter: function (value, index) {
                        if (index === 0) {
                            return "     " + value.split('\n')[0];
                        }
                        return value.split('\n')[0];
                    }
                },
                splitLine: {//分割线
                    show: false,
                    lineStyle: {
                        color: ['#EFEFEF'],
                        width: 1,
                        type: 'solid'
                    }
                }
            }],
            yAxis: [{//纵坐标
                min: kmin,
                max: kmax,
                z: 100,
                interval: fstep,
                minInterval: fstep,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: ['#999'],
                        type: 'solid'
                    }
                },
                splitLine: {//分割线
                    show: false,
                    lineStyle: {
                        color: ['#EFEFEF'],
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    inside: true,
                    margin: -6,
                    textStyle: {
                        color: ['#999'],
                        fontSize: 12,
                    },
                    formatter: function (value, index) {
                        if (index === 0) {
                            return "";
                        }
                        /*if( value == kmax){
                         return "";
                         }*/
                        return value;
                    }
                }
            }, {//纵坐标
                min: kmin,
                max: kmax,
                interval: fstep,
                minInterval: fstep,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: ['#999'],
                        type: 'solid'
                    }
                },
                splitLine: {//分割线
                    show: true,
                    lineStyle: {
                        color: ['#EFEFEF'],
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    show: false,
                    inside: false,
                    textStyle: {
                        color: '#999',
                        fontSize: 14,
                    },
                    formatter: function (value, index) {
                        if (index === 0) {
                            return "";
                        }
                        /*if( value == kmax){
                         return "";
                         }*/
                        return value;
                    },
                }
            }],
            dataZoom: [{
                show: false,
                xAxisIndex: 0,
                startValue: kdates[kdates.length - startValueIndex],
                endValue: kdates[kdates.length - 1]
            }],
            animation: false,//绘图的动画效果
            series: [
                {
                    type: 'candlestick',//图表类型K线图
                    name: '1',
                    data: kdata,//浮动框中的数据
                    itemStyle: {
                        normal: {
                            color: '#E63234',//涨线段颜色
                            color0: '#1EB83F',//跌线段颜色
                            borderColor: '#E63234',//涨线段背景色
                            borderColor0: '#1EB83F',////跌线段背景色
                            borderWidth: 1,

                        }
                    },
                    markLine: {
                        data: [
                            {yAxis: kdata[kdata.length - 1][1]}
                        ],
                        symbol: [
                            'pin', 'pin'
                        ],
                        symbolSize: 0,
                        label: {
                            normal: {
                                show: false,
                                precision: 0,
                                position: 'middle'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#3C990B',
                                width: '1'
                            },

                        }
                    }
                }
            ]
        };
        createMyChart();
    }

    $(".zoomCtrlAdd").click(function () {
        startValueIndex -= 10;
        if (startValueIndex <= 20) {
            startValueIndex = 20;
        }
        option.dataZoom[0].startValue = kdates[kdates.length - startValueIndex];
        option.dataZoom[0].endValue = kdates[kdates.length - 1];
        initKM(startValueIndex);
        option.yAxis[0].min = kmin;
        option.yAxis[0].max = kmax;
        option.yAxis[0].interval = fstep;
        option.yAxis[1].min = kmin;
        option.yAxis[1].max = kmax;
        option.yAxis[1].interval = fstep;
        app.setOption(option);
    });

    $(".zoomCtrlRedu").click(function () {
        startValueIndex += 10;
        if (startValueIndex >= kdates.length) {
            startValueIndex = kdates.length;
        }
        option.dataZoom[0].startValue = kdates[kdates.length - startValueIndex];
        option.dataZoom[0].endValue = kdates[kdates.length - 1];
        initKM(startValueIndex);
        option.yAxis[0].min = kmin;
        option.yAxis[0].max = kmax;
        option.yAxis[0].interval = fstep;
        option.yAxis[1].min = kmin;
        option.yAxis[1].max = kmax;
        option.yAxis[1].interval = fstep;
        app.setOption(option);
    });
    //creatK();
    //得到分时图数据
    function getFdatas(type) {
        kType = '1';
        first = true;
        ajax.get(api.timeline, {goodsType: type}, function (ret) {
            if (!ret.success) {
                _z_.topAlert(ret.msg);
            }
            var data = ret.obj.list;
            fdate = (data.map(function (item) {
                return item.qTime;
            })).map(function (itemd) {
                return itemd.split(" ").slice(1, 2).join("");
            });
            fserdata = data.map(function (itemp) {
                return itemp.price;
            });
            fmin = getInt(Math.min.apply(null, fserdata), -1);
            fmax = getInt(Math.max.apply(null, fserdata), 1);
            var ft = (fmax - fmin) / 2;
            if (ft % 10 != 0) {
                ft += 5;
            }
            if (ft <= 50) {
                fmax += 2 * ft;
                fmin -= 2 * ft;
            } else {
                fmax += ft;
                fmin -= ft;
            }

            while ((fmax - fmin) % 4 != 0) {
                fmax += 10;
            }
            fstep = (fmax - fmin) / 4;
            creatF();//创建分时图;
            newTime = ret.obj.newTime;
        })
    }

    function getInt(obj, k) {
        var num = new Number(obj.toFixed());
        while (num % 10 != 0) {
            num += k;
        }
        return num;
    }


    //得到k线图数据
    function getKdatas(goodsType, chartType) {
        kType = chartType;
        first = true;
        ajax.get(api.kchart, {goodsType: goodsType, chartType: chartType}, function (ret) {
            if (!ret.success) {
                _z_.topAlert(ret.msg);
                return;
            }
            var tmp = [];
            data0 = ret.obj.map(function (item) {
                //tmp.push()
                return (util.formatTimeForH5(item.kdate) + "," + item.openPrice + "," + item.closePrice + "," + item.min + "," + item.max).split(",");
            })
            data0 = splitData(data0);
            kdates = data0.categoryData;
            kdata = data0.values;
            startValueIndex = 30;
            if (kdata.length <= startValueIndex) {
                startValueIndex = kdata.length;
            }
            initKM(startValueIndex);
            creatK();
        })
    }


    function initKM(startIndex) {
        if (startIndex >= kdata.length) {
            startIndex = kdata.length;
        }
        var tKdata = [];
        for (var i = 1; i <= startIndex; i++) {
            tKdata.push(kdata[kdata.length - i]);
        }
        kmin = getInt(Math.min.apply(null, tKdata.join(",").split(",")), -1);
        kmax = getInt(Math.max.apply(null, tKdata.join(",").split(",")), 1);
        var kt = (kmax - kmin);
        if (kt % 10 != 0 && kt % 4 != 0) {
            kmax += 10;
        }
        var km = getInt(kt / 2, 1);
        kmax += km;
        kmin -= km;
        var k = kmax - kmin;
        var fs = 1;
        while (k != km * 4) {
            if (fs > 0) {
                kmax += 10;
            } else {
                kmin -= 10;
            }
            fs *= -1;
            k = kmax - kmin;
        }
        fstep = (kmax - kmin) / 4;
        kmax -= fstep;
        //kmax += 10;
        kmin += fstep;
        //kmin -= 10;
        fstep = fstep / 2;
    }

    //获取商品
    function getProList() {
        ajax.get(api.goods, null, function (ret) {
            console.log(ret);
            if (!ret.success) {
                _z_.topAlert(ret.msg)
            }
            var data = ret.obj;
            proList = data;
            protype = data[0].id;
            checkPreOpenTime();
            //初始化操作数据
            oprDatas.proId = data[0].id;
            oprDatas.pro = data[0].goodsType;//商品类型
            oprDatas.code = data[0].list[1].code;//商品code
            oprDatas.type = 1;//类型-看涨
            oprDatas.hydj = data[0].list[1].clientDepositFee;//合约定金
            oprDatas.zyzs = data[0].spList[0];//止盈止损
            oprDatas.amount = 1;//数量
            oprDatas.jyq = false;//是否使用交易券

            getFdatas(data[0].id);//分时图
            getTotalInfo(data[0].id);//昨收今开
            var activeIndex = $(".proSel .proItem").hasClass("active");
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html +=
                    '<div id="' + data[i].id + '" class="proItem ' + (data[0].upOrDown == 1 ? "up" : "down") + (activeIndex && i == 0 ? " active " : " ") + 'waves feedBtn">' +
                    '<div class="proNmae">' + data[i].name + '</div>' +
                    '<div class="proZS">' +
                    '<span id="proZS_' + data[i].id + '">' + data[i].point + '</span>' +
                    '<i id="proIco_' + data[i].id + '" class="icon iconfont ' + (data[0].upOrDown == 1 ? "icon-yly_shangzhang" : "icon-up") + '"></i>' +
                    '</div>' +
                    '</div>';
            }
            ;
            for (var j = 0; j < data[0].spList.length; j++) {
                $(".ys" + j).html(data[0].spList[j])
            }
            for (var j = 0; j < data[0].list.length; j++) {
                $(".dj" + j).html(data[0].list[j].clientDepositFee);
            }
            $(".proSel").html(html);
            getPositionList();
        },true);
    };
    getProList();

    var tempT = 0;
    var tempTStep = 2;
    var siFlag = 0;
    setInterval(function () {
        if(siFlag != 0){
            return ;
        }
        siFlag = 1;
        tempT += tempTStep;
        $.ajax({
            type: 'GET',
            url: api.infoTimer,
            data: {"newTime": newTime, "goodsType": oprDatas.pro, "kType": kType},
            dataType: 'json',
            timeout: 10000,
            success: function (result) {
                if (result.success) {
                    var newQuotation = result.obj.newQuotation;
                    for (var i = 0; i < newQuotation.length; i++) {
                        $("#proZS_" + newQuotation[i].goodsType).html(newQuotation[i].nowPrice);
                        if (newQuotation[i].goodsType == oprDatas.pro) {
                            $(".detail.zs").html(newQuotation[i].yeClosePrice);
                            $(".detail.jk").html(newQuotation[i].toOpenPrice);
                            $(".detail.zg").html(newQuotation[i].highPrice);
                            $(".detail.zd").html(newQuotation[i].lowPrice);
                            $("#" + newQuotation[i].goodsType).removeClass('up');
                            $("#" + newQuotation[i].goodsType).removeClass('down');
                            $("#proIco_" + newQuotation[i].goodsType).removeClass('icon-yly_shangzhang')
                            $("#proIco_" + newQuotation[i].goodsType).removeClass('icon-up')
                            if (i == 0) {
                                if (result.obj.openPrice0 > newQuotation[i].nowPrice) {
                                    $("#proIco_" + newQuotation[i].goodsType).addClass('icon-up');
                                    $("#" + newQuotation[i].goodsType).addClass('down');
                                } else {
                                    $("#proIco_" + newQuotation[i].goodsType).addClass('icon-yly_shangzhang');
                                    $("#" + newQuotation[i].goodsType).addClass('up');
                                }
                            } else if (i == 1) {
                                if (result.obj.openPrice1 > newQuotation[i].nowPrice) {
                                    $("#proIco_" + newQuotation[i].goodsType).addClass('icon-up');
                                    $("#" + newQuotation[i].goodsType).addClass('down');
                                } else {
                                    $("#proIco_" + newQuotation[i].goodsType).addClass('icon-yly_shangzhang');
                                    $("#" + newQuotation[i].goodsType).addClass('up');
                                }
                            }
                        }
                    }
                    newTime = result.obj.newTime;
                    var pList = result.obj.pList;
                    var t = result.obj.kType;
                    var acct = result.obj.acct;
                    if (acct != null && acct != '') {
                        $('.userYe').html(util.formatMoney(acct.usableDeposit + acct.useDeposit));
                        $('.userJyq').html(acct.djj);
                    }
                    if (result.obj.goodsType == oprDatas.pro) {
                        buildPositionList(pList);
                    }

                    if (t == '1' && t == kType && result.obj.goodsType == oprDatas.pro && result.obj.trand) {//分时图
                        var fList = result.obj.fList;
                        var price = 0;
                        if (fList.length >= 1) {
                            price = fList[0].price;
                            var t = new Date().format('hh:mm');
                            if (t == fdate[fdate.length - 1]) {
                                fserdata.splice(fserdata.length - 1, fserdata.length - 1, fList[0].price);
                            } else {
                                fserdata.push(fList[0].price);
                                fserdata.shift();
                                fdate.push(t);
                                fdate.shift();
                            }
                        }
                        option.xAxis.data = fdate;
                        option.series[0].data = fserdata;
                        option.series[0].markLine.data[0].yAxis = price;
                        option.series[0].markPoint.data[0].yAxis = price;
                        option.series[0].markPoint.data[0].xAxis = fdate[fdate.length - 1];
                        app.setOption(option);

                    } else if ((t == '3' || t == '4' || t == '5') && t == kType && result.obj.goodsType == oprDatas.pro && result.obj.trand) {
                        try {
                            var fanjian = result.obj.fanjian;
                            if (fanjian != null) {
                                var k = [
                                    fanjian.openPrice, fanjian.closePrice, fanjian.min, fanjian.max
                                ];
                                kdata.splice(kdata.length - 1, kdata.length - 1, k);
                                initKM(startValueIndex);
                                option.yAxis.min = kmin;
                                option.yAxis.max = kmax;
                                option.dataZoom[0].startValue = kdates[kdates.length - startValueIndex];
                                option.dataZoom[0].endValue = kdates[kdates.length - 1];
                                option.series[0].data = kdata;
                                option.series[0].markLine.data[0].yAxis = kdata[kdata.length - 1][1];
                                app.setOption(option);
                            }
                        } finally {
                            console.log('---');
                        }
                    }
                }
                first = false;
                siFlag = 0;
            },
            error: function (info) {
                console.log(info);
                siFlag = 0;
            }, beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'bearer ' + oauth.getToken());
            }
        });
    }, 1000 * tempTStep);
    //昨收今开信息
    function getTotalInfo(type) {
        ajax.get(api.totalInfo, {goodsType: type}, function (ret) {
            //console.log(datas);
            if (!ret.success) {
                _z_.topAlert(ret.msg)
            }
            var data = ret.obj;
            $(".detail.zs").html(data.yeClosePrice);
            $(".detail.jk").html(data.toOpenPrice);
            $(".detail.zg").html(data.highPrice);
            $(".detail.zd").html(data.lowPrice);
            var totalInfo = {
                "yeClosePrice": data.yeClosePrice,
                "toOpenPrice": data.toOpenPrice,
                "highPrice": data.highPrice,
                "lowPrice": data.lowPrice,
            }
        })
    };
    //商品切换
    $(document).on("click", ".proSel .proItem", function () {
        var _index = $(this).index();
        var id = $(this).attr("id");
        currIndex = _index;
        protype = id;
        checkPreOpenTime();
        var data = proList[_index];
        oprDatas.proId = id;
        oprDatas.proId = data.id;
        oprDatas.pro = data.goodsType;//商品类型
        oprDatas.code = data.list[1].code;//商品code
        oprDatas.type = 1;//类型-看涨
        oprDatas.hydj = data.list[1].clientDepositFee;//合约定金
        oprDatas.zyzs = data.spList[0];//止盈止损
        oprDatas.amount = 1;//数量
        oprDatas.jyq = false;//是否使用交易券
        $(this).addClass('active').siblings(".proItem").removeClass("active");

        for (var j = 0; j < data.spList.length; j++) {
            $(".ys" + j).html(data.spList[j]);
        }

        getTotalInfo(id);
        if (chartType) {
            getKdatas(oprDatas.proId, chartType);
        } else {
            getFdatas(oprDatas.proId);
        }
        getPositionList();
    });
    //图表类型选择
    $(".itmeChart").click(function () {
        $(this).addClass("seled").siblings(".itme").removeClass("seled");
        var type = $(this).data("type");
        console.log(type);
        chartType = type;
        if (chartType) {
            getKdatas(oprDatas.proId, chartType);
            $(".zoomCtrlRedu").show();
            $(".zoomCtrlAdd").show();
        } else {
            getFdatas(oprDatas.proId);
            $(".zoomCtrlRedu").hide();
            $(".zoomCtrlAdd").hide();
        }
    });
    //操作区域数据
    var oprDatas = {
        proId: null,
        pro: null,//商品类型
        code: null,//商品code
        type: 1,//类型-看涨
        hydj: null,//合约定金
        zyzs: null,//止盈止损
        amount: 1,//数量
        jyq: false,//是否使用交易券
    }

    function setCountDown() {
        enableCntPos = false;//不可建仓
        interval = setInterval(function () {
            countDown--;

            var int = countDown < 10 ? "0" + countDown : countDown;
            residueCount = int;
            $(".countDownNum").html("00:" + int);
            if (countDown <= 0) {
                clearInterval(interval);
                enableCntPos = true;
                $(".xddjs").hide();
                countDown = 30;
            }
        }, 1000)
    }

    //检查距离上次建仓时间
    function checkPreOpenTime() {
        clearInterval(interval)
        var time = new Date().getTime();
        //var sysj = time-localStorage.getItem("timestamp");
        var sysj = time - (localStorage.getItem(protype) ? localStorage.getItem(protype) : 0);
        //console.log(localStorage.getItem(protype)?localStorage.getItem(protype):0);
        console.log(sysj);
        if (sysj > 30000) {
            $(".xddjs").hide();
            enableCntPos = true;
            return;
        }
        $(".xddjs").show();
        countDown = parseInt((30000 - parseInt(sysj)) / 1000);
        //alert(countDown)
        setCountDown();
    }

    var opening = '1';
    //setCountDown()
    //确认建仓
    function toOpen() {
        if (opening != '1') {
            return false;
        }
        opening = '0';
        //建仓数据
        var openData = {
            amount: oprDatas.amount,//数量
            buySell: oprDatas.type,//买涨或买跌
            depositType: oprDatas.jyq ? 1 : 0,//是否使用交易券
            goodsCode: oprDatas.code,//
            goodsType: oprDatas.proId,
            stopPoint: oprDatas.zyzs
        }
        ajax.post(api.open, openData, function (ret) {
            if (ret.success) {
                hideBuyWid();
                localStorage.setItem(protype, new Date().getTime());//存储最后一次建仓对应商品时间错
                checkPreOpenTime();
                getPositionList();
                getBaseInfo();
            } else {
                _z_.topAlert(ret.msg);
            }
            opening = '1';
        })
    }

    //获取当前持仓列表
    function getPositionList() {
        tempLen = 0;
       ajax.get(api.positionlist, {goodsType: oprDatas.pro}, function (ret) {
            var data = ret.obj;
            if (ret.success) {
                buildPositionList(data);
            } else {
                _z_.topAlert(ret.msg);
            }
        }, false);
    }

    function buildPositionList(data) {
        var html = "";
        if (data.length < 1) {
            if (!$(".nowChiCang").hasClass("hide")) {
                $(".nowChiCang").addClass("hide");
                $(".nowChiCang table").html(html);
                $(window).resize();
            }
            tempLen = data.length;
            return;
        }
        for (var i = 0; i < data.length; i++) {
            html +=
                '<tr>' +
                '<td>' +
                '<span class="type_t type t ' + (data[i].buySell == 1 ? "down up" : "down") + '">' + (data[i].buySell == 1 ? "多" : "空") + '</span>' +
                '<p class="proNmae_t b">' + data[i].name + '</p>' +
                '</td>' +
                '<td>' +
                '<span class="amountCon_t t">' + data[i].amount + '</span>' +
                '<p class="amountCon_t b">数量</p>' +
                '</td>' +
                '<td>' +
                '<span class="amountCon_t t">' + data[i].openPrice + '</span>' +
                '<p class="amountCon_t b">建仓价</p>' +
                '</td>' +
                '<td>' +
                '<span class="amountCon_t t">' + data[i].useDeposit / data[i].amount + '</span>' +
                '<p class="amountCon_t b">定金</p>' +
                '</td>' +
                '<td>' +
                '<span class="amountCon_t t">' + Math.abs(data[i].stopProfitPrice - data[i].stopLossPrice) / 2 + '</span>' +
                '<p class="amountCon_t b">止盈止损</p>' +
                '</td>' +
                '</tr>'
        }
        $(".nowChiCang").removeClass("hide");
        $(".nowChiCang table").html(html);
        if (tempLen != data.length && data.length <= 3) {
            $(window).resize();
        }
        tempLen = data.length;
    }

    $(".numSel .confirmBtn").click(function () {
        if (!enableCntPos) {
            _z_.topAlert("建仓时间间隔需大于30s,请" + residueCount + "s后再试");
            return;
        }
        toOpen();
    });
    $(".alertLayer").click(function () {
        hideBuyWid();
    });
    //重置购买弹窗数据
    function resetbuyWid() {
        var data = proList[currIndex];
        oprDatas.hydj = data.list[1].clientDepositFe;
        oprDatas.zyzs = data.spList[0];
        oprDatas.amount = 1;
        oprDatas.jyq = false;
        $(".addRedOpr .num").html(oprDatas.amount);
        $(".useTicketSel").removeClass("seled");
        $(".DJ .selItem").eq(1).addClass("seled").siblings(".selItem").removeClass("seled");
        $(".YS .selItem").eq(0).addClass("seled").siblings(".selItem").removeClass("seled");
    }

    //显示购买弹窗 1看涨 2看跌
    function showBuyWid(type) {
        oprDatas.type = type;
        resetbuyWid();
        if (type == 1) {
            $(".botOprArea").removeClass("lookDownWrap");
            $(".botOprArea .title").html('<i class="icon iconfont icon-kanzhang"></i>看涨');
        } else {
            $(".botOprArea").addClass("lookDownWrap");
            $(".botOprArea .title").html('<i class="icon iconfont icon-kanzhang icon-zhang"></i>看跌');
        }
        $(".alertLayer").show();
        $(".botOprArea").removeClass("hide");
    }

    //隐藏底部操作弹窗
    function hideBuyWid() {
        $(".alertLayer").hide();
        $(".botOprArea").addClass("hide");
    }

    //看涨弹窗
    $(".lookUpBtn").click(function () {
        if (!sessionStorage.getItem("isVer")) {
            showTradePwd();
            return;
        }
        showBuyWid(1)
    });
    $(".lookDownBtn").click(function () {
        if (!sessionStorage.getItem("isVer")) {
            showTradePwd();
            return;
        }
        showBuyWid(2)
    });
    //关闭购买操作层
    $(".numSel .cancelBtn").click(function () {
        hideBuyWid();
    })
    //合约定金选择
    $(".DJ .selItem").click(function () {
        $(this).addClass("seled").siblings(".selItem").removeClass("seled");
        var _index = $(this).index();
        var val = $(this).html().trim();
        var data = proList[currIndex];
        console.log(data);
        var minVal = data.list[0].clientDepositFee;
        if (val > minVal) {
            oprDatas.jyq = false;
            $(".useTicketSel").removeClass("seled");
        }
        oprDatas.hydj = val;
        var lIndex = $(this).data('val');
        oprDatas.code = data.list[lIndex].code;
        console.log(_index, val);
    })
    //止盈止损选择
    $(".YS .selItem").click(function () {
        $(this).addClass("seled").siblings(".selItem").removeClass("seled");
        var _index = $(this).index();
        var val = $(this).html().trim();
        var data = proList[currIndex];
        var minVal = data.spList[0];
        if (val > minVal) {
            oprDatas.jyq = false;
            $(".useTicketSel").removeClass("seled");
        }
        oprDatas.zyzs = val;
        console.log(_index, val);
    });
    //数量选择
    $(".addRedOpr .reduNum").click(function () {
        if (oprDatas.amount <= 1) return;
        oprDatas.amount -= 1;
        /*if (oprDatas.amount >= 1) {
         oprDatas.jyq = false;
         $(".useTicketSel").removeClass("seled");
         }*/
        console.log(oprDatas.amount)
        $(".addRedOpr .num").html(oprDatas.amount);
    })
    $(".addRedOpr .addNum").click(function () {
        if (oprDatas.amount >= 10) return;
        oprDatas.amount += 1;
        /*if (oprDatas.amount >= 1) {
         oprDatas.jyq = false;
         $(".useTicketSel").removeClass("seled");
         }*/
        $(".addRedOpr .num").html(oprDatas.amount);
    })
    //交易券选择
    $(".useTicketSel").click(function () {
        if (parseInt($(".userJyq").html()) <= 0) {
            _z_.topAlert("没有可用交易券");
            return;
        }
        $(this).toggleClass("seled");
        if ($(this).hasClass("seled")) {
            oprDatas.jyq = true;
        } else {
            oprDatas.jyq = false;
        }
        if (oprDatas.jyq) {
            var data = proList[currIndex];
            oprDatas.hydj = data.list[0].clientDepositFee;
            oprDatas.zyzs = data.spList[0];
            oprDatas.code = data.list[0].code;
            //oprDatas.amount = 1;
            //$(".addRedOpr .num").html(1);
            $(".DJ .selItem").eq(0).addClass("seled").siblings(".selItem").removeClass("seled");
            $(".YS .selItem").eq(0).addClass("seled").siblings(".selItem").removeClass("seled");
        }
    })
})