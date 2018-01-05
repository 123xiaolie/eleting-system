var myapp=angular.module("myapp",[]);
myapp.controller("cityChargeStatement",function($scope,$http,$state){
    $scope.tabChexked=function(){
        $scope.charqeLine()
    };
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  查询城市
     * </p>
     * @param $scope.citySpcheckArr：查询城市集合<br>
     * @param pkPosAreaCode：查询城市区域代码<br>
     * @param pageNum：翻页查询当前页面<br>
     * @param pageSize：翻页查询每页总条数<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $.fn.mycity("sheng","shi","xian",510107);
    $scope.citySpcheckArr={}
    $scope.pkSpcheck=function(){
        $scope.citySpcheckArr={}
        $scope.citySpcheckArr.cityCode = $("select[name='sheng']").val();
        $scope.citySpcheckArr.status = -1;
        $scope.citySpcheckArr.pageNum="1";
        $scope.citySpcheckArr.pageSize="10000";
        $http({
            url:"/eleting-web/area/getAreaPageInfoByCondition",
            method:"get",
            params:$scope.citySpcheckArr,
        }).success(function(data){
            if(data.datum.list.length<1){
                alert("未查询到结果或者未点击查询按钮!!!!")
            }
            $scope.citySpcheckArr.cityName=data.datum.list;
        }).error(function(){

        });
    }
//    改变区域
    $("#sheng").change(function(){
        $scope.pkSpcheck();

    });
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  查询城市
     * </p>
     * @param $scope.citySpNameSeacherArr：城市集合<br>
     * @param pageNum：翻页查询当前页面<br>
     * @param pageSize：翻页查询每页总条数<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.citySpNameSeacherArr={};
    $scope.pkSpNameSeacher=function(){
        $scope.citySpNameSeacherArr.pageNum="1";
        $scope.citySpNameSeacherArr.pageSize="10000";
        $http({
            url:"/eleting-web/pkSpIf/getPkSpIfPageInfoByCondition",
            method:"get",
            params:$scope.citySpNameSeacherArr,
        }).success(function(data){
            $scope.citySpNameSeacherArr.cityName=data.datum.pkSpIfList;
        }).error(function(){

        });
    }
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  查询城市收费情况
     * </p>
     * @param text：选中城市集合<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var text=[];
    $scope.submitSplaceId=function(){
        text=[];
        $("input[name=pkSplaceNameChecked]").each(function() {
            if ($(this).attr("checked")) {
                text.push($(this).val());
            }
        });
        $('#myModal').modal('hide');
        $scope.charqeLine()
    }
    //查询数据
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  曲线图
     * </p>
     * @param $scope.citycharqeLinearr：查询条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var data;
    var mydate2;
    $scope.citycharqeLinearr={};
    $scope.charqeLine=function(){
        $("#c1").html("");
        $("#c5").html("");
        $scope.citycharqeLinearr.start_date="2017-01-01";
        $scope.citycharqeLinearr.end_date="2017-12-12";
        if($("input[name='']"))
            if($("input[name='beginDate1']").val()!=""&&$("input[name='beginDate1']").val()!=null&&$("input[name='beginDate1']").val()!=undefined){
                $scope.citycharqeLinearr.start_date=""+$("input[name='beginDate1']").val()
            }
        if($("input[name='lessDate1']").val()!=""&&$("input[name='lessDate1']").val()!=null&&$("input[name='lessDate1']").val()!=undefined){
            $scope.citycharqeLinearr.end_date=""+$("input[name='lessDate1']").val()
        }
        $scope.picType=$("select[name='showType']").val();
        $scope.citycharqeLinearr.city_id_list=[];
        $scope.citycharqeLinearr.city_name_list=[];
        if(text.length<1){
            var id_list=['028'];
            var name_list=['成都'];
            for(var i=0;i<id_list.length;i++){
                $scope.citycharqeLinearr.city_id_list.push(id_list[i])
                $scope.citycharqeLinearr.city_name_list.push(name_list[i])
            }
        }else{
            for(var i=0;i<text.length;i++){
                $scope.citycharqeLinearr.city_id_list.push(text[i])
                $scope.citycharqeLinearr.city_name_list.push(text[i])
            }
        }
        $http({
            url:"/eleting-web/analyze/city_duration_daily_fee",
            method:"post",
            params:$scope.citycharqeLinearr,
            headers:{
                "content-type":"application/x-www-form-urlencoded"
            },

        }).success(function(data){
            if(data.code==200){
                if(data.datum.length<1){
                    alert("未查询到结果")
                }
                dreMydate(data)

            }else{
                alert("未查询到结果")
            }

        }).error(function(){
        });
    };
    $scope.charqeLine();
    //改变现实方式
    window.showTypeChange=function(){
        if($("select[name='showType']").val()=="01"||$("select[name='showType']").val()=="02"){
            //$('html,body').animate({scrollTop: 300+'px'}, 500);
            $("#c1").css("display","none")
            $("#c5").css("display","block")
        }else{
            $('html,body').animate({scrollTop: 0+'px'}, 500);
            $("#c5").css("display","none")
            $("#c1").css("display","block")
        }
        $("#c1").html("");
        $("#c5").html("");
        $scope.charqeLine()
    }
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  自动生成日期
     * </p>
     * @param dreDate：筛选日期集合<br>
     * @param dreDateLast：日期重新组合集合<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var dreDate=[];
    var dreDateLast=[];
    var start = "2017-01-01";
    var end = "2017-12-30";
    function dreMydate(Myobj){
        dreDateLast.splice(0,dreDateLast.length);//清理时间
        dreDate.splice(0,dreDate.length);//清理时间
        if($("input[name='beginDate1']").val()!=""&&$("input[name='beginDate1']").val()!=null&&$("input[name='beginDate1']").val()!=undefined){
            start=""+$("input[name='beginDate1']").val()
        }
        if($("input[name='lessDate1']").val()!=""&&$("input[name='lessDate1']").val()!=null&&$("input[name='lessDate1']").val()!=undefined){
            end=""+$("input[name='lessDate1']").val()
        }
        var startTime = new Date(start);
        var endTime = new Date(end);
        while((endTime.getTime()-startTime.getTime())>=0){
            var year = startTime.getFullYear();
            var month = startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth();
            month=String(Number(month)+1);
            month = month.length<2?"0"+month:month;
            var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
            dreDate.push(year+"-"+month+"-"+day);
            startTime.setDate(startTime.getDate()+1);
        }
        //重置日期集合
        dreDateLast=[];
        for(var z=0;z<dreDate.length;z++){
            var drr={
                "date":dreDate[z]
            };
            dreDateLast.push(drr)
        }
        setDatalineDay(Myobj);
        setDatahistogram(Myobj);
    }
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  制定线性展示内容
     * </p>
     * @param jsonArr：展示数据集合<br>
     * @param idArr：选中对象集合<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var jsonArr=[];
    var mydd=[];
    var idArr=[];
    function setDatalineDay(obj){
        idArr=[];
        jsonArr=[];
        for(var i=0;i<obj.datum.length;i++){
            for(var j=0;j<dreDateLast.length;j++){
                var maKey=obj.datum[i].name;
                //只添加一次key值
                if(i==0){
                    var arr={
                        "maKey":"",
                        "date":""
                    };
                    jsonArr.push(arr);
                }
                //对应时间的字段
                switch ($("select[name='showType']").val()){
                    case "01":
                        for(var k=0;k<obj.datum[i].dailyFeeList.length;k++){
                            if(dreDateLast[j].date==obj.datum[i].dailyFeeList[k].date){
                                jsonArr[j].maKey=obj.datum[i].dailyFeeList[k].total;
                            }
                        };
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
                        for(var k=0;k<obj.datum[i].weekFeeList.length;k++){
                            if(getWeekNumber(dreDateLast[j].date)==obj.datum[i].weekFeeList[k].weekNum){
                                jsonArr[j].maKey=obj.datum[i].weekFeeList[k].total;
                            }
                        };
                        break;
                    case "03":
                        for(var k=0;k<obj.datum[i].dailyFeeList.length;k++){
                            if(dreDateLast[j].date==obj.datum[i].dailyFeeList[k].date){
                                jsonArr[j].maKey=obj.datum[i].dailyFeeList[k].total;
                            }
                        };
                        break;
                    case "04":
                        for(var k=0;k<obj.datum[i].dailyFeeList.length;k++){
                            if(dreDateLast[j].date==obj.datum[i].dailyFeeList[k].date){
                                jsonArr[j].maKey=obj.datum[i].dailyFeeList[k].total;
                            }
                        };
                        break;
                }
                jsonArr[j].date= dreDateLast[j].date;
                jsonArr[j][maKey]=jsonArr[j]["maKey"];
                delete jsonArr[j]["maKey"];
                //jsonArr[j].maKey=mydate2.datum[i].dailyFeeList[j].total;
            }
            idArr.push(maKey)
        }
        aaa(jsonArr)

    }
    // 渲染线形图效果
    function aaa(mydata){
        var Frame = G2.Frame;
        var frame = new Frame(mydata);
        //遍历车位
        switch (idArr.length){
            case 1:
                frame = Frame.combinColumns(frame, [idArr[0]], 'value', 'city', 'date');
                break;
            case 2:
                frame = Frame.combinColumns(frame, [idArr[0],idArr[1],], 'value', 'city', 'date');
                break;
            case 3:
                frame = Frame.combinColumns(frame, [idArr[0],idArr[1],idArr[2]], 'value', 'city', 'date');
                break;
            case 4:
                frame = Frame.combinColumns(frame, [idArr[0],idArr[1],idArr[2],idArr[3],], 'value', 'city', 'date');
                break;
            case 5:
                frame = Frame.combinColumns(frame, [idArr[0],idArr[1],idArr[2],idArr[3],idArr[4]], 'value', 'city', 'date');
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
                alias: '费用（分）',
                formatter: function(val) {
                    return  "￥"+val;
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
                value: 6 // 刻度线长度
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
    /* 区域利用率<br>
     * 功能描述：<br>
     * <p>
     *  制定柱状图显示内容
     * </p>
     * @param histogramArr：展示数据集合<br>
     * 创建者：肖烈 创建时间: 2017-04-19<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var histogramArr=[];
    var histogramIdArr=[]
    function setDatahistogram(obj){
        //清楚上一次数据
        histogramArr=[];
        for(var i=0;i<obj.datum.length;i++){
            var maKey=obj.datum[i].id;
            var arr={
                "name":"",
                "data":["","","","","","","","","","","",""]
            };
            histogramArr.push(arr);
            if($("select[name='showType']").val()=="04"){
                for(var kz=0;kz<obj.datum[i].quarterFeeList.length;kz++){
                    for(var j=0;j<4;j++){
                        if(obj.datum[i].quarterFeeList[kz].quarterNum==j){
                            histogramArr[i].data[j-1]=obj.datum[i].quarterFeeList[kz].total;
                        }

                    }
                }
            }
            else{
                for(var kz=0;kz<obj.datum[i].monthFeeList.length;kz++){
                    for(var j=0;j<13;j++){
                        if(Number(obj.datum[i].monthFeeList[kz].monthNum)==j){
                            histogramArr[i].data[j-1]=obj.datum[i].monthFeeList[kz].total;
                        }

                    }
                }

            }
            histogramArr[i].name= obj.datum[i].name;

        }

        histogramPic(histogramArr);
    }

    //柱状图
    function histogramPic(obj){
        for(var i=0; i < obj.length; i++) {
            var item = obj[i];
            var datas = item.data;
            if($("select[name='showType']").val()=="04"){
                var months = ['第一季度','第二季度','第三季度','第四季度'];
            }
            else{
                var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

            }
            for(var j=0; j < datas.length; j++) {
                item[months[j]] = datas[j];
            }
            var data=[]
            data[i] = item;
        }
        var Stat = G2.Stat;
        var Frame = G2.Frame;
        var frame = new Frame(obj);
        if($("select[name='showType']").val()=="04"){
            frame = Frame.combineColumns(frame, ['第一季度','第二季度','第三季度','第四季度'],'月均收费（单位/分）','月份','name');
        }
        else{
            frame = Frame.combineColumns(frame, ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],'月均收费（单位/分）','月份','name');
        }

        var chart = new G2.Chart({
            id: 'c1',
            forceFit: true,
            height : 350,
            plotCfg: {
                margin: [60,90,60,70]
            }
        });
        chart.source(frame);
        chart.col('name',{alias: '停车位'});
        chart.intervalDodge().position('月份*月均收费（单位/分）').color('name');
        chart.render();
    }
});

