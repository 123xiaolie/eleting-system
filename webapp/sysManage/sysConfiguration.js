var myapp=angular.module("myapp",[]);
myapp.controller("sysConfiguration",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $scope.sysConfigurationMangeseach={};
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].serviceId);
            });
        },
        paging:false,
        ajax: {
            url: "/eleting-web/configuration_management/get_service",
            dataSrc: function (json) {
                $scope.serviceParams = json.datum;
                if(json.code==200&&json.datum!=null){
                    json.recordsTotal = json.datum.length;//总个数
                    json.recordsFiltered = json.datum.length;
                    return json.datum;
                }else{
                    json.recordsTotal = 0;//总个数
                    json.recordsFiltered = 0;
                    return "";
                }
            },
            data: function (params) {
                if(!$scope.sysConfigurationMangeseach.serviceSystem){
                    params.service_system = "";
                }else{
                    params.service_system = encodeURI($scope.sysConfigurationMangeseach.serviceSystem);

                }
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                title: "序号",
                data: function (data, type, row, meta) {
                    return meta.row + 1
                },
                width:"5%"
            },
            {
                data: "serviceSystem",
                title: "应用系统",
                width:"10%"

            },
            {
                data: "servicePath",
                title: "应用路径",
                width:"15%"
            },
            {
                data: "ip",
                title: "ip",
                width:"15%"
            },
            {
                data: "port",
                title: "端口",
                width:"10%"
            },
            {
                data: "moduleName",
                title: "模板名称",
                width:"15%"
            },
            {
                data: "serviceId",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width:"15%"
            },
        ],
    });
    /* 应用服务管理<br>
     * <p> 加载模板内容</p>
     * @param  $scope.sysConfigurationMange：新增内容集合<br>
     * @param  $scope.sysConfigurationMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $http({
        url:"/eleting-web/configuration_management/get_module_info",
        method:"get",
        dataType: "json",
    }).success(function(data){
        $scope.dataBackModel=data.datum;
    }).error(function(){

    });
    /* 应用服务管理<br>
     * @param  $scope.sysConfigurationMange：新增内容集合<br>
     * @param  $scope.sysConfigurationMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //重置
    $scope.modelRepeat=function(){
        $scope.targe=0;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    //
    /* 应用服务管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        for(var j=0;j<$scope.serviceParams.length;j++){
            if($scope.sysConfigurationMange.serviceSystem ==$scope.serviceParams[j].serviceSystem){
                swal({
                    title: "应用系统:" + "【" + $scope.serviceParams[j].serviceSystem + "】" + '已存在；新增失败',
                    type: 'warning',
                    timer: '2000',
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                return false
            }
        }
       $("#myModal").modal('show')
    };
    $scope.modelShowAdd = function(){
        $("#myModal").modal('hide')
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/configuration_management/add_service",
            method:"post",
            dataType: "json",
            params:{module_id:$scope.sysConfigurationMange.moduleId,service_system:encodeURI($scope.sysConfigurationMange.serviceSystem),service_path:$scope.sysConfigurationMange.servicePath,ip:$scope.sysConfigurationMange.ip,port:$scope.sysConfigurationMange.port},
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                $scope.modelRepeat();
                jBox.tip("新增成功", 'info');
            }else{
                jBox.tip("新增失败", 'info');
            }

        }).error(function(){

        });
    }
    /* 应用服务管理<br>
     * 功能描述：<br>
     * <p>
     * s数据回填
     * </p>
     * 创建者：肖烈 创建时间: 2017-07-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate = function(obj){
        updateUse(obj)
    }
    function updateUse(obj){
        $scope.modelRepeat();
        $scope.sysConfigurationMange={};
        $http({
            url:"/eleting-web/configuration_management/get_service_by_id",
            method:"get",
            dataType: "json",
            params:{service_id:obj},
        }).success(function(data){
            $scope.sysConfigurationMange = data.datum;
        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $("#myaupdateModal").modal('show')
    };
    $scope.modelShowUpdate = function(){
        $("#myaupdateModal").modal('hide')
        $http({
            url:"/eleting-web/configuration_management/modify_service",
            method:"post",
            dataType: "json",
            params:{service_id:$scope.sysConfigurationMange.serviceId,module_id:$scope.sysConfigurationMange.moduleId,service_system:encodeURI($scope.sysConfigurationMange.serviceSystem),service_path:$scope.sysConfigurationMange.servicePath,ip:$scope.sysConfigurationMange.ip,port:$scope.sysConfigurationMange.port},
        }).success(function(data){
            $scope.targe=0;
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                $scope.modelRepeat();
                jBox.tip("修改成功", 'info');
            }else{
                jBox.tip("修改失败", 'info');
            }

        }).error(function(){

        });
    }
//    删除
    window.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/configuration_management/delete_service",
                    method:"post",
                    dataType: "json",
                    params:{service_id:data},
                }).success(function(data){
                    $("#grid").dataTable().api().ajax.reload();
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
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $("#grid").dataTable().api().ajax.reload();
        }
    });
});

