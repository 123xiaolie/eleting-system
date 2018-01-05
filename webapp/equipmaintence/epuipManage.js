var myapp=angular.module("myapp",[]);
myapp.controller("epuipManage",function($scope,$http,$state){
    //激活表单验证
    $('#myform').bootstrapValidator();//必须有
    /**
     * 设备固件管理<br>
     * 功能描述：<br>
     * <p>
     * PDA管理
     * </p>
     * <br>$scope.equip：设备查询参数集合
     * <br>$scope.equipManageSeach：设备查询搜索条件集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     */
    $scope.equip={};
    $scope.equipManageSeach={};
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                //if ($(this).hasClass('selected')) {
                //    $(this).removeClass('selected');
                //}
                //else {
                //    $('#grid').DataTable().$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                //}
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/epGemFirmware/getEpGemFirmwarePageInfoByCondition",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum*json.datum.pageSize-10;//起始位置
                json.length =json.datum.pageSize;
                for(var i=0;i<json.datum.list.length;i++){
                    json.datum.list[i].uploadTime=new Date(json.datum.list[i].uploadTime+28800000).toISOString().slice(0, 10)+"&nbsp;"+new Date(json.datum.list[i].uploadTime+28800000).toISOString().slice(11, 19);
                }
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.firmwareName=$scope.equipManageSeach.firmwareName;
                params.providerId=$("select[name='uniqueMarkShow']").val();
                $scope.equip.pageNum=params.pageNum;
                $scope.equip.pageSize=params.pageSize;
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
                data: "firmwareName",
                title: "设备固件名称",
                width:"15%"
            },
            {
                data: "provider",
                title: "设备厂商",
                width:"10%"
            },
            {
                data: "version",
                title: "设备固件版本号",
                width:"15%"
            },
            {
                data: "uploadTime",
                title: "上传日期",
                width:"15%"
            },
            {
                data: "url",
                title: "固件下载地址",
                width:"15%"
            },
            {
                data: "deviceId",
                title: "设备关联ID",
                width:"10%"
            }
            ,
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                    //'<a style="cursor: pointer" onclick="deleteBaseInspection(\''+data+'\')">删除</a>';//转义传值
                },
                width:"20%"
            }

        ],
    });
    //筛选厂商
    /**
     * 设备固件管理<br>
     * 功能描述：<br>
     * <p>
     * PDA管理
     * </p>
     * <br>$scope.uniqueMarkFa：厂商查询条件集合
     * <br>uniqueMark：唯一标识
     * <br>pageNum：页码
     * <br>pageSize：单页总条数
     * <br>$scope.uniqueMarkShow：厂商查询结果集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     */
    $scope.uniqueMarkFar={};
    $scope.uniqueMarkFar.uniqueMarks=['provider-dc','provider-wg','provider-scsb','provider-dyj','provider-zjq'];
    $scope.uniqueMarkFar.pageNum="1";
    $scope.uniqueMarkFar.pageSize="10000";
    $http({
        url:"/eleting-web/codeTable/getCodeTablePageInfoByConditionForProvider",
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
    //重置
    $scope.modelRepeat=function(){
        $scope.targe=0;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
//    新增
    /**
     * 设备固件管理<br>
     * 功能描述：<br>
     * <p>
     * 设备固件新增
     * </p>
     * <br>$scope.targ：限制重复点击标识
     * <br>uploadTimeShow：日期
     * <br>provider：唯一标识
     * <br>providerId：厂商id
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     */
        //跟新时间
    $scope.datareset=function(){
        var timestamp = Date.parse(new Date());
        $scope.equip.uploadTimeShow=new Date(timestamp+28800000).toISOString().slice(0, 10)+" "+new Date(timestamp+28800000).toISOString().slice(11, 19);
        $scope.equip.uploadTime=timestamp;
    };
    $scope.model={};
    $scope.modelShow=function(){
        var aa=document.getElementById("epuipPdtr");
        $scope.equip.provider=aa.options[aa.selectedIndex].text;
        $scope.equip.providerId=$("select[name='provider']").val();
        $scope.equip.id=null;
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $('#myModal').modal('show');
    }

    $scope.equipadd=function(){
        $('#myModal').modal('hide');
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/epGemFirmware/add",
            method:"post",
            dataType: "json",
            data:$scope.equip,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=1;
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat();
            }else {
                jBox.tip("新增失败", 'info');

            }

        }).error(function(){

        });
    }
//    修改
    /**
     * 设备固件管理<br>
     * 功能描述：<br>
     * <p>
     * PDA新增
     * </p>
     * <br>$scope.equip1：修改数据集合
     * <br>$scope.targeUpdate：限制重复点击标识
     * <br>uploadTimeShow：日期
     * <br>provider：唯一标识
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     */
    window.viewUpdate=function(data){
        updateUse(data)
    };
    function updateUse(obj){
        $scope.equip = {}//清楚原始数据
        $http({
            url:"/eleting-web/epGemFirmware/getEpGemFirmwareById",
            method:"get",
            dataType: "json",
            params:{id:obj}
        }).success(function(data){
            $scope.equip=data.datum;
            $scope.equip.uploadTimeShow=new Date($scope.equip.uploadTime+28800000).toISOString().slice(0, 10)+" "+new Date($scope.equip.uploadTime+28800000).toISOString().slice(11, 19);
        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave = function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var aa=document.getElementById("epuipPdtr");
        $scope.equip.provider=aa.options[aa.selectedIndex].text;
        $scope.equip.providerId=$("select[name='provider']").val();
        $('#myUpdateModal').modal('show');

    }
    $scope.equipUpdate=function(){
        $('#myUpdateModal').modal('hide');
        $http({
            url:"/eleting-web/epGemFirmware/update",
            method:"post",
            dataType: "json",
            data:$scope.equip,
        }).success(function(data){
            console.log("失败返回",data)
            if(data.code==200){
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
                $scope.modelRepeat();
            }else{
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改失败", 'info');
            }
        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    };
//    删除
    window.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/epGemFirmware/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    //$("#grid").dataTable().api().ajax.reload();
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
        console.log("31232132132",$scope.equip);
        $http({
            url:"/eleting-web/epGemFirmware/getEpGemFirmwarePageInfoByCondition",
            method:"get",
            dataType: "json",
            params:$scope.equip,
        }).success(function(data){
            $("#grid").dataTable().api().ajax.reload();
        }).error(function(){

        });
    }
    //    回车键查询
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $("#grid").dataTable().api().ajax.reload();
        }
    });

});
