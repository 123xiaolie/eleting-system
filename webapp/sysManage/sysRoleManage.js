var myapp=angular.module("myapp",[]);
myapp.controller("sysRoleManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    $scope.sysRoleMange={}
    $scope.sysRoleMangeseach={}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    $(this).children("td").eq(0).children().prop("checked", false);
                }
                else {
                    $(this).addClass('selected');
                }
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).addClass('selected');
                $(this).children("td").eq(0).children().prop("checked", true);
                var rows = $("#grid").DataTable().rows('.selected').data();
                if(rows.length!=1){
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("只能同时修改一项", "修改提示", submit, { buttons: { '确认': true, '取消': false} });
                    return false
                }
                updateUse(rows[0].roleId);
            });
        },
        ajax: {
            url: "/eleting-web/sys/role/list",
            data: function (params) {
                params.page=parseInt((params.start+1)/params.length+1);
                params.limit=params.length;
                params.roleName=$scope.sysRoleMangeseach.roleName;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                title: "选择",
                data: function (data, type, row, meta) {
                    return "<input type='checkbox'/>"
                },
                width:"5%"

            },
            {
                data: "roleId",
                title: "角色ID",
                width:"15%"
            },
            {
                data: "text",
                title: "角色名称",
                width:"25%"
            },
            {
                data: "remark",
                title: "备注",
                width:"55%"
            }

        ],
    });
    //    新增
    $scope.model={};
    $scope.modelShow=function(){
        $scope.targe=0;
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        var timestamp = Date.parse(new Date());
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
        $('#myModal').modal('show');
            $http({
               url:"/eleting-web/sys/menu/perms",
               method:"get",
                dataType: "json",
                }).success(function(data){
                remarkTree(data.datum)
                }).error(function(){
              });
    };
    //加载授权树
    function remarkTree(data){
        $("#remarkTt").tree({
            lines:true,
            data: data,
            onClick: function(node) {
                // toggle
                $("#remarkTt").tree("toggle", node.target);
                console.log("打印节点",node)
            },
            onLoadSuccess:function(node,data){
                //隐藏根节点
                $("#"+$('#remarkTt').tree('getRoot').domId).hide();
                $("#remarkTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                var n = $("#remarkTt").tree("getSelected");
                if(n!=null){
                    $("#remarkTt").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                    $("#remarkTt").tree("toggle",n.target);
                }
            }
        });
    }
    //新增提交
    $scope.sysRoleAdd=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var nodes = $('#remarkTt').tree('getChecked');
        var s = [];
        for(var i=0; i<nodes.length; i++){
            s.push(nodes[i].menuId)
        }
        $scope.sysRoleMange.menuIdList=s;
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/sys/role/save",
            method:"post",
            dataType: "json",
            data:$scope.sysRoleMange,
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                $('#myModal').modal('hide');
                jBox.tip("新增成功", 'info');
            }else if(data.code==300003){
                jBox.tip("角色已存在；新增失败", 'info');
            }else {
                jBox.tip("系统错误；新增失败", 'info');
            }
        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
    // 修改
    $scope.sysRoleMange1={};
    $scope.viewRoleUpdate=function(data){
        var rows = $("#grid").DataTable().rows('.selected').data();
        updateUse(rows[0].roleId)
    };
    function updateUse(obj){
        var rows = $("#grid").DataTable().rows('.selected').data();
        if(rows.length>1){
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("只能同时修改一项", "修改提示", submit, { buttons: { '确认': true} });
            return false
        }else if(rows.length==0){
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("请选择修改项", "修改提示", submit, { buttons: { '确认': true} });
            return false
        }
        $scope.targeUpdate=0;
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        $("input[name='remark1']").val(rows[0].remark);
        $("input[name='text1']").val(rows[0].text);
        //加载修改菜单树
        $http({
            url:"/eleting-web/sys/menu/perms",
            method:"get",
            dataType: "json",
            params:{roleId:obj},
        }).success(function(data){
            $('#myUpdateModal').modal('show');
            remarkUpdateTree(data.datum)
        }).error(function(){

        });
        $('#myUpdateModal').modal('show');
    }
    function remarkUpdateTree(data){
        $("#remarkUpdateTt").tree({
            lines:true,
            data: data,
            onClick: function(node) {
                // toggle
                $("#remarkUpdateTt").tree("toggle", node.target);
                console.log(node)
            },
            onLoadSuccess:function(node,data){
                //隐藏根节点
                $("#"+$('#remarkUpdateTt').tree('getRoot').domId).hide();
                $("#remarkUpdateTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                var n = $("#remarkUpdateTt").tree("getSelected");
                if(n!=null){
                    $("#remarkUpdateTt").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                    $("#remarkUpdateTt").tree("toggle",n.target);
                }
            }
        });
    }
    //保存修改
    $scope.sysRoleUpdate=function(){
        $scope.targeUpdate=1;
        if($scope.targeUpdate==1){
            $(".updateYes").attr("disabled","disabled")
        }
        var nodes = $('#remarkUpdateTt').tree('getChecked');
        var ss = [];
        for(var i=0; i<nodes.length; i++){
            ss.push(nodes[i].menuId)
        }
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.sysRoleMange1.roleId=rows[0].roleId
        $scope.sysRoleMange1.remark=$("input[name='remark1']").val();
        $scope.sysRoleMange1.text=$("input[name='text1']").val();
        $scope.sysRoleMange1.menuIdList=ss;
        console.log($scope.sysRoleMange1)
        $http({
            url:"/eleting-web/sys/role/update",
            method:"post",
            dataType: "json",
            data:$scope.sysRoleMange1,
        }).success(function(data){
            $scope.targeUpdate=0;
            $(".updateYes").removeAttr("disabled","disabled")
            if(data.code==200){
                $('#myUpdateModal').modal('hide');
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            }else if(data.code==300003){
                jBox.tip("角色已存在，修改失败", 'info');
            }
            else{
                jBox.tip("系统错误；修改失败", 'info');
            }

        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
    //    删除
    $scope.viewRoleRemove=function(){
        var rows = $("#grid").DataTable().rows('.selected').data();
        if(rows.length<1){
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("至少选择一项", "删除提示", submit, { buttons: { '确认': true} });
            return false
        }
        var roleIds=[];
        for(var j=0;j<rows.length;j++){
            roleIds.push(rows[j].roleId)
        }
        removeRoleMenu(roleIds)
    };
    function removeRoleMenu(obj){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/sys/role/delete",
                    method:"post",
                    dataType: "json",
                    data:obj,
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
    }
    /* 用户管理<br>
     <p>查询、回车键查询</p>con
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.tabtypeChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
    //$(document).keypress(function(e) {
    //    // 回车键事件
    //    if(e.which == 13) {
    //        $("#grid").dataTable().api().ajax.reload();
    //    }
    //});
});
