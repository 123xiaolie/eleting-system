var myapp = angular.module("myapp", []);
myapp.controller("equipRepairManage", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 设备维修管理<br>
     * @param  $scope.equipRepairMange：新增内容集合<br>
     * @param  $scope.equipRepairMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.equipRepairMange = {};
    $scope.equipRepairMangeseach = {}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function () {
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/epGemRepair/getEpGemRepairPageInfoByCondition",
            dataSrc: function (json) {
                if (json.code == 444) {
                    $state.go("login/loginCheck");
                    swal({
                        title: '登录失效，请重新登录',
                        type: 'warning',
                        timer: '2000',
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                }
                ;
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                for (var i = 0; i < json.datum.list.length; i++) {
                    json.datum.list[i].repairTime = new Date(json.datum.list[i].repairTime + 28800000).toISOString().slice(0, 10);
                }
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.deviceId = $scope.equipRepairMangeseach.deviceId;
                params.repairPerson = $scope.equipRepairMangeseach.repairPerson;
            },
            contentType: "application/json",
            type: "get",
            dataType: "JSON"
        },
        columns: [
            {
                data: function (data, type, row, meta) {
                    return meta.row + 1
                },
                title: "序号",
                width: "5%"

            },
            {
                data: "deviceId",
                title: "设备ID",
                width: "20%"

            },
            {
                data: "repairPerson",
                title: "设备修理人",
                width: "10%"
            },
            {
                data: "repairCont",
                title: "设备修理内容",
                width: "30%"
            },
            {
                data: "repairTime",
                title: "设备修理时间",
                width: "20%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    //重置
    $scope.modelRepeat = function () {
        $scope.targe = 0;
        $scope.equipRepairMange = {}
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    /* 设备维修管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.modelShow = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.equipRepairMange.repairTime = $("input[name='repairTime']").val()
        $('#myModal').modal('show');

    }
    $scope.equipadd = function () {
        $('#myModal').modal('hide');
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/epGemRepair/add",
            method: "post",
            dataType: "json",
            data: $scope.equipRepairMange,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $scope.targe = 0;
            $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
            if (data.code == 200) {
                $scope.modelRepeat();
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
            } else {
                jBox.tip("新增失败", 'info');
            }

        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    }
    /* 设备维修管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * @param  $scope.equipRepairMange1：修改内容提交<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate = function (data) {
        updateUse(data)

    };
    function updateUse(obj) {
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $scope.equipRepairMange = {}
        $http({
            url: "/eleting-web/epGemRepair/getEpGemRepairById",
            method: "get",
            dataType: "json",
            params: {id: obj},
        }).success(function (data) {
            data.datum.repairTime = new Date(data.datum.repairTime + 28800000).toISOString().slice(0, 10);
            $scope.equipRepairMange = data.datum;
        }).error(function () {
            if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
                return false;
            }
        });
    }

    //保存修改
    $scope.modelSave = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.equipRepairMange.repairTime = $("input[name='repairTime']").val();
        $('#myUpdateModal').modal('show');
    }
    $scope.equipUpdate = function () {
        $('#myUpdateModal').modal('hide');
        $http({
            url: "/eleting-web/epGemRepair/update",
            method: "post",
            dataType: "json",
            data: $scope.equipRepairMange,
        }).success(function (data) {
            if (data.code == 200) {
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
                $scope.modelRepeat();
            } else {
                jBox.tip("修改失败", 'info');
                $("#grid").dataTable().fnDraw(false);
            }
        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    }
//    删除
    window.viewRemove = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/epGemRepair/delete",
                    method: "post",
                    dataType: "json",
                    data: {id: data},
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }).success(function (data) {
                    //$("#grid").dataTable().api().ajax.reload();
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("删除成功", 'info');
                }).error(function () {

                });
            else
                jBox.tip("删除失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };
    //    查询
    $scope.tabChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $("#grid").dataTable().api().ajax.reload();
        }
    });
});
