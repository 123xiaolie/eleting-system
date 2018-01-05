var myapp = angular.module("myapp", []);
myapp.controller("menuManage", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    /* 菜单管理<br>
     * @param $scope.menuManage：新增内容集合<br>
     * @param $scope.menuManage1：修改内容集合<br>
     * @param $scope.menuManageSeach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.menuManage = {};
    $scope.menuManage1 = {};
    $scope.menuManageSeach = {};
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
                //$(this).addClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function () {
                $(this).addClass('selected');
                $(this).children("td").eq(0).children().prop("checked", true);
                var rows = $("#grid").DataTable().rows('.selected').data();
                if (rows.length != 1) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("只能同时修改一项", "修改提示", submit, {buttons: {'确认': true, '取消': false}});
                    return false
                }
                updateUse(rows[0].menuId);
            });
        },
        ajax: {
            url: "/eleting-web/sys/menu/list",
            data: function (params) {
                params.page = parseInt((params.start + 1) / params.length + 1);
                params.limit = params.length;
                params.text = $scope.menuManageSeach.text;
            },
            contentType: "application/json",
            type: "get",
            dataType: "JSON"
        },
        columns: [
            {
                title: "选择",
                data: "",
                render: function (data, type, row) { // 模板化列显示内容
                    var redio = "<input type='checkbox' />";
                    return redio

                },
                width: "3%"
            },
            {
                data: "text",
                title: "菜单名称",
                width: "15%"
            },
            {
                data: "parentName",
                title: "上级菜单",
                width: "20%"
            },
            {
                data: "url",
                title: "菜单URL",
                width: "32%"
            },
            {
                data: "orderNum",
                title: "排序号",
                width: "5%"
            },
            //{
            //    data: "perms",
            //    title: "授权标识",
            //    width:"25%"
            //},
            {
                data: "type",
                title: "类型",
                render: function (data, type, row) { // 模板化列显示内容
                    switch (data) {
                        case 0:
                            return "目录";
                            break;
                        case 1:
                            return "菜单";
                            break;
                        case 2:
                            return "按钮";
                            break;
                    }
                },
                width: "8%"
            }
        ],
    });
    /* 菜单管理<br>
     <p>新增</p>con
     * @param $scope.guimenuIsShow1：目录栏是否显示属性<br>
     * @param $scope.guimenuIsShow2：菜单栏是否显示属性<br>
     * @param $scope.guimenuIsShow3：按钮栏是否显示属性<br>
     * @param $scope.targe：显示重复点击属性<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.model = {};
    $scope.modelShow = function () {
        $scope.targe = 0;
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
        $(".choseMenu0").prop("checked", true);
        $(".choseMenu1").prop("checked", false);
        $(".choseMenu2").prop("checked", false);
        $scope.guimenuIsShow1 = true;
        $scope.guimenuIsShow2 = false;
        $scope.guimenuIsShow3 = false;
        $scope.menuManage.type = 0;
    };
    //切换类型
    //默认类型
    $scope.menuManage.type = 0;
    $scope.TabCut = function (v) {
        $('#myform').data('bootstrapValidator').resetForm(true);
        switch (v) {
            case "0":
                $scope.guimenuIsShow1 = true;
                $scope.guimenuIsShow2 = false;
                $scope.guimenuIsShow3 = false;
                $scope.menuManage.type = 0;
                break;
            case "1":
                $scope.guimenuIsShow1 = false;
                $scope.guimenuIsShow2 = true;
                $scope.guimenuIsShow3 = false;
                $scope.menuManage.type = 1;
                break;
            case "2":
                $scope.guimenuIsShow1 = false;
                $scope.guimenuIsShow2 = false;
                $scope.guimenuIsShow3 = true;
                $scope.menuManage.type = 2;
                break;
        }
    };
    //选择上级菜单
    $scope.treAddMOdel = function () {
        $http({
            url: "/eleting-web/sys/menu/user",
            method: "get",
            dataType: "json",
        }).success(function (data) {
            getMenuTree(data.datum);
            $('#myaddTreeModal').modal('show');
        }).error(function () {

        });
    }
    function getMenuTree(data) {
        $("#menuTt").tree({
            data: data,
            onClick: function (node) {
                //$("#menuTt").tree("toggle", node.target);
                if (node.id == "1") {
                    $scope.menuManage.parentName = node.text;
                    $scope.menuManage.parentId = node.id;
                    $scope.menuManage.parentType = node.type;
                    $scope.menuManage1.parentName = node.text;
                    $scope.menuManage1.parentId = node.id;
                    $scope.menuManage1.parentType = node.type;
                } else {
                    $scope.menuManage.parentName = node.text;
                    $scope.menuManage.parentId = node.menuId;
                    $scope.menuManage.parentType = node.type;
                    $scope.menuManage1.parentName = node.text;
                    $scope.menuManage1.parentId = node.menuId;
                    $scope.menuManage1.parentType = node.type;
                }
            },
            onLoadSuccess: function (node, data) {
                $("#menuTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                var n = $("#menuTt").tree("getSelected");
                if (n != null) {
                    $("#menuTt").tree("select", n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                    $("#menuTt").tree("toggle", n.target);
                }
                //隐藏根节点
                //    $("#"+$('#menuTt').tree('getRoot').domId).hide();
            }
        });
    }

    //确认上级菜单
    $scope.treeAdd = function () {
        $("input[name='parentName']").val($scope.menuManage.parentName);
        $('#myaddTreeModal').modal('hide');

    };
    $scope.menuManageadd = function () {
        if(!$scope.menuManage.text){
            jBox.tip("名称不能为空", 'info');
            return false
        }
        if(!$scope.menuManage.orderNum){
            jBox.tip("排序号不能为空", 'info');
            return false
        }
        switch ($scope.menuManage.type) {
            case 0:
                if ($scope.menuManage.parentType != 0) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("目录的上级菜单只能为目录类型", "新增提示", submit, {buttons: {'确认': true}});
                    return false;
                }
                break;
            case 1:
                if ($scope.menuManage.parentType != 0) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("菜单的上级菜单只能为目录类型", "新增提示", submit, {buttons: {'确认': true}});
                    return false;
                }
                break;
            case 2:
                if ($scope.menuManage.parentType != 1) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("按钮的上级菜单只能为菜单类型", "新增提示", submit, {buttons: {'确认': true}});
                    return false;
                }
                break;
        }
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $scope.menuManage.icon = "";
        $http({
            url: "/eleting-web/sys/menu/save",
            method: "post",
            dataType: "json",
            data: $scope.menuManage,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $scope.targe = 0;
            $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
            if (data.code == 200) {
                jBox.tip("新增成功", 'info');
                $('#myModal').modal('hide');
                //$("#grid").dataTable().api().ajax.reload();
                window.location.reload();//刷新当前页面.
            } else if (data.code == 300003) {
                jBox.tip("菜单名称已存在；新增失败", 'info');
            }else if(data.code==300004){
                jBox.tip("排序号重复", 'info');
            }
            else {
                jBox.tip("新增失败，输入参数有误，菜单名称、上级菜单、菜单URL均不能为空", 'info');

            }
        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    };
    /* 菜单管理<br>
     <p>修改</p>con
     * @param $scope.targeUpdate：显示重复点击属性<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.UpdateMenu = function () {
        var rows = $("#grid").DataTable().rows('.selected').data();
        if (rows.length > 1) {
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("只能同时修改一项", "修改提示", submit, {buttons: {'关闭': true}});
            return false
        } else if (rows.length == 0) {
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("请选择一项", "修改提示", submit, {buttons: {'关闭': true}});
            return false
        }
        updateUse(rows[0].menuId)
    };
    function updateUse(obj) {
        $scope.targeUpdate = 0;
        var rows = $("#grid").DataTable().rows('.selected').data();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        $http({
            url: "/eleting-web/sys/menu/info/" + obj,
            method: "get",
            dataType: "json",
        }).success(function (data) {
            switch (data.datum.type) {
                case 0:
                    $scope.guimenuIsUpdateShow1 = true;
                    $scope.guimenuIsUpdateShow2 = false;
                    $scope.guimenuIsUpdateShow3 = false;
                    break;
                case 1:
                    $scope.guimenuIsUpdateShow1 = false;
                    $scope.guimenuIsUpdateShow2 = true;
                    $scope.guimenuIsUpdateShow3 = false;
                    break;
                case 2:
                    $scope.guimenuIsUpdateShow1 = false;
                    $scope.guimenuIsUpdateShow2 = false;
                    $scope.guimenuIsUpdateShow3 = true;
                    break;
            }
            $scope.menuManage1 = data.datum;
            $('#myUpdateModal').modal('show');
        }).error(function () {

        });
    }

    //保存修改
    $scope.sysCodeManageUpdate = function () {
        if(!$scope.menuManage1.orderNum){
            jBox.tip("排序号不能为空", 'info');
            return false
        }
        switch ($scope.menuManage1.type) {
            case 0:
                if ($scope.menuManage1.parentType != 0) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("上级菜单只能为目录类型", "新增提示", submit, {buttons: {'确认': true}});
                    return false;
                }
                break;
            case 1:
                if ($scope.menuManage1.parentType != 0) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("上级菜单只能为目录类型", "新增提示", submit, {buttons: {'确认': true}});
                    return false;
                }
                break;
            case 2:
                if ($scope.menuManage1.parentType != 1) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    // 自定义按钮
                    $.jBox.confirm("上级菜单只能为菜单类型", "新增提示", submit, {buttons: {'确认': true}});
                    return false;
                }
                break;
        }
        $scope.targeUpdate = 1;
        if ($scope.targeUpdate == 1) {
            $(".updateYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/sys/menu/update",
            method: "post",
            dataType: "json",
            data: $scope.menuManage1,
        }).success(function (data) {
            $scope.targeUpdate = 0;
            $(".updateYes").removeAttr("disabled", "disabled")//移除禁用属性
            if (data.code == 200) {
                $('#myUpdateModal').modal('hide');
                //$("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
                window.location.reload();//刷新当前页面.
            } else if (data.code == 300003) {
                jBox.tip("菜单名已存在；修改失败", 'info');
            }
            else {
                jBox.tip("新增失败，输入参数有误，菜单名称、上级菜单、菜单URL均不能为空", 'info');
            }

        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    };
    /* 菜单管理<br>
     <p>删除，批量删除</p>con
     * @param rows：被选中的行<br>
     * @param menuIds：被选中的行的ID集合<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.removeMenu = function () {
        var rows = $("#grid").DataTable().rows('.selected').data();
        var menuIds = [];
        if (rows.length <= 0) {
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("请至少选择一项", "删除提示", submit, {buttons: {'确认': true}});
            return false;
        } else {
            for (var i = 0; i < rows.length; i++) {
                menuIds.push(rows[i].menuId)
            }
        }
        for (var k = 0; k < rows.length; k++) {
            if (rows[k].url == "index.content.sysManage/menuManage" && rows[k].text == "菜单管理") {
                swal({
                    title: '菜单管理不可删除',
                    type: 'warning',
                    timer: '1000',
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                return false;
            }
        }

        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/sys/menu/delete",
                    method: "post",
                    dataType: "json",
                    data: menuIds,
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }).success(function (data) {
                    if (data.code == 500) {
                        jBox.tip(data.message, 'info');
                    } else {
                        //$("#grid").dataTable().fnDraw(false);
                        jBox.tip("删除成功", 'info');
                        window.location.reload();//刷新当前页面.
                    }
                }).error(function () {

                });

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});
    };
    /* 菜单管理<br>
     <p>查询、回车键查询</p>con
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.MenutabtypeChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $scope.MenutabtypeChexked()
        }
    });
});
