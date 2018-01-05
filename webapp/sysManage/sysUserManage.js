var myapp=angular.module("myapp",[]);
myapp.controller("sysUserManage",function($scope,$http,$state){
    $(".urlName").scope().urlName = '管理员列表'
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 用户管理<br>
     * @param $scope.sysUserManage：新增内容集合<br>
     * @param $scope.sysUserManage1：修改内容集合<br>
     * @param $scope.sysUserManageSeach：搜索内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.sysUserManage={};
    $scope.sysUserManage1={};
    $scope.sysUserManageSeach={};
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
                if(rows.length>1){
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("只能同时修改一项", "修改提示", submit, { buttons: { '确认': true, '取消': false} });
                    return false
                }
                else if(rows.length<1){
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("请选择任意一项修改", "修改提示", submit, { buttons: { '确认': true, '取消': false} });
                    return false
                }
                $scope.sysUserManage1=rows[0];
                updateUse(rows[0].userId);
            });
        },
        ajax: {
            url: "/eleting-web/sys/user/list",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum*json.datum.pageSize-10;//起始位置
                json.length =json.datum.pageSize;
                for(var i=0;i<json.datum.list.length;i++){
                    json.datum.list[i].createTime=new Date(json.datum.list[i].createTime+28800000).toISOString().slice(0, 10);
                }
                return json.datum.list;
            },
            data: function (params) {
                params.page=parseInt((params.start+1)/params.length+1);
                params.limit=params.length;
                params.username=$scope.sysUserManageSeach.username;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                title:"选择",
                data: function (data, type, row) { // 模板化列显示内容
                    return "<input type='checkbox'/>";
                },
                width:"5%"

            },
            {
                data: "username",
                title: "用户名",
                width:"15%"
            },
            {
                data: "mobile",
                title: "电话",
                width:"15%"
            },
            {
                data: "email",
                title: "邮箱",
                width:"20%"
            },
            {
                data: "areaName",
                title: "所属区域",
                width:"10%"
            },
            {
                data: "createTime",
                title: "时间",
                width:"10%"
            }
            ,
            {
                data: "status",
                title: "状态",
                render: function (data, type, row) { // 模板化列显示内容
                    switch (data){
                        case 0:
                            return "禁用";
                        break;
                        case 1:
                            return "正常";
                            break;
                    }
                },
                width:"10%"
            },
            {
                data: "userId",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-add btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">初始化密码</button>';
                    return butt;
                },
                width:"15%"
            }

        ],
    });
    /* 用户管理<br>
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
    $scope.uniqueMarkFar.pageSize="100000";
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
    /* 用户管理<br>
       <p>新增</p>
     * @param $scope.targe：新增禁用按钮参数<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.modelShow=function(){
        $scope.targe=0;
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        var timestamp = Date.parse(new Date());
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
        $http({
            url:"/eleting-web/sys/role/listForUser",
            method:"get",
            dataType: "json",
        }).success(function(data){
            UserTree(data.datum)
        }).error(function(){
        });
    }
    //加载角色树
    function UserTree(data){
        $("#UserTt").tree({
            data: data,
            onClick: function(node) {
                // toggle
                $("#UserTt").tree("toggle", node.target);
            },
            onLoadSuccess:function(node,data){
                //隐藏根节点
                //$("#"+$('#UserTt').tree('getRoot').domId).hide();
                $("#UserTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                var n = $("#UserTt").tree("getSelected");
                if(n!=null){
                    $("#UserTt").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                    $("#UserTt").tree("toggle",n.target);
                }
            }
        });
    }
    $scope.sysUserAdd=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        var nodes = $('#UserTt').tree('getChecked');
        var s = [];
        for(var i=0; i<nodes.length; i++){
            s.push(nodes[i].roleId)
        }
        $scope.sysUserManage.status=$("select[name='status']").val();
        $scope.sysUserManage.areaCode=$("select[name='areaCode']").val();
        var aa=document.getElementById("areaCode");
        $scope.sysUserManage.areaName=aa.options[aa.selectedIndex].text;
        $scope.sysUserManage.roleIdList=s;
        $http({
            url:"/eleting-web/sys/user/save",
            method:"post",
            dataType: "json",
            data:$scope.sysUserManage,
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")
            switch (data.code){
                case 500:
                    swal({
                        title: data.message,
                        type: 'warning',
                        timer:'2000',
                        showCancelButton: false,
                        showConfirmButton:false,
                    });
                    $scope.targe=0;
                    break;
                case 200:
                    $("#grid").dataTable().api().ajax.reload();
                    $('#myModal').modal('hide');
                    jBox.tip("新增成功", 'info');
                    break;
                case 300003:
                    jBox.tip("电话号码已经被使用，新增失败", 'info');
            };


        }).error(function(){

        });
    }
    /* 用户管理<br>
     <p>修改</p>
     * @param $scope.targeUpdate：新增禁用按钮参数<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.viewUserUpdate=function(data){

        var rows = $("#grid").DataTable().rows('.selected').data();
        if(rows.length<1){
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("请选择任意一项修改", "修改提示", submit, { buttons: { '确认': true} });
            return false
        }else if(rows.length>1){
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("只能同时修改一项", "修改提示", submit, { buttons: { '确认': true} });
            return false
        }
        updateUse(rows[0].userId);
        $scope.sysUserManage1=rows[0];
    };
    function updateUse(obj){
        $scope.targeUpdate=0;
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        //加载修改菜单树
        $http({
            url:"/eleting-web/sys/role/listForUser",
            method:"get",
            dataType: "json",
            params:{userId:obj},
        }).success(function(data){
            $('#myUpdateModal').modal('show');
            UserUpdateTree(data.datum)
        }).error(function(){

        });
        $('#myUpdateModal').modal('show');
    }
    function UserUpdateTree(data){
        $("#UserUpdateTt").tree({
            lines:true,
            data: data,
            onClick: function(node) {
                // toggle
                $("#UserUpdateTt").tree("toggle", node.target);
            },
            onLoadSuccess:function(node,data){
                //隐藏根节点
                //$("#"+$('#remarkUpdateTt').tree('getRoot').domId).hide();
                $("#UserUpdateTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                var n = $("#UserUpdateTt").tree("getSelected");
                if(n!=null){
                    $("#UserUpdateTt").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                    $("#UserUpdateTt").tree("toggle",n.target);
                }
            }
        });
    }
    //保存修改
    $scope.sysUserManage1={}
    $scope.sysUserUpdate=function(){
        $scope.targeUpdate=1;
        if($scope.targeUpdate==1){
            $(".updateYes").attr("disabled","disabled")
        }
        var nodes = $('#UserUpdateTt').tree('getChecked');
        var ss = [];
        for(var i=0; i<nodes.length; i++){
            ss.push(nodes[i].roleId)
        }
        $scope.sysUserManage1.status=$("select[name='status1']").val();
        $scope.sysUserManage1.roleIdList=ss;
        $scope.sysUserManage1.areaCode=$("select[name='areaCode1']").val();
        var aa=document.getElementById("areaCode1");
        $scope.sysUserManage1.areaName=aa.options[aa.selectedIndex].text;
        $http({
            url:"/eleting-web/sys/user/update",
            method:"post",
            dataType: "json",
            data:$scope.sysUserManage1,
        }).success(function(data){
            $scope.targeUpdate=0;
            $(".updateYes").removeAttr("disabled","disabled")
            if(data.code==200){
                $('#myUpdateModal').modal('hide');
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            }else  if(data.code==300003){
                jBox.tip("手机号已经被使用，修改失败", 'info');
            }
            else{
                jBox.tip("修改失败", 'info');
            }

        }).error(function(){
            $('#myUpdateModal').modal('hide');
            $("#grid").dataTable().fnDraw(false);
            jBox.tip("修改失败", 'info');
        });
    };
    /* 用户管理<br>
     <p>删除</p>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
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
        var  userIds=[];
        for(var j=0;j<rows.length;j++){
            userIds.push(rows[j].userId)
        }
        removeUserMenu( userIds)
    };
    function removeUserMenu(obj){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/sys/user/delete",
                    method:"post",
                    dataType: "json",
                    data:obj,
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
    }
    /* 用户管理<br>
     <p>初始化密码</p>con
     * @param $scope.initialize：初始化密码内容集合<br>
     * @param password：原始密码<br>
     * @param newPassword：新密码<br>
     * @param userId：用户ID<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.initialize={};
    window.viewUpdate=function(obj){
        var submit = function (v, h, f) {
            if (v == true){
                $scope.initialize.userId=obj;
                $http({
                    url:"/eleting-web/sys/user/initPassword",
                    method:"post",
                    dataType: "json",
                    data:$scope.initialize,
                }).success(function(data){
                    $("#grid").dataTable().api().ajax.reload();
                    jBox.tip("初始化成功", 'info');
                }).error(function(){
                })
            }
            return true;
        };
        // 自定义按钮
        $.jBox.confirm("初始化后密码为：123456；确认初始化吗？", "初始化提示", submit, { buttons: { '确认': true, '取消': false} });
       }
    /* 管理员列表<br>
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
