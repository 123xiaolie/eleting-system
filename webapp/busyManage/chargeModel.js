var myapp=angular.module("myapp",[]);
myapp.controller("chargeModel",function($scope,$http,$state){
    //初始化表单验证
    $('#myform').bootstrapValidator();
    //$('#myupdateform').bootstrapValidator();
    $scope.chargeModel={};
    $scope.chargeModelSeacher={};
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/chargeModule/getChargeModulePageInfoByCondition",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum*json.datum.pageSize-10;//起始位置
                json.length =json.datum.pageSize;
                for(var i=0;i<json.datum.chargeModuleList.length;i++){
                    json.datum.chargeModuleList[i].createTime=new Date(json.datum.chargeModuleList[i].createTime+28800000).toISOString().slice(0, 10);
                    json.datum.chargeModuleList[i].updateTime=new Date(json.datum.chargeModuleList[i].updateTime+28800000).toISOString().slice(0, 10);
                }
                return json.datum.chargeModuleList;
            },
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.moduleId=$scope.thisModuleId;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                data: "moduleName",
                title: "模板名",
                width:"15%"
            },
            {
                data: "timeInterval",
                title: "时段",
                width:"6%"
            }
            ,
            {
                data: "festivalName",
                title: "节日名称",
                width:"15%"
            },
            {
                data: "festivalDiscount",
                title: "节日折扣",
                width:"10%"
            },
            {
                data: "marketingName",
                title: "营销名称",
                width:"12%"
            },
            {
                data: "marketingDiscount",
                title: "营销折扣",
                width:"7%"
            },
            {
                data: "createTime",
                title: "创建时间",
                width:"12%"
            }
            ,
            {
                data: "unitPrice",
                title: "单价",
                width:"8%"
            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button>';
                    return butt;
                },
                width:"15%"
            }

        ],
    });
    /**
     * 计费模板<br>
     * 功能描述：<br>
     * <p>
     * 加载模板
     * </p>
     * <br>@param $scope.chargeStrategyModuleId：模板新增数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
   function modelLoad(){
        $scope.chargeStrategyModuleId={};
        $scope.chargeStrategyModuleId.pageNum="1";
        $scope.chargeStrategyModuleId.pageSize="10000";
       $http({
           url:"/eleting-web/chargeModule/getModuleLists",
           method:"get",
           dataType: "json",
           params:$scope.chargeStrategyModuleId,
       }).success(function(data){
           $scope.chargeStrategyModuleId=data.datum.datum.list;
       }).error(function(){

       });
   }modelLoad();
    //点击筛选模板
    window.ModuleIdClick=function(event){
        var event = event || window.event;
        var target = event.target || event.srcElement;
        $scope.thisModuleId=target.value;
        $("#grid").dataTable().api().ajax.reload();
        $scope.modelRepeat();//重置表单
    };
    $scope.targe=0;

    //重置
    $scope.modelRepeat=function(){
        $scope.targe=2;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("input[name='moduleId']").removeAttr('disabled','disabled');
        $("input[name='moduleName']").removeAttr('disabled','disabled');
        $("input[name='year']").removeAttr('disabled','disabled');//移除日期禁用
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    /**
     * 计费模板<br>
     * 功能描述：<br>
     * <p>
     * 新增
     * </p>
     * <br>@param $scope.chargeModel：模板新增数据集合
     * <br>@param $scope.targe：限制重复点击标识
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }

        $scope.chargeModel.id=null;
        $("#myModaladdmain").modal('show')

    };
    $scope.modelShowAdd = function(){
        $("#myModaladdmain").modal('hide')
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/chargeModule/add",
            method:"post",
            dataType: "json",
            data:$scope.chargeModel,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")
            if(data.code==200){
                $scope.modelRepeat();
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
                modelLoad()
            } else if(data.code==300003){
                swal({
                    title: '模板已存在;新增失败',
                    type: 'warning',
                    timer:'2000',
                    showCancelButton: false,
                    showConfirmButton:false,
                });
            }
            else{
                jBox.tip("新增失败", 'info');
            }

        }).error(function(){
            jBox.tip("新增失败", 'info');
        });
    }
    /**
     * 计费模板修改<br>
     * 功能描述：<br>
     * <p>
     * 修改模板信息
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     * @author 肖烈
     * @version 1.0.0.0
     */
    window.viewtypeUpdate=function(data){
        updateUse(data)
    };
    function updateUse(obj){
        $scope.modelRepeat();
        $scope.chargeModel={};
        //$("input[name='moduleId']").attr('disabled','disabled');
        //$("input[name='moduleName']").attr('disabled','disabled');
        $http({
            url:"/eleting-web/chargeModule/getChargeModuleById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.chargeModel=data.datum;
        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        };
       $("#myModalupdatemain").modal('show')
    };
    $scope.modelShowUpdate = function(){
        $("#myModalupdatemain").modal('hide')
        $http({
            url:"/eleting-web/chargeModule/update",
            method:"post",
            dataType: "json",
            data:$scope.chargeModel,
        }).success(function(data){
            if(data.code==200){
                modelLoad();
                $scope.modelRepeat();
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            }else{
                jBox.tip("修改失败", 'info');
            }
        }).error(function(){
            jBox.tip("修改失败", 'info');
        });
    }
    //    删除
    /**
     * 计费策略<br>
     * 功能描述：<br>
     * <p>
     * 计费策略删除
     * </p>
     * <br>@param $scope.chargeStrategy：策略新增数据集合
     * <br>@param $scope.targe：限制重复点击标识
     * <br>@param $scope.chargeStrategyModuleId：模板Id集合
     * <br>@param pageNum：当前页码
     * <br>@param pageSize：每条查询条数
     * <br>@param $scope.chargeStrategyModuleId：模板Id集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     * @author 肖烈
     * @version 1.0.0.0
     */
    $scope.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/chargeModule/delete",
                    method:"post",
                    dataType: "json",
                    data:{moduleId:$("select[name='myformRemove']").val()},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    if(data.code==200){
                        modelLoad();
                        //$("#grid").dataTable().api().ajax.reload();
                        $("#grid").dataTable().fnDraw(false);
                        jBox.tip("删除成功", 'info');
                        $('#myModal').modal('hide');
                    }else{
                        jBox.tip("删除失败", 'info');
                    }

                }).error(function(){
                    jBox.tip("链接失败", 'info');
                });

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("删除该策略模板下所有数据，确认删除吗？", "删除提示", submit, { buttons: { '确认': true, '取消': false} });

    };

});
