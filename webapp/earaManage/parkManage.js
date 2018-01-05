var myapp=angular.module("myapp",[]);
myapp.controller("parkManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 停车场管理<br>
     * @param $scope.parkMange：新增内容集合<br>
     * @param $scope.parkMangeMangeseach：查询条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkMange={};
    $scope.parkMangeMangeseach={}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/pkIf/getPkIfPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.pkIfId=$scope.parkMangeMangeseach.pkIfId;
                var cc=window.localStorage.getItem('areaCode');
                if(cc==null||cc==""||cc==undefined){
                    params.pkPosAreaCode=$scope.parkMangeMangeseach.pkPosAreaCode;
                }else{
                    params.pkPosAreaCode=cc;

                }
                params.pkName=$scope.parkMangeMangeseach.pkName;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON",
        },
        columns: [
            {
                data: "pkName",
                title: "停车场名字",
                width:"8%"

            },

            {
                data: "cityCode",
                title: "城市编号",
                width:"5%"
            },
            {
                data: "parkingCode",
                title: "停车场编号",
                width:"6%"
            },
            {
                data: "codeName",
                title: "负责区域",
                width:"6%"
            },
            {
                data: "pkSpAmnt",
                title: "车位数量",
                width:"5%"
            },
            {
                data: "pkPosStreet",
                title: "所在街道",
                width:"10%"
            },
            {
                data: "pkGpsIfLat",
                title: "GPS纬度信息",
                width:"10%"
            },
            {
                data: "pkGpsIfLong",
                title: "GPS经度信息",
                width:"10%"
            },
            {
                data: "chargeRuleId",
                title: "计费策略",
                width:"12%"
            },
            {
                data: "pkStatus",
                title: "停车场状态",
                render:function(data,type,row){
                    if(data=="0"){

                        return "启用";
                    }else{
                        return "停用";
                    }
                },
                width:"8%"
            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width:"10%"
            }

        ],
    });
    /* 停车场管理<br>
     * 功能描述：<br>
     * <p>
     *  高德地图API功能
     * </p>
     * @param  markArry：标记点集合<br>
     * @param  polygonArr：选中点集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var polygonArr = [];
    var markArry = [];
    var targe="0";
    //初始化地图
    var map = new AMap.Map('container', {
        center: [104.066432, 30.549005],
        zoom: 10//放大比例
    });
    //显示放大条
    map.plugin(["AMap.ToolBar", "AMap.Geocoder"], function() {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Geocoder());
    });
    var count = 0,
        clickListener;
    var bind = function() {
        remove(); //防止重复绑定
        polygonArr = [];
        clickListener = AMap.event.addListener(map, "click", _onClick); //绑定地图事件
    }
    var _onClick= function(e) {
        marker = new AMap.Marker({
            position: e.lnglat,
            map: map
        })
        markArry.push(marker);
        map.emit('count', {
            count: count += 1
        }); //触发自定义事件
        polygonArr.push(e.lnglat);
    };
    var remove= function() {
        if (clickListener) {
            AMap.event.removeListener(clickListener); //移除地图事件，以绑定时返回的对象作为参数
            drawGon(polygonArr); //绘制多边形
            //$("input[name='pkGpsIfEnclosure']").val(polygonArr.join(";")) ;//电子围栏
            //polygonArr = [] //清空坐标点数组
        }
    };
    var drawGon=function (Arry) {
        var polygon = new AMap.Polygon({
            path: polygonArr, //设置多边形边界路径
            strokeColor: "#1791fc", //线颜色
            strokeOpacity: 0.2, //线透明度
            strokeWeight: 3, //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.35 //填充透明度
        });
        polygon.setMap(map);
        polygon.on('click', function(e) {
            if (confirm("是否确定以" + e.lnglat + "为中心点?")) {
                regeocoder(e.lnglat);
                $("input[name='pkGpsIfLat']").val(e.lnglat.lat);//纬度
                $("input[name='pkGpsIfLat1']").val(e.lnglat.lat);//纬度
                $("input[name='pkGpsIfLong']").val(e.lnglat.lng); //经度
                $("input[name='pkGpsIfLong1']").val(e.lnglat.lng); //经度
                $("input[name='pkGpsIfEnclosure']").val(polygonArr.join(";")) ;//电子围栏
                $("input[name='pkGpsIfEnclosure1']").val(polygonArr.join(";")) ;//电子围栏
            }
        });
    };
    var regeocoder=function(lnglatXY) { //逆地理编码
        AMap.service('AMap.Geocoder',function(){//回调函数
            //实例化Geocoder
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    geocoder_CallBack(result);
                }
            });
        })
        var marker = new AMap.Marker({ //加点
            map: map,
            position: lnglatXY
        });
        map.setFitView();
    }
    var geocoder_CallBack=function(data) {
        // console.log(data.regeocode.roads);
        //$("select[name='pkPosStreet']").length = 0
        //$("select[name='pkPosStreet1']").val("")
        regeocode = data.regeocode;
        if(data.regeocode.roads.length<1){
            alert("请中心点设置在街道附近");
            return false;
        }
        for (var i = 0, roadsLength = data.regeocode.roads.length; i < roadsLength; i++) {
            $("select[name='pkPosStreet']").append("<option>" + data.regeocode.roads[i].name + "</option>");
            //$("select[name='pkPosStreet1").find("option").remove();
            $("select[name='pkPosStreet1']").append("<option>" + data.regeocode.roads[i].name + "</option>")
        } //加载街道
        //$('#myModal-add .parkAdCode').val(data.regeocode.addressComponent.adcode) //区域化分码
        //$("input[name='pkPosAreaCode']").val(data.regeocode.addressComponent.adcode);
        //$("input[name='pkPosAreaCode1']").val(data.regeocode.addressComponent.adcode);
        $('#myMapModal').modal('hide');
        if(targe=="0"){
            $('#myModal').modal('show');
        }
    }
    //绑定Dom事件
    var button1 = document.getElementById('bt1');
    var listener1 = AMap.event.addDomListener(button1, 'click', bind); //remove
    var button2 = document.getElementById('bt2');
    var listener2 = AMap.event.addDomListener(button2, 'click', remove);

    AMap.event.addDomListener(document.getElementById('clearMarker'), 'click', function() { //清除所有标记点
        map.remove(markArry);//清楚marker标记
        polygonArr = [];//情况所有点
        map.clearMap();//情况所有覆盖区域
    }, false);
//    位置搜索
    window.addressSeach=function(){
        var myaderss=[]
        AMap.service('AMap.Geocoder',function(){//回调函数
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getLocation($scope.addressSeachname, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    map = new AMap.Map('container', {
                        center: [result.geocodes[0].location.lng,result.geocodes[0].location.lat],
                        zoom: 1000//放大比例
                    });
                    var marker = new AMap.Marker({ //加点
                        map: map,
                        center:[result.geocodes[0].location.lng,result.geocodes[0].location.lat]
                    });
                    //显示放大条
                    map.plugin(["AMap.ToolBar", "AMap.Geocoder"], function() {
                        map.addControl(new AMap.ToolBar());
                        map.addControl(new AMap.Geocoder());
                    });
                }else{
                    //获取地址失败
                }
            });
        })


    }
//    修改电子围栏
    $scope.updateMap=function(){
        targe="1";
        $('#myMapModal').modal('show');

    }
    //修改模态框关闭重新给targe赋值
    $('#myUpdateModal').on('hidden.bs.modal', function (e) {
        targe="0";
    })
    /* 停车场管理<br>
     <p>加载所属区域</p>
     * @param $scope.uniqueMarkFar：码表查询条件集合<br>
     * @param $scope.uniqueMarkShow：码表内容<br>
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
        $scope.uniqueMarkShow=data.datum.list
    }).error(function(){

    });
    /* 停车场管理<br>
     * 功能描述：<br>
     * <p>
     *  加载计费策略
     * </p>
     * @param  $scope.parkMangeCharhe：计费策略查询条件集合<br>
     * @param  pageNum：当前页码<br>
     * @param  pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkMangeCharhe={};
    $scope.parkMangeCharhe.pageNum="1";
    $scope.parkMangeCharhe.pageSize="10000";
    $scope.uniqueMarkFar.areaCode=window.localStorage.getItem('areaCode');
    $http({
        url:"/eleting-web/chargeRules/getRuleLists",
        method:"get",
        dataType: "json",
        params: $scope.parkMangeCharhe,
    }).success(function(data){
        $scope.parkMangeCharheShow=data.datum.datum.list;
    }).error(function(){

    });
    /* 停车场管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.parkMange1：修改参数集合<br>
     * @param  pkStatus：停车场状态<br>
     * @param  pkSpAmnt：停车场停车位数量<br>
     * @param  pkPosStreet：所在街道<br>
     * @param  pkGpsIfLat：停车场GPS信息纬度<br>
     * @param  pkGpsIfLong：停车场GPS信息经度<br>
     * @param  pkGpsIfEnclosure：停车场地理电子围栏<br>
     * @param  pkPosAreaCode：停车场所在区域划分代码<br>
     * @param  chargeRuleId：计费策略模板ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.model={};
    $scope.modelShow=function(){
        map.remove(markArry);//清楚marker标记
        polygonArr = [];//情况所有点
        map.clearMap();//情况所有覆盖区域
        $scope.targe=0;
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
    }
    $scope.geoadd=function(){
        $scope.parkMange.pkStatus=$("select[name='pkStatus']").val();
        $scope.parkMange.pkPosStreet=$("select[name='pkPosStreet']").val();
        $scope.parkMange.pkGpsIfLat=$("input[name='pkGpsIfLat']").val();
        $scope.parkMange.pkGpsIfLong=$("input[name='pkGpsIfLong']").val();
        $scope.parkMange.pkGpsIfEnclosure=$("input[name='pkGpsIfEnclosure']").val();
        $scope.parkMange.pkSpAmnt=$("input[name='pkSpAmnt']").val();
        $scope.parkMange.chargeRuleId=$("select[name='chargeRuleId']").val();
        $scope.parkMange.pkPosAreaCode=$("select[name='pkPosAreaCode']").val();
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/pkIf/add",
            method:"post",
            dataType: "json",
            data:$scope.parkMange,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                $('#myModal').modal('hide');
                jBox.tip("新增成功", 'info');
            }else if(data.code==300003){
                jBox.tip("此停车场已存在;新增失败", 'info');
            }
            else{
                jBox.tip("新增失败", 'info');
            }

        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    };
    /* 停车场管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.parkMange1：修改参数集合<br>
     * @param  pkStatus：停车场状态<br>
     * @param  pkPosStreet：所在街道<br>
     * @param  pkGpsIfLat：停车场GPS信息纬度<br>
     * @param  pkGpsIfLong：停车场GPS信息经度<br>
     * @param  pkGpsIfEnclosure：停车场地理电子围栏<br>
     * @param  pkPosAreaCode：停车场所在区域划分代码<br>
     * @param  chargeRuleId：计费策略模板ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkMange1={}
    window.viewUpdate=function(data){
        updateUse(data)

    };
    function updateUse(obj){
        map.remove(markArry);//清楚marker标记
        polygonArr = [];//情况所有点
        map.clearMap();//情况所有覆盖区域
        $scope.targeUpdate=0;
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        $http({
            url:"/eleting-web/pkIf/getPkIfById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.parkMange1=data.datum;
            $("select[name='pkPosStreet1").find("option").remove();
            $("select[name='pkPosStreet1']").append("<option>" + $scope.parkMange1.pkPosStreet + "</option>")
            $('#myUpdateModal').modal('show');
        }).error(function(){

        });
    }
    //保存修改
    $scope.geoUpdate=function(){
        $scope.parkMange1.pkStatus=$("select[name='pkStatus1']").val();
        $scope.parkMange1.pkPosStreet=$("select[name='pkPosStreet1']").val();
        $scope.parkMange1.pkGpsIfLat=$("input[name='pkGpsIfLat1']").val();
        $scope.parkMange1.pkGpsIfLong=$("input[name='pkGpsIfLong1']").val();
        $scope.parkMange1.pkGpsIfEnclosure=$("input[name='pkGpsIfEnclosure1']").val();
        $scope.parkMange1.chargeRuleId=$("select[name='chargeRuleId1']").val();
        $scope.parkMange1.pkPosAreaCode=$("select[name='pkPosAreaCode1']").val();
        //var aa=document.getElementById("pkPosAreaCode1");
        //$scope.parkMange1.areaName=aa.options[aa.selectedIndex].text;
        $scope.targeUpdate=1;
        if($scope.targeUpdate==1){
            $(".updateYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/pkIf/update",
            method:"post",
            dataType: "json",
            data:$scope.parkMange1,
        }).success(function(data){

            if(data.code==200){
                $('#myUpdateModal').modal('hide');
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            }else if(data.code==300003){
                jBox.tip("此停车场已存在;新增失败", 'info');
            }
            else{
                jBox.tip("修改失败", 'info');
            }
        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
//    删除
    window.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/pkIf/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    if(data.code==200){
                        //$("#grid").dataTable().api().ajax.reload();
                        $("#grid").dataTable().fnDraw(false);
                        jBox.tip("删除成功", 'info');
                    }else{
                        jBox.tip("删除失败", 'info');
                    }

                }).error(function(){

                });
            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, { buttons: { '确认': true, '取消': false} });

    };
    //    查询
    $scope.parktabChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $scope.parktabChexked();
        }
    });
});
