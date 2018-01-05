var myapp = angular.module("myapp", []);
myapp.controller("areaCarportUseRatio", function ($scope, $http, $state) {
    $scope.tabChexked = function () {
        $scope.charqeLine()
    }
    //初始化查询条件
    //    获取行政区域编码
    $.fn.mycity("sheng", "shi", "xian", 510107);
    $scope.areaRatioArr = {}
    //查询停车场
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     * 查询停车场
     * </p>
     * @param $scope.areaRatioArr：查询停车场条件集合<br>
     * @param pkPosAreaCode：停车场所在区域划分代码<br>
     * @param pageNum：当前页码<br>
     * @param pageSize：每页查询条数<br>
     * @param $scope.areaRatioArr.areaRatioName：停车场名字集合<br>
     * 创建者：肖烈 创建时间: 2017-04-15<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.pkSpcheck = function () {
        $scope.areaRatioArr = {}
        if ($("select[name='shi']").val() == "") {
            $scope.areaRatioArr.cityCode = $("select[name='sheng']").val();
        } else {
            $scope.areaRatioArr.cityCode = $("select[name='shi']").val();
        }
        $scope.areaRatioArr.pageNum = "1";
        $scope.areaRatioArr.pageSize = "10000";
        $http({
            url: "/eleting-web/area/getAreaPageInfoByCondition",
            method: "get",
            params: $scope.areaRatioArr,
        }).success(function (data) {
            if (data.code == 444) {
                $('#myModal').modal('hide');
            }
            if (data.datum.list.length < 1) {
                alert("未查询到结果或者未点击查询按钮!!!!")
            }
            $scope.areaRatioArr.areaRatioName = data.datum.list;
        }).error(function () {

        });
    }
//    改变区域
    $("#shi").change(function () {
        $scope.pkSpcheck();

    });
    $("#sheng").change(function () {
        $scope.pkSpcheck();

    });
//    查询车位收费情况
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     * 选择的停车场
     * </p>
     * @param text：被选中停车集合<br>
     * 创建者：肖烈 创建时间: 2017-04-15<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var text = [];
    $scope.submitSplaceId = function () {
        text = [];
        $("input[name=areaRadioChecked]").each(function () {
            if ($(this).attr("checked")) {
                text.push($(this).val());
            }
        });
        $('#myModal').modal('hide');
        $scope.charqeLine()
    }
    //查询数据
    //曲线图
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     * 选择的停车场
     * </p>
     * @param $scope.areaRadiocharqeLinearr：区域利用率查询条件集合<br>
     * @param start_date：起始日期<br>
     * @param end_date：结束日期<br>
     * @param area_id_list：区域停车场集合<br>
     * 创建者：肖烈 创建时间: 2017-04-15<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var data;
    $scope.areaRadiocharqeLinearr = {};
    $scope.charqeLine = function () {
        $("#c1").html("");
        $("#c5").html("");
        $scope.areaRadiocharqeLinearr.start_date = "2017-01-01";
        $scope.areaRadiocharqeLinearr.end_date = "2017-12-12";
        if ($("input[name='']"))
            if ($("input[name='beginDate1']").val() != "" && $("input[name='beginDate1']").val() != null && $("input[name='beginDate1']").val() != undefined) {
                $scope.areaRadiocharqeLinearr.start_date = "" + $("input[name='beginDate1']").val()
            }
        if ($("input[name='lessDate1']").val() != "" && $("input[name='lessDate1']").val() != null && $("input[name='lessDate1']").val() != undefined) {
            $scope.areaRadiocharqeLinearr.end_date = "" + $("input[name='lessDate1']").val()
        }
        $scope.picType = $("select[name='showType']").val();
        $scope.areaRadiocharqeLinearr.area_id_list = [];
        $scope.areaRadiocharqeLinearr.area_name_list = [];
        if (text.length < 1) {
            var id_list = ['02800012'];
            var name_list = ['成都高新区'];
            for (var i = 0; i < id_list.length; i++) {
                $scope.areaRadiocharqeLinearr.area_id_list.push(id_list[i])
                $scope.areaRadiocharqeLinearr.area_name_list.push(name_list[i])
            }
        } else {
            for (var i = 0; i < text.length; i++) {
                $scope.areaRadiocharqeLinearr.area_id_list.push(text[i])
                $scope.areaRadiocharqeLinearr.area_name_list.push(text[i])
            }
        }
        $http({
            url: "/eleting-web/analyze/area_duration_daily_ratio  ",
            method: "post",
            params: $scope.areaRadiocharqeLinearr,
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
        }).success(function (data) {
            if (data.code == 200) {
                if (data.datum.length < 1) {
                    alert("未查询到结果")
                }
                dreMydate(data)

            } else {
                alert("未查询到结果")
            }

        }).error(function () {
        });
    };
    $scope.charqeLine();
    //改变现实方式
    window.showTypeChange = function () {
        if ($("select[name='showType']").val() == "01" || $("select[name='showType']").val() == "02") {
            //$('html,body').animate({scrollTop: 300+'px'}, 500);
            $("#c1").css("display", "none")
            $("#c5").css("display", "block")
        } else {
            $('html,body').animate({scrollTop: 0 + 'px'}, 500);
            $("#c5").css("display", "none")
            $("#c1").css("display", "block")
        }
        $("#c1").html("");
        $("#c5").html("");
        $scope.charqeLine()
    }
    //    自动生成日期
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     * 自动生成日期
     * </p>
     * @param dreDate：遍历区间时间集合<br>
     * @param dreDateLast：最终日期<br>
     * 创建者：肖烈 创建时间: 2017-04-15<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var dreDate = [];
    var dreDateLast = [];
    var start = "2017-01-01";
    var end = "2017-12-30";

    function dreMydate(Myobj) {
        dreDateLast.splice(0,dreDateLast.length);//清理时间
        dreDate.splice(0,dreDate.length);//清理时间
        if ($("input[name='beginDate1']").val() != "" && $("input[name='beginDate1']").val() != null && $("input[name='beginDate1']").val() != undefined) {
            start = "" + $("input[name='beginDate1']").val()
        }
        if ($("input[name='lessDate1']").val() != "" && $("input[name='lessDate1']").val() != null && $("input[name='lessDate1']").val() != undefined) {
            end = "" + $("input[name='lessDate1']").val()
        }
        var startTime = new Date(start);
        var endTime = new Date(end);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
            var year = startTime.getFullYear();
            var month = startTime.getMonth().toString().length == 1 ? "0" + startTime.getMonth().toString() : startTime.getMonth();
            month = String(Number(month) + 1);
            month = month.length < 2 ? "0" + month : month;
            var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
            dreDate.push(year + "-" + month + "-" + day);
            startTime.setDate(startTime.getDate() + 1);
        }
        //重置日期集合
        dreDateLast = [];
        for (var z = 0; z < dreDate.length; z++) {
            var drr = {
                "date": dreDate[z]
            };
            dreDateLast.push(drr)
        }
        setDatalineDay(Myobj);
        setDatahistogram(Myobj);
    }

    var jsonArr = [];
    var mydd = [];
    var idArr = [];
    //制定线性展示内容
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     * 线形图
     * </p>
     * @param jsonArr：最终参数集合<br>
     * @param idArr：停车场名字集合<br>
     * 创建者：肖烈 创建时间: 2017-04-15<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    function setDatalineDay(obj) {
        idArr = [];
        jsonArr = [];
        for (var i = 0; i < obj.datum.length; i++) {
            for (var j = 0; j < dreDateLast.length; j++) {
                var maKey = obj.datum[i].name;
                //只添加一次key值
                if (i == 0) {
                    var arr = {
                        "maKey": "",
                        "date": ""
                    };
                    jsonArr.push(arr);
                }
                //对应时间的字段
                switch ($("select[name='showType']").val()) {
                    case "01":
                        for (var k = 0; k < obj.datum[i].dailyRatioList.length; k++) {
                            if (dreDateLast[j].date == obj.datum[i].dailyRatioList[k].date) {
                                jsonArr[j].maKey = obj.datum[i].dailyRatioList[k].average;
                            }
                        }
                        ;
                        break;
                    case "02":
                        //    或者这天是这一年的某一天
                    function isLeapYear(year) {
                        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
                    }

                    function getMonthDays(year, month) {
                        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
                    }

                    function getWeekNumber(obj) {
                        var now = new Date(obj),
                            year = now.getFullYear(),
                            month = now.getMonth(),
                            days = now.getDate();
                        //那一天是那一年中的第多少天
                        for (var i = 0; i < month; i++) {
                            days += getMonthDays(year, i);
                        }

                        //那一年第一天是星期几
                        var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

                        var week = null;
                        if (yearFirstDay == 1) {
                            week = Math.ceil(days / yearFirstDay);
                        } else {
                            days -= (7 - yearFirstDay + 1);
                            week = Math.ceil(days / 7) + 1;
                        }

                        return week;
                    }

                        for (var k = 0; k < obj.datum[i].weekRatioList.length; k++) {
                            if (getWeekNumber(dreDateLast[j].date) == obj.datum[i].weekRatioList[k].weekNum) {
                                jsonArr[j].maKey = obj.datum[i].weekRatioList[k].average;
                            }
                        }
                        ;
                        break;
                    case "03":
                        for (var k = 0; k < obj.datum[i].dailyRatioList.length; k++) {
                            if (dreDateLast[j].date == obj.datum[i].dailyRatioList[k].date) {
                                jsonArr[j].maKey = obj.datum[i].dailyRatioList[k].average;
                            }
                        }
                        ;
                        break;
                    case "04":
                        for (var k = 0; k < obj.datum[i].dailyRatioList.length; k++) {
                            if (dreDateLast[j].date == obj.datum[i].dailyRatioList[k].date) {
                                jsonArr[j].maKey = obj.datum[i].dailyRatioList[k].average;
                            }
                        }
                        ;
                        break;
                }
                jsonArr[j].date = dreDateLast[j].date;
                jsonArr[j][maKey] = jsonArr[j]["maKey"];
                delete jsonArr[j]["maKey"];
            }
            idArr.push(maKey)
        }
        aaa(jsonArr)

    }

    // 渲染线形图效果
    function aaa(mydata) {
        var Frame = G2.Frame;
        var frame = new Frame(mydata);
        //遍历车位
        switch (idArr.length) {
            case 1:
                frame = Frame.combinColumns(frame, [idArr[0]], 'value', 'city', 'date');
                break;
            case 2:
                frame = Frame.combinColumns(frame, [idArr[0], idArr[1],], 'value', 'city', 'date');
                break;
            case 3:
                frame = Frame.combinColumns(frame, [idArr[0], idArr[1], idArr[2]], 'value', 'city', 'date');
                break;
            case 4:
                frame = Frame.combinColumns(frame, [idArr[0], idArr[1], idArr[2], idArr[3],], 'value', 'city', 'date');
                break;
            case 5:
                frame = Frame.combinColumns(frame, [idArr[0], idArr[1], idArr[2], idArr[3], idArr[4]], 'value', 'city', 'date');
                break;
        }
        var chart = new G2.Chart({
            id: 'c5',
            forceFit: true,
            height: 450,
            plotCfg: {
                margin: [20, 20, 100, 80]
            }
        });
        chart.source(frame, {
            date: {
                type: 'time',
                mask: 'yyyy.mm.dd',
                tickCount: 12,
                alias: '日期'
            },
            value: {
                alias: '利用率（%）',
                formatter: function (val) {
                    return val + "%";
                }
            }
        });
        chart.legend({
            position: 'bottom'
        });
        chart.axis('date', {
            line: null,
            tickLine: {
                stroke: '#000',
                value: 6 // 刻度线长度
            },
            title: null
        });
        chart.axis('value', {
            tickLine: {
                stroke: '#000',
                value: 5 // 刻度线长度
            },
            labels: {
                label: {
                    fill: '#000'
                }
            },
            line: {
                stroke: '#000'
            },
            grid: null
        });
        //chart.area().position('date*value').color('type').shape('smooth');
        chart.line().position('date*value').color('city', ['#1f77b4', '#ff7f0e', '#2ca02c']).shape('spline').size(2);
        chart.render();
    }

//    制定柱状图显示内容
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     * 柱状图
     * </p>
     * @param histogramArr：停车场名字集合<br>
     * 创建者：肖烈 创建时间: 2017-04-15<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var histogramArr = [];
    var histogramIdArr = []

    function setDatahistogram(obj) {
        //清楚上一次数据
        histogramArr = [];
        for (var i = 0; i < obj.datum.length; i++) {
            var maKey = obj.datum[i].name;
            var arr = {
                "name": "",
                "data": ["", "", "", "", "", "", "", "", "", "", "", ""]
            };
            histogramArr.push(arr);
            if ($("select[name='showType']").val() == "04") {
                for (var kz = 0; kz < obj.datum[i].quarterRatioList.length; kz++) {
                    for (var j = 0; j < 4; j++) {
                        if (obj.datum[i].quarterRatioList[kz].quarterNum == j) {
                            histogramArr[i].data[j - 1] = obj.datum[i].quarterRatioList[kz].average;
                        }
                    }
                }
            }
            else {
                for (var kz = 0; kz < obj.datum[i].monthRatioList.length; kz++) {
                    for (var j = 0; j < 13; j++) {
                        if (Number(obj.datum[i].monthRatioList[kz].monthNum) == j) {
                            histogramArr[i].data[j - 1] = obj.datum[i].monthRatioList[kz].average;
                        }
                    }
                }

            }

            histogramArr[i].name = obj.datum[i].name;

        }

        histogramPic(histogramArr);
    }

    //柱状图
    function histogramPic(obj) {
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i];
            var datas = item.data;
            if ($("select[name='showType']").val() == "04") {
                var months = ['第一季度', '第二季度', '第三季度', '第四季度'];
            }
            else {
                var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

            }
            for (var j = 0; j < datas.length; j++) {
                item[months[j]] = datas[j];
            }
            var data = []
            data[i] = item;
        }
        var Stat = G2.Stat;
        var Frame = G2.Frame;
        var frame = new Frame(obj);
        if ($("select[name='showType']").val() == "04") {
            frame = Frame.combineColumns(frame, ['第一季度', '第二季度', '第三季度', '第四季度'], '月均收费（单位/分）', '月份', 'name');
        }
        else {
            frame = Frame.combineColumns(frame, ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], '月均利用率（单位/%）', '月份', 'name');
        }

        var chart = new G2.Chart({
            id: 'c1',
            forceFit: true,
            height: 350,
            plotCfg: {
                margin: [60, 90, 60, 70]
            }
        });
        chart.source(frame);
        chart.col('name', {alias: '停车位'});
        chart.intervalDodge().position('月份*月均利用率（单位/%）').color('name');
        chart.render();
    }
});

