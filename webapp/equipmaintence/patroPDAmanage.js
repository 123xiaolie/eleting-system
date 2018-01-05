var myapp=angular.module("myapp",[]);
myapp.controller("patroPDAmanage",function($scope,$http,$state){
    //初始化验证
    $('#myupdateform').bootstrapValidator();
    /* 巡视员PDA管理<br>
     * @param  $scope.patroPDAMange：新增内容集合<br>
     * @param  $scope.patroPDAMangeseach：筛选内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-23<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.patroPDAMange={};
    $scope.patroPDAMangeseach={}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
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
            url: "/eleting-web/epPdaIf/getEpPdaIfPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.epPdaName=$scope.patroPDAMangeseach.epPdaName;
                params.providerId=$scope.patroPDAMangeseach.provider;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                data: function (data, type, row, meta) {
                    return meta.row + 1
                },
                title: "序号",
                width:"4%"

            },
            {
                data: "epPdaName",
                title: "设备pda名字",
                width:"8%"
            },
            {
                data: "epPdaModelNo",
                title: "设备pda型号",
                width:"8%"
            },
            {
                data: "provider",
                title: "设备pda生产商",
                render: function (data, type, row) { // 模板化列显示内容
                    if(data=='SIM'){
                        return '深圳成为'
                    }else{
                        return data
                    }
                },
                width:"15%"
            },
            {
                data: "epPdaPhone",
                title: "电话号码",
                width:"10%"
            },
            {
                data: "areaName",
                title: "片区",
                width:"14%"
            },
            {
                data: "epPdaEsn",
                title: "设备pdaESN",
                width:"8%"

            },
            {
                data: "epPdaSoftVer",
                title: "设备软件版本",
                width:"6%"
            },
            {
                data: "epPdaMacAdr",
                title: "设备MAC地址",
                width:"10%"
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
    /* PDA设备管理<br>
     * 功能描述：<br>
     * <p>
     *  筛选片区
     * </p>
     * @param  $scope.uniqueMarkFar：厂商查询条件集合<br>
     * @param  pageNum：当前页码<br>
     * @param  pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //切换验证码
    $scope.codeImageSrc="eleting-web/captcha.jpg_pda";
    $scope.flushValidateCode=function (){
        //点击切换验证码
        var now= Math.random();
        $scope.codeImageSrc="eleting-web/captcha.jpg_pda?time="+now;
    };
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
    /* 巡视员PDA管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.patroPDAMange1：修改内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate=function(data){
        updateUse(data)

    };
    function updateUse(obj){
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $http({
            url:"/eleting-web/epPdaIf/getEpPdaIfById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.patroPDAMange1=data.datum;
            //$("input[name='areaName']").val(window.localStorage.getItem('areaName'))
            $('#myUpdateModal').modal('show');
        }).error(function(){

        });
    }
    //保存修改
    $scope.geoUpdate=function(){
        $http({
            url:"/eleting-web/epPdaIf/update",
            method:"post",
            dataType: "json",
            data:$scope.patroPDAMange1,
        }).success(function(data){
            if(data.code==200){
                $('#myUpdateModal').modal('hide');
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            }else{
                jBox.tip("修改失败", 'info');
            }
        }).error(function(){
            $('#myUpdateModal').modal('hide');
            $("#grid").dataTable().fnDraw(false);
            jBox.tip("修改失败", 'info');
        });
    }
//    删除
    window.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/epPdaIf/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("删除成功", 'info');
                }).error(function(){

                });
            else
                jBox.tip("删除失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, { buttons: { '确认': true, '取消': false} });

    };
    //    查询
    $scope.tabChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
//    $(document).keypress(function(e) {
//        // 回车键事件
//        if(e.which == 13) {
//            $("#grid").dataTable().api().ajax.reload();
//        }
//    });
});
