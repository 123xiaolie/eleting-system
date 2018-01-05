var myapp=angular.module("myapp",[]);
myapp.controller("sysCodeableManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myUpdateModal').bootstrapValidator();
    /* 码表维护<br>
     * @param $scope.sysCodeManage：新增内容集合<br>
     * @param $scope.sysCodeManage1：修改内容集合<br>
     * @param $scope.sysCodeSeachManage：筛选内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.sysCodeManage={};
    $scope.sysCodeSeachManage={};
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                //updateUse(rows[0].id);
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/codeTable/getCodeTablePageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.uniqueMark=$scope.sysCodeSeachManage.uniqueMark;
                //params.name=$scope.sysCodeSeachManage.name;
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
                data: "uniqueMark",
                title: "类型标识",
                width:"20%"
            },

            {
                data: "name",
                title: "名称",
                width:"20%"
            },
            {
                data: "code",
                title: "编码",
                width:"10%"
            },

            {
                data: "isForbid",
                title: "是否禁用",
                render: function (data, type, row) { // 模板化列显示内容
                   switch (data){
                       case "0":
                           return '否';
                       break;
                       case "1":
                           return '是'
                   }
                },
                width:"10%"
            },
            {
                data: "remark",
                title: "备注",
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
    /* 码表维护<br>
     <p>新增</p>con
     * @param $scope.targe：显示重复点击属性<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
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
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.sysCodeManage.id=null;

        $scope.sysCodeManage.isForbid=$("select[name='isForbid']").val();
        $('#myModal').modal('show');
    };
    $scope.modelShowAdd = function(){
        $('#myModal').modal('hide');
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }

        $http({
            url:"/eleting-web/codeTable/add",
            method:"post",
            dataType: "json",
            data:$scope.sysCodeManage,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat()
            }else if(data.code==300003){
                jBox.tip("新增片区或者片区编码已存在", 'info');
            }else{
                jBox.tip("新增失败", 'info');
            }
        }).error(function(){
            jBox.tip("链接失败", 'info');
        });

    }
    /* 码表维护<br>
     <p>修改</p>con
     * @param $scope.targeUpdate：显示重复点击属性<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewtypeUpdate=function(data){
        updateUse(data)
    };
    function updateUse(obj){
        $scope.modelRepeat()
        $scope.sysCodeManage={};
        $http({
            url:"/eleting-web/codeTable/getCodeTableById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.sysCodeManage=data.datum;
            $("select[name='isForbid']").val($scope.sysCodeManage.isForbid)
        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave=function(){
        $scope.sysCodeManage.isForbid = $("select[name='isForbid']").val();
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $('#myUpdateModal').modal('show');
    }
    $scope.sysCodeManageUpdate = function(){
        $('#myUpdateModal').modal('hide');
        $http({
            url:"/eleting-web/codeTable/update",
            method:"post",
            dataType: "json",
            data:$scope.sysCodeManage,
        }).success(function(data){
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("修改成功", 'info');
                $scope.modelRepeat()
            }else if(data.code==300003){
                jBox.tip("片区已存在或者片区编码重复", 'info');
            }
            else{
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
                    url:"/eleting-web/codeTable/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    if(data.code==200){
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
    /* 菜单管理<br>
     <p>查询、回车键查询</p>con
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.CodetabtypeChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $scope.CodetabtypeChexked()
        }
    });
});
