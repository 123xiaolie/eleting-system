var myapp=angular.module("myapp",[]);
myapp.controller("spChargeStatement",function($scope,$http,$state){
    $scope.tabChexked=function(){
        $scope.charqeLine()
    }
    /* 停车位收费报表<br>
     <p>加载所属区域</p>
     * @param $scope.uniqueMarkFar：码表查询条件集合<br>
     * @param $scope.uniqueMarkShow：码表内容<br>
     * @param pkPosAreaCode：停车位查询条件集合<br>
     * @param pageNum：页码<br>
     * @param pageSize：每页条数<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.uniqueMarkFar={};
    $scope.uniqueMarkFar.pageNum="1";
    $scope.uniqueMarkFar.pageSize="10000";
    $scope.uniqueMarkFar.cityCode=window.localStorage.getItem("cityCode");
    $http({
        url:"/eleting-web/area/getAreaPageInfoByCondition",
        method:"get",
        dataType: "json",
        params:$scope.uniqueMarkFar,
        headers:{
            token:window.localStorage.getItem("token")
        }
    }).success(function(data){
        if(data.code==200){
            $scope.uniqueMarkShow=data.datum.list;
        }
    }).error(function(){
    });
    //改变区域
    window.AreaChange = function(){
        $scope.pkSpcheck();
    };
    $scope.pkSpcheckArr={}
    $scope.pkSpcheck=function(){
        $scope.pkSpcheckArr={}
        $scope.pkSpcheckArr.pkPosAreaCode = $("select[name='ispctArea']").val();
        $scope.pkSpcheckArr.pageNum="1";
        $scope.pkSpcheckArr.pageSize="10000";
        $http({
            url:"/eleting-web/pkIf/getPkIfPageInfoByCondition",
            method:"get",
            params:$scope.pkSpcheckArr,
        }).success(function(data){
            $scope.pkSpcheckArr.pkName=data.datum.list;
        }).error(function(){

        });
    }
    /* 停车位收费报表<br>
     * 功能描述：<br>
     * <p>
     *  查询停车位
     * </p>
     * @param $scope.pkSpNameSeacherArr：停车位查询条件集合<br>
     * @param pkName：停车场名字<br>
     * @param pageNum：当前页码<br>
     * @param pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.pkSpNameSeacherArr={}
    $scope.pkSpNameSeacher=function(){
        var aa=document.getElementById("pkSpcheckArr");
        $scope.pkSpNameSeacherArr.pkName=aa.options[aa.selectedIndex].text;
        $scope.pkSpNameSeacherArr.pageNum="1";
        $scope.pkSpNameSeacherArr.pageSize="10000";
        $http({
            url:"/eleting-web/pkSpIf/getPkSpIfPageInfoByCondition",
            method:"get",
            params:$scope.pkSpNameSeacherArr,
        }).success(function(data){
            $scope.pkSpNameSeacherArr.pkSplaceName=data.datum.pkSpIfList;
        }).error(function(){

        });
    }
    /* 停车位收费报表<br>
     * 功能描述：<br>
     * <p>
     *  查询车位收费情况
     * </p>
     * @param text：选中对象集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
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
    };
    /* 停车位收费报表<br>
     * 功能描述：<br>
     * <p>
     *  查询数据
     * </p>
     * @param $scope.charqeLinearr：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var data;
    var mydate2;
     $scope.charqeLinearr={};
    $scope.charqeLine=function(){
        $("#c1").html("");
        $("#c5").html("");
        $scope.charqeLinearr.start_date="2017-01-01";
        $scope.charqeLinearr.end_date="2017-12-12";
        if($("input[name='']"))
            if($("input[name='beginDate1']").val()!=""&&$("input[name='beginDate1']").val()!=null&&$("input[name='beginDate1']").val()!=undefined){
                $scope.charqeLinearr.start_date=""+$("input[name='beginDate1']").val()
            }
        if($("input[name='lessDate1']").val()!=""&&$("input[name='lessDate1']").val()!=null&&$("input[name='lessDate1']").val()!=undefined){
            $scope.charqeLinearr.end_date=""+$("input[name='lessDate1']").val()
        }
        $scope.picType=$("select[name='showType']").val();
        $scope.charqeLinearr.park_space_id_list=[];
        $scope.charqeLinearr.park_space_name_list=[];
        if(text.length<1){
            var id_list=['507cbf85d3b3411da523476e2ef7c5c1',"507cbf85d3b3411da523476e2ef7c5c2","4e371d6a4f204ae6b0b04a01b2759958"];
            var name_list=['一号停车位',"二号停车位","三号停车位"];
            for(var i=0;i<id_list.length;i++){
                $scope.charqeLinearr.park_space_id_list.push(id_list[i])
                $scope.charqeLinearr.park_space_name_list.push(name_list[i])
            }
        }else{
            for(var i=0;i<text.length;i++){
                $scope.charqeLinearr.park_space_id_list.push(text[i])
                $scope.charqeLinearr.park_space_name_list.push(text[i])
            }
        }
        $http({
            url:"/eleting-web/analyze/park_space_duration_daily_fee",
            method:"post",
            params:$scope.charqeLinearr,
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
    };
    /* 停车位收费报表<br>
     * 功能描述：<br>
     * <p>
     *  自动生成日期
     * </p>
     * @param dreDate：日期区间集合<br>
     * @param dreDateLast：日期重置集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var dreDate=[];
    var dreDateLast=[];
    var start = "2017-01-01";
    var end = "2017-6-30";
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
    /* 停车位收费报表<br>
     * 功能描述：<br>
     * <p>
     *  制定线性展示内容
     * </p>
     * @param jsonArr：展示内容集合<br>
     * @param idArr：展示对象集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var jsonArr=[];
    var idArr=[];
    var mydd=[];
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
    /* 停车位收费报表<br>
     * 功能描述：<br>
     * <p>
     *  制定柱状图显示内容
     * </p>
     * @param histogramArr：展示内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
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

