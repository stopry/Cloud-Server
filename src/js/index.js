/**
 * Created by xiaobei on 2017/3/23.
 */
$(function() {
    //获取用户基础数据
    getBaseInfo();
    function getBaseInfo() {
        var openid = localStorage.getItem("WX_AUTH_OPENID");
        if (openid == null || '' == openid) {
            _z_.topAlert('请联系客服');
            return;
        }
        ajax.get(api.baseInfo, {openid: openid}, function (datas) {
            //console.log(datas);
            if (datas.httpCode == 200) {
                var data = datas.data;
                console.log(data);
                localStorage.setItem("USER_MOBILE", data.mobile);
                localStorage.setItem("baseInfo", JSON.stringify(datas.data));
                $(".head.bor_rau3 img").attr("src",data.hearimgUrl);
                $(".userYe").html(util.formatMoney(data.balance));
                $(".userJyq").html(data.djj);
            } else {
                _z_.topAlert(datas.msg);
            }
        })
    }
});
$(function () {
    var countDown = 30;//倒计时
    var interval;
    var enableCntPos = true;//是否可建仓
    var residueCount = 30;
    //首页全屏
    function autoSize() {
        var h = $(window).height();
        $("#chart").height(parseInt(h) - parseInt($(".indexTop").height()) - parseInt($(".indexBot").height()));
    }
    autoSize();
    $(window).resize(function(){
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
            legend: {
                show: false,
            },
            dataZoom: {
                type: 'inside',
                disabled: true,
            },
            animation:false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    lineStyle: {
                        color: '#f94e4e',
                        width: 1,
                        opacity: 1
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: ['80%', '80%'],
                axisTick: {
                    inside: true,
                },
                data: fdate,
                axisLabel: {
                    margin: 5,
                    rotate: 0,
                },
                axisLine: {lineStyle: {color: '#aaa'}},//横坐标颜色
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#f4f4f4'],
                        width: 1,
                        type: 'solid'
                    }
                },
                textStyle: {
                    fontSize: 10
                }
            },
            grid: {
                //show:true,
                x: '0.85%',
                y: 5,
                x2: '0.85%',
                y2: 26,
            },
            yAxis: [
                {
                    type: 'value',
                    axisTick: {
                        inside: true,
                    },
                    axisLabel: {
                        //rotate:30,
                        margin: -38,
                    },
                    max: fmax,
                    min: fmin,
                    boundaryGap: ['', '100%'],
                    axisLine: {lineStyle: {color: '#aaa'}},
                    textStyle: {
                        fontSize: 10,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#f4f4f4'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    //min: 3198,
                    //max: 3214
                },
                {
                    type: 'value',
                    axisTick: {
                        inside: true,
                        show: false
                    },
                    axisLabel: {
                        //rotate:30,
                        margin: -38,
                        formatter: '{value} %',
                    },
                    axisLine: {lineStyle: {color: '#aaa'}, show: false},
                    textStyle: {
                        fontSize: 10,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#f4f4f4'],
                            width: 0,
                            type: 'solid'
                        }
                    },
                    min: 0,
                    max: 10
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
                            color: 'rgb(0, 160, 233)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(69, 190, 240)'
                            }, {
                                offset: 1,
                                color: 'rgb(3, 136, 196)'
                            }])
                        }
                    },
                    data: fserdata
                },
                {
                    show: false,
                    type: 'line',
                    data: [],
                    yAxisIndex: 1,
                },
            ]
        };
        createMyChart()
    }

    //创建K线图
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
                x: '0.85%',
                y: 5,
                x2: '0.85%',
                y2: 26,
                //bottom:80
            },
            tooltip: {//鼠标经过垂直线
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    lineStyle: {
                        color: '#f94e4e',
                        width: 1,
                        opacity: 1
                    }
                }
            },
            xAxis: {//横坐标
                type: 'category',
                data: kdates,
                axisTick: {
                    inside: true,
                },
                axisLabel: {
                    margin: 1,
                    rotate: 0,
                },
                splitLine: {//分割线
                    show: true,
                    lineStyle: {
                        color: ['#f4f4f4'],
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLine: {lineStyle: {color: '#aaa'}},
                textStyle: {
                    fontSize: 10
                }
            },
            dataZoom: [{
                show:false,
                start:0,
                end:100,
                top: "2%",
                width: "50%",
                right: "3%",
                height: "20",
                textStyle: {
                    color: '#8392A5'
                },
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                dataBackground: {
                    areaStyle: {
                        color: '#8392A5'
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8392A5'
                    }
                },
                handleStyle: {
                    color: '#EEF7FE',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, .6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }, {
                type: 'inside'
            }],
            yAxis: {//纵坐标
                min: kmin,
                max: kmax,
                scale: true,
                axisTick: {
                    inside: true,
                },
                axisLabel: {
                    //rotate:30,
                    margin: -38,
                },
                axisLine: {lineStyle: {color: '#aaa'}},
                splitLine: {//分割线
                    show: true,
                    lineStyle: {
                        color: ['#f4f4f4'],
                        width: 1,
                        type: 'solid'
                    }
                },
                textStyle: {
                    fontSize: 10
                },
            },
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
                            borderColor0: '#1EB83F'////跌线段背景色
                        }
                    }
                },
            ]
        };
        createMyChart();
    }
    $(".zoomCtrlAdd").click(function(){
        //option.dataZoom[0].show = false;
        console.log(option.dataZoom[0].start)
        if(option.dataZoom[0].start>=50) return;
        option.dataZoom[0].start+=10;
        option.dataZoom[0].end-=10;
        createMyChart();
    })
    $(".zoomCtrlRedu").click(function(){
        //option.dataZoom[0].show = false;
        console.log(option.dataZoom[0].start)
        if(option.dataZoom[0].start<=0) return;
        option.dataZoom[0].start-=10;
        option.dataZoom[0].end+=10;
        createMyChart();
    })
    //creatK();
    //得到分时图数据
    function getFdatas(type) {
        ajax.get(api.timeline, {goodsType: type}, function (datas) {
            console.log(datas);
            if (datas.httpCode != 200) {
                _z_.topAlert(datas.msg);
            }
            var data = datas.data;
            console.log(data);
            fdate = (data.map(function(item){
                return item.qTime;
            })).map(function(itemd){
                return itemd.split(" ").slice(1,2).join("");
            });
            //console.log(fdate);
            fserdata = data.map(function(itemp){
                return itemp.price;
            });
            fmin = Math.min.apply(null,fserdata)-2;
            fmax = Math.max.apply(null,fserdata)+2;
            console.log(fmin,fmax)
            creatF();//创建分时图;
        })
    }

    //得到k线图数据
    function getKdatas(goodsType, chartType) {
        ajax.get(api.kchart, {goodsType: goodsType, chartType: chartType}, function (datas) {
            if (datas.httpCode != 200) {
                _z_.topAlert(datas.msg);
                return;
            };
            console.log(datas);
            var tmp = [];
            data0 = datas.data.map(function(item){
                //tmp.push()
                return (util.formatTimeForH5(item.kdate)+","+item.openPrice+","+item.closePrice+","+item.min+","+item.max).split(",");
            })
            data0 = splitData(data0);
            console.log(data0)
            kdates = data0.categoryData
            kdata = data0.values;
            kmin = Math.min.apply(null,kdata.join(",").split(","))/1.002;
            kmax = Math.max.apply(null,kdata.join(",").split(","))*1.002;
            creatK();
        })
    }

    //获取商品
    function getProList() {
        ajax.post(api.goods, null, function (datas) {
            console.log(datas);
            if (datas.httpCode != 200) {
                _z_.topAlert(datas.msg)
            }
            var data = datas.data;
            proList = data;
            protype = data[0].id;
            console.log(proList)
            oprDatas.proId = data[0].id;
            getFdatas(data[0].id);//分时图
            getTotalInfo(data[0].id);//昨收今开
            var activeIndex = $(".proSel .proItem").hasClass("active");
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html +=
                    '<div id="' + data[i].id + '" class="proItem ' + (data[0].upOrDown == 1 ? "up" : "down") + (activeIndex && i == 0 ? " active " : " ") + 'waves feedBtn">' +
                    '<p class="proNmae">' + data[i].name + '</p>' +
                    '<p class="proZS">' +
                    '<span>' + data[i].point + '</span>' +
                    '<i class="icon iconfont ' + (data[0].upOrDown == 1 ? "icon-yly_shangzhang" : "icon-up") + '"></i>' +
                    '</p>' +
                    '</div>';
            };
            for(var j = 0;j<data[0].spList.length;j++){
                $(".ys"+j).html(data[0].spList[j])
            };
            $(".proSel").html(html);
            getPositionList();
        })
    };
    getProList();
    //setInterval(function(){getProList()},1000)
    //昨收今开信息
    function getTotalInfo(type) {
        ajax.get(api.totalInfo, {goodsType: type}, function (datas) {
            //console.log(datas);
            if (datas.httpCode != 200) {
                _z_.topAlert(datas.msg)
            }
            var data = datas.data.quotationInfo;
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
    $(document).on("click", ".proSel .proItem", function () {
        var _index = $(this).index();
        var id = $(this).attr("id");
        protype = id;
        getPositionList();
        oprDatas.proId = id;
        $(this).addClass('active').siblings(".proItem").removeClass("active");

        for(var j = 0;j<proList[_index].spList.length;j++){
            $(".ys"+j).html(proList[_index].spList[j]);
        };

        getTotalInfo(id);
        if (chartType) {
            getKdatas(oprDatas.proId, chartType);
        } else {
            getFdatas(oprDatas.proId);
        }
        console.log(id);
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
        pro: 1,//商品类型
        type: 1,//类型-看涨
        hydj: 10,//合约定金
        zyzs: 5,//止盈止损
        amount: 1,//数量
        jyq: false,//是否使用交易券
    }

    function setCountDown() {
        enableCntPos = false;//不可建仓
        interval = setInterval(function () {
            countDown--;
            $(".xddjs").show();
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
    function checkPreOpenTime(){
        var time = new Date().getTime();
        var sysj = time-localStorage.getItem("timestamp");
        console.log(sysj)
        console.log(sysj);
        if(sysj>30000) {
            enableCntPos = true;
            return;
        }
        countDown = parseInt((30000-parseInt(sysj))/1000);
        alert(countDown)
        setCountDown();
    }
    checkPreOpenTime();
    //setCountDown()
    //确认建仓
    function toOpen() {
        //建仓数据
        var openData = {
            amount: oprDatas.amount,//数量
            buySell: oprDatas.type,//买涨或买跌
            depositType: oprDatas.jyq ? 1 : 0,//是否使用交易券
            goodsCode: oprDatas.proId + oprDatas.hydj,//
            goodsType: oprDatas.proId,
            stopPoint: oprDatas.zyzs
        }
        console.log(oprDatas);
        console.log(openData);
        ajax.post(api.open, openData, function (datas) {
            if (datas.httpCode == 200) {
                hideBuyWid();
                localStorage.setItem("timestamp",new Date().getTime());//存储最后一次建仓时间错
                setCountDown()
                getPositionList();
            } else {
                //localStorage.setItem("timestamp",new Date().getTime());
                console.log(datas);
                _z_.topAlert(datas.msg);
            }
        })
    }

    //获取当前持仓列表
    function getPositionList() {
        var openid = localStorage.getItem('WX_AUTH_OPENID');
        if(openid == null || '' == openid){
            return;
        }
        ajax.get(api.positionlist, {pageNum:1,openid:openid}, function (datas) {
            //console.log(datas);
            var data = datas.data;
            if (datas.httpCode == 200) {
                if(data.length>0){
                    console.log(data);
                    var tmparr = [];
                    for(var j = 0;j<data.length;j++){
                        if(data[j].type==protype){
                            tmparr.push(data[j]);
                        }
                    }
                    data = tmparr;
                    var html = ""
                    console.log(data);
                    if(data.length<1){
                        $(".nowChiCang").addClass("hide");
                        $(".nowChiCang table").html(html);
                        $(window).resize();
                        return;
                    }
                    for(var i = 0;i<data.length;i++){
                        html+=
                    '<tr>'+
                        '<td>'+
                        '<span class="type_t type t '+(data[i].buySell==1?"down up":"down")+'">'+(data[i].buySell==1?"多":"空")+'</span>'+
                            '<p class="proNmae_t b">'+data[i].name+'</p>'+
                            '</td>'+
                            '<td>'+
                            '<span class="amountCon_t t">'+data[i].amount+'</span>'+
                            '<p class="amountCon_t b">数量</p>'+
                            '</td>'+
                            '<td>'+
                            '<span class="amountCon_t t">'+data[i].openPrice+'</span>'+
                            '<p class="amountCon_t b">建仓价</p>'+
                            '</td>'+
                            '<td>'+
                            '<span class="amountCon_t t">'+data[i].useDeposit+'</span>'+
                            '<p class="amountCon_t b">定金</p>'+
                            '</td>'+
                            '<td>'+
                            '<span class="amountCon_t t">'+Math.abs(data[i].stopProfitPrice-data[i].stopLossPrice)/2+'</span>'+
                            '<p class="amountCon_t b">止盈止损</p>'+
                            '</td>'+
                            '</tr>'
                    }
                    $(".nowChiCang").removeClass("hide");
                    $(".nowChiCang table").html(html);
                    $(window).resize();
                }
            } else {
                _z_.topAlert(datas.msg);
            }
        })
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
        oprDatas.hydj = 10;
        oprDatas.zyzs = 5;
        oprDatas.amount = 1;
        oprDatas.jyq = false;
        $(".addRedOpr .num").html(oprDatas.amount);
        $(".useTicketSel").removeClass("seled");
        $(".DJ .selItem").eq(0).addClass("seled").siblings(".selItem").removeClass("seled");
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
        ;
        if (val > 10) {
            oprDatas.jyq = false;
            $(".useTicketSel").removeClass("seled");
        }
        oprDatas.hydj = val;
        console.log(_index, val);
    })
    //止盈止损选择
    $(".YS .selItem").click(function () {
        $(this).addClass("seled").siblings(".selItem").removeClass("seled");
        var _index = $(this).index();
        var val = $(this).html().trim();
        if (val > 5) {
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
        if(oprDatas.amount>=1){
            oprDatas.jyq = false;
            $(".useTicketSel").removeClass("seled");
        }
        console.log(oprDatas.amount)
        $(".addRedOpr .num").html(oprDatas.amount);
    })
    $(".addRedOpr .addNum").click(function () {
        if (oprDatas.amount >= 10) return;
        oprDatas.amount += 1;
        if(oprDatas.amount>=1){
            oprDatas.jyq = false;
            $(".useTicketSel").removeClass("seled");
        }
        $(".addRedOpr .num").html(oprDatas.amount);
    })
    //交易券选择
    $(".useTicketSel").click(function () {
        if(parseInt($(".userJyq").html())<=0){
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
            oprDatas.hydj = 10;
            oprDatas.zyzs = 5;
            oprDatas.amount = 1;
            $(".addRedOpr .num").html(1);
            $(".DJ .selItem").eq(0).addClass("seled").siblings(".selItem").removeClass("seled");
            $(".YS .selItem").eq(0).addClass("seled").siblings(".selItem").removeClass("seled");
        }
    })
})