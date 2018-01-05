var myapp = angular.module("myapp", []);
myapp.controller("patroManage", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 巡视员管理<br>
     * @param  $scope.patroMange：新增内容集合<br>
     * @param  $scope.patroMangeseach：查询条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.patroMange = {};
    $scope.patroMangeseach = {}
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
            $("#grid >tbody >tr").dblclick(function () {
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/ispctIf/getIspctIfPageInfoByCondition",
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
                    json.datum.list[i].ispctHiredate = new Date(json.datum.list[i].ispctHiredate + 28800000).toISOString().slice(0, 10)

                }
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.ispctWkId = $scope.patroMangeseach.ispctWkId;
                params.ispctName = $scope.patroMangeseach.ispctName;
                params.ispctArea = window.localStorage.getItem('areaCode');
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
                width: "4%"
            },
            {
                data: "ispctWkId",
                title: "巡视员工号",
                width: "6%"
            },
            {
                data: "ispctName",
                title: "巡视员名字",
                width: "6%"
            },
            {
                data: "ispctRank",
                title: "巡视员职称",
                width: "6%"
            },
            {
                data: "ispctIdTy",
                title: "证件类型",
                width: "8%"
            },
            {
                data: "ispctIdNo",
                title: "证件ID",
                width: "10%"
            },
            {
                data: "ispctResidentialLocations",
                title: "巡视员居住地址",
                width: "16%"
            },
            {
                data: "codeName",
                title: "负责片区",
                width: "12%"
            },
            {
                data: "ispctHiredate",
                title: "巡视员入职时间",
                width: "8%"
            },
            {
                data: "ispctStatus",
                title: "状态",
                render: function (data, type, row) { // 模板化列显示内容
                    if (data == "0") {
                        return "禁用"
                    } else if (data == "1") {
                        return "启用"
                    }
                }
                ,
                width: "5%"
            },
            {
                data: "ispctHiredate",
                title: "巡视员入职时间",
                width: "10%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width: "10%"
            }

        ],
    });
    /* 巡视员管理<br>
     <p>加载所属区域</p>
     * @param $scope.uniqueMarkFar：码表查询条件集合<br>
     * @param $scope.uniqueMarkShow：码表内容<br>
     * @param pageNum：页码<br>
     * @param pageSize：每页条数<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.uniqueMarkFar = {};
    $scope.uniqueMarkFar.pageNum = "1";
    $scope.uniqueMarkFar.pageSize = "10000";
    $scope.uniqueMarkFar.cityCode = window.localStorage.getItem("cityCode");
    $http({
        url: "/eleting-web/area/getAreaPageInfoByCondition",
        method: "get",
        dataType: "json",
        params: $scope.uniqueMarkFar,
        headers: {
            token: window.localStorage.getItem("token")
        }
    }).success(function (data) {
        $scope.uniqueMarkShow = data.datum.list
    }).error(function () {

    });
    //重置
    $scope.modelRepeat = function () {
        $scope.targe = 0;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $("select[name='ispctIdTy']").val('');
    };
    /* 巡视员管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.targe：限制按钮重复点击<br>
     * @param  ispctBirthday：巡视员生日<br>
     * @param  ispctHiredate：巡视员入职时间<br>
     * @param  ispctStatus：禁用状态<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.model = {};
    $scope.modelShow = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.patroMange.ispctBirthday = $("input[name='ispctBirthday']").val()
        $scope.patroMange.ispctHiredate = $("input[name='ispctHiredate']").val()
        $scope.patroMange.ispctStatus = $("select[name='ispctStatus']").val()
        $scope.patroMange.ispctArea = $("select[name='ispctArea']").val();
        $scope.patroMange.id = null;
        $("#myModal").modal('show')
    }
    $scope.modelShowAdd = function () {
        $("#myModal").modal('hide')
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/ispctIf/add",
            method: "post",
            dataType: "json",
            data: $scope.patroMange,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $(".addYes").removeAttr("disabled", "disabled")
            $scope.targe = 0;
            if (data.code == 200) {
                $("#grid").dataTable().api().ajax.reload();
                $('#myModal').modal('hide');
                $scope.modelRepeat()
                jBox.tip("新增成功", 'info');
            } else if (data.code == 300003) {
                jBox.tip("巡视员已存在;新增失败", 'info');
            } else {
                jBox.tip("新增失败", 'info');
            }
        }).error(function () {
            jBox.tip("连接失败", 'info');
        });
    }
    window.patroDatechenge = function () {
        dataValidator("myform")
    };
    /* 巡视员管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.targeUpdate：限制按钮重复点击<br>
     * @param  $scope.patroMangeupdate：修改内容集合<br>
     * @param  ispctHiredate：巡视员入职时间<br>
     * @param  ispctBirthday：巡视员生日<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate = function (data) {
        updateUse(data)
    };
    function updateUse(obj) {
        $scope.patroMange = {};
        $http({
            url: "/eleting-web/ispctIf/getIspctIfById",
            method: "get",
            dataType: "json",
            params: {id: obj},
        }).success(function (data) {
            $scope.patroMange = data.datum;
            $scope.patroMange.ispctBirthday = new Date($scope.patroMange.ispctBirthday + 28800000).toISOString().slice(0, 10)
            $scope.patroMange.ispctHiredate = new Date($scope.patroMange.ispctHiredate + 28800000).toISOString().slice(0, 10)
        }).error(function () {

        });
    }

    //保存修改
    $scope.modelSave = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.patroMange.ispctBirthday = $("input[name='ispctBirthday']").val();
        $scope.patroMange.ispctHiredate = $("input[name='ispctHiredate']").val();
        $scope.patroMange.ispctArea = $("select[name='ispctArea']").val();
        $("#myUpdateModal").modal('show')

    }
    $scope.patroUpdate = function () {
        $("#myUpdateModal").modal('hide')
        $http({
            url: "/eleting-web/ispctIf/update",
            method: "post",
            dataType: "json",
            data: $scope.patroMange,
        }).success(function (data) {
            $scope.targeUpdate = 0;
            $(".updateYes").removeAttr("disabled", "disabled")
            if (data.code == 200) {
                $('#myUpdateModal').modal('hide');
                $("#grid").dataTable().fnDraw(false);
                $scope.modelRepeat()
                jBox.tip("修改成功", 'info');
            } else if (data.code == 300003) {
                jBox.tip("巡视员已存在;修改失败", 'info');
            } else {
                jBox.tip("修改失败", 'info');
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
                    url: "/eleting-web/ispctIf/delete",
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
                    jBox.tip("链接失败", 'info');
                });

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };
    //    查询
    $scope.patroMtabChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $scope.patroMtabChexked()
        }
    });
});
