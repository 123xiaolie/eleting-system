var myapp=angular.module("myapp",[]);
myapp.controller("equipModelManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myUpdateModal').bootstrapValidator();
    /* 设备型号管理<br>
     *<p>加载厂商<p/>
     * @param $scope.equipModelManage：新增内容集合<br>
     * @param $scope.equipModelManageSeach：筛选内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //加载码表
    $scope.equipModelFac={};
    $scope.equipModelFacShow={}
    $scope.equipModelFac.uniqueMarks=['provider-dc','provider-wg','provider-zjq','provider-scsb','provider-pda','provider-dyj'];
    $scope.equipModelFac.pageNum="1";
    $scope.equipModelFac.pageSize="10000";
    $http({
        url:"/eleting-web/codeTable/getCodeTablePageInfoByConditionForProvider",
        method:"get",
        dataType: "json",
        params:$scope.equipModelFac,
        headers:{
            token:window.localStorage.getItem("token")
        }
    }).success(function(data){
        $scope.equipModelFacShow=data.datum.list
    }).error(function(){

    });
    $scope.equipModelManage={};
    $scope.equipModelManageSeach={};

    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                //updateUse(rows[0].id);
            });
            $("#grid >tbody >tr").dblclick(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/epModel/getEpModelPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.deviceTypeName=$scope.equipModelManageSeach.deviceTypeName;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
        {
            data: "deviceTypeName",
            title: "设备类型名称",
            width:"25%"
        },
        {
            data: "providerName",
            title: "厂商名称",
            width:"35%"
        },

        {
            data: "model",
            title: "型号",
            width:"20%"
        },
        {
            data: "id",
            title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewtypeRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width:"20%"
            }

            ],
        });
    //重置
    $scope.modelRepeat=function(){
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        //    $('#myform').data('bootstrapValidator').resetForm(true);
    };
    /* 设备型号管理<br>
     <p>新增</p>con
     * @param $scope.targe：显示重复点击属性<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     window.EquipModelCode = function(){
        var str = document.getElementById("deviceTypeName").value.trim();
        if(str == "") return;
        var arrRslt = makePy(str);
        $("input[name='deviceTypeCode']").val(arrRslt[0].toLowerCase())
    };
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $('#myModal').modal('show');
    }
    $scope.modelShowAdd = function(){
        $('#myModal').modal('hide');
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        var aa=document.getElementById("providerName");
        $scope.equipModelManage.providerName=aa.options[aa.selectedIndex].text;
        $scope.equipModelManage.id=null;
        $scope.equipModelManage.deviceTypeCode = $("input[name='deviceTypeCode']").val();
        $http({
            url:"/eleting-web/epModel/add",
            method:"post",
            dataType: "json",
            data:$scope.equipModelManage,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")
            if(data.code==405){
                jBox.tip("设备已存在，新增失败", 'info');
            }else if(data.code==200){
                $scope.targe=0;
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat()
            }else{
                jBox.tip("新增失败", 'info');
            }

            //$('#myform').data('bootstrapValidator').resetForm(true);
        }).error(function(){

        });

    }
    /* 设备型号管理<br>
     <p>修改</p>con
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     window.viewtypeUpdate=function(data){
        updateUse(data)
    };
    function updateUse(obj){
        $scope.modelRepeat()
        $scope.equipModelManage={}
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        $http({
            url:"/eleting-web/epModel/getEpModelById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.equipModelManage=data.datum;
        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $('#myUpdateModal').modal('show');
    }
    $scope.modelShowSave=function(){
        $('#myUpdateModal').modal('hide');
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.equipModelManage.id=rows[0].id;
        var aa=document.getElementById("providerName");
        $scope.equipModelManage.providerName=aa.options[aa.selectedIndex].text;
        $scope.equipModelManage.deviceTypeCode = $("input[name='deviceTypeCode']").val();
        $http({
            url:"/eleting-web/epModel/update",
            method:"post",
            dataType: "json",
            data:$scope.equipModelManage,
        }).success(function(data){
            if(data.code==200){
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                document.getElementById("myform").reset();
                jBox.tip("修改成功", 'info');
                $scope.equipModelManage={}
            }else{
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改失败", 'info');
            }

        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
//    删除
window.viewtypeRemove=function(data){
    var submit = function (v, h, f) {
        if (v == true)
            $http({
                url:"/eleting-web/epModel/delete",
                method:"post",
                dataType: "json",
                data:{id:data},
                headers:{
                    token:window.localStorage.getItem("token")
                }
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
    /* 菜单管理<br>
     <p>查询、回车键查询</p>con
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     $scope.tabtypeChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
    $(document).keypress(function(e) {

        // 回车键事件
        if(e.which == 13) {
            stopDefault()
            $("#grid").dataTable().api().ajax.reload();
        }
    });
    //阻止浏览器的默认行为
    function stopDefault( e ) {
        //阻止默认浏览器动作(W3C)
        if ( e && e.preventDefault )
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
        return false;
    }
});
