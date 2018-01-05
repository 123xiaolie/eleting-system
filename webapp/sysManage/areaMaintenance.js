var myapp = angular.module("myapp", []);
myapp.controller("areaMaintenance", function ($scope, $http, $state) {
    $.fn.mycity("sheng", "shi", "xian", 510100) //初始化城市
    //初始化验证
    $('#myform').bootstrapValidator();
    $scope.areaMaintenance = {}
    $scope.areaMaintenanceseach = {}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/area/getAreaPageInfoByCondition",
            dataSrc: function (json) {
                if (json.code == 444) {
                    setTimeout(function () {
                        $state.go("login/loginCheck");
                        swal({
                            title: '登录失效，请重新登录',
                            type: 'warning',
                            timer: '2000',
                            showCancelButton: false,
                            showConfirmButton: false,
                        });
                    }, 1000)
                    return false;
                }
                json.recordsTotal = json.datum.total; //总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10; //起始位置
                json.length = json.datum.pageSize;
                for (var i = 0; i < json.datum.list.length; i++) {
                    if (json.datum.list[i].areaCode == "0") {
                        var c = json.datum.list[i].fullName.split("--");
                        json.datum.list[i].fullName = c[0]
                    }
                }
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.areaName = $scope.areaMaintenanceseach.areaName;
                // params.status = '0';//禁用不再显示
            },
            contentType: "application/json",
            type: "get",
            dataType: "JSON"
        },
        columns: [{
                title: "选择",
                data: function (data, type, row, meta) {
                    return meta.row + 1
                },
                width: "5%"
            },
            {
                data: "areaName",
                title: "片区名称",
                width: "13%"
            },
            {
                data: "fullName",
                title: "片区全名",
                width: "19%"
            },
            {
                data: "areaCode",
                title: "片区编码",
                width: "10%"
            },
            {
                data: "cityCode",
                title: "城市编码",
                width: "9%"
            },
            {
                data: "ip",
                title: "请求地址",
                width: "20%"
            },
            {
                data: "port",
                title: "端口号",
                width: "7%"
            },
            {
                data: "status",
                title: "状态",
                render: function (data, type, row) {
                    if (row.areaCode == '0') {
                        var butt = '启用';
                    } else {
                        if (row.status == "1") {
                            var butt = '禁用';
                        } else {
                            var butt = '启用';
                        }
                    }

                    return butt;
                },
                width: "7%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    if (row.areaCode == '0') {
                        var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button>';
                    } else {
                        if (row.status == "1") {
                            var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-add btn-tebBt"  onclick="viewRecover(\'' + data + '\')">恢复</button>';
                        } else {
                            var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-open btn-tebBt"  onclick="viewRemove(\'' + data + '\')">禁用</button>';
                        }
                    }

                    return butt;
                },
                width: "10%"
            }

        ],
    });
    /**
     * 片区管理<br>
     * <p>
     * 重置
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-7-11
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.modelRepeat = function () {
        $('#myform').data('bootstrapValidator').resetForm(true);
        $.fn.mycity("sheng", "shi", "xian")
    };
    /**
     * 片区管理<br>
     * <p>
     * 新增
     * </p>
     * @param $scope.areaMaintenance：新增内容集合<br>
     * <br> 创建者：肖烈 创建时间: 2017-7-11
     * 片区与片区编码都唯一
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.targe = 0;
    $scope.modelShow = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        if (!$("select[name='cityCode']").val()) {
            swal({
                title: '城市不能为空',
                type: 'warning',
                timer: '1000',
                showCancelButton: false,
                showConfirmButton: false,
            });
            return false;
        }
        $scope.areaMaintenance.cityCode = $("select[name='cityCode']").val();
        var aa = document.getElementById('shi');
        $scope.areaMaintenance.cityName = aa.options[aa.selectedIndex].text;
        var bb = document.getElementById('sheng');
        $scope.areaMaintenance.shengName = bb.options[bb.selectedIndex].text;
        $scope.areaMaintenance.id = null;
        $scope.areaMaintenance.fullName = $scope.areaMaintenance.cityName + "--" + $scope.areaMaintenance.areaName;
        if($scope.areaMaintenance.areaCode.substring(0,4) == $scope.areaMaintenance.cityCode&&$scope.areaMaintenance.areaCode.length>4){
        }else{
            $scope.areaMaintenance.areaCode = $scope.areaMaintenance.cityCode + $scope.areaMaintenance.areaCode            
        }
        $('#myModal').modal('show');
    };
    $scope.modelShowAdd = function () {
        $('#myModal').modal('hide');
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/area/add",
            method: "post",
            dataType: "json",
            data: $scope.areaMaintenance,
        }).success(function (data) {
            $scope.targe = 0;
            $(".addYes").removeAttr("disabled", "disabled");
            if (data.code == 200) {
                $("#grid").dataTable().api().ajax.reload();
                $('#myform').data('bootstrapValidator').resetForm(true);
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat();
                jBox.tip("新增成功", 'info');
                $(".addYes").removeAttr("disabled", "disabled")
            } else if (data.code == 300003) {
                jBox.tip("片区编码或者片区名称已存在;新增改失败", 'info');
            } else {
                jBox.tip("新增失败", 'info');
                $scope.modelRepeat();
            }

        }).error(function () {

        });
    }
    /**
     * 片区管理<br>
     * <p>
     * 修改
     * </p>
     * @param $scope.areaMaintenance：修改内容集合<br>
     * <br> 创建者：肖烈 创建时间: 2017-7-11
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    window.viewtypeUpdate = function (data) {
        updateUse(data)
    }
    var a, b, c

    function updateUse(obj) {
        $scope.modelRepeat();
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.areaMaintenance = {};
        $http({
            url: "/eleting-web/area/getAreaById",
            method: "get",
            dataType: "json",
            params: {
                id: rows[0].id
            },
        }).success(function (data) {
            $scope.areaMaintenance = data.datum;
            a = data.datum.areaCode;
            b = data.datum.areaName;
            c = data.datum.cityCode;
            $.fn.mycity("sheng", "shi", "xian", data.datum.cityCode)

        }).error(function () {

        });
    }

    //保存修改
    $scope.modelSave = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.areaMaintenance.cityCode = $("select[name='cityCode']").val();
        var bb = document.getElementById('shi');
        $scope.areaMaintenance.cityName = bb.options[bb.selectedIndex].text;
        var cc = document.getElementById('sheng');
        $scope.areaMaintenance.shengName = cc.options[cc.selectedIndex].text;
        $scope.areaMaintenance.fullName = $scope.areaMaintenance.cityName + "--" + $scope.areaMaintenance.areaName;
        if($scope.areaMaintenance.areaCode.substring(0,4) == $scope.areaMaintenance.cityCode&&$scope.areaMaintenance.areaCode.length>4){

        }else{
            $scope.areaMaintenance.areaCode = $scope.areaMaintenance.cityCode + $scope.areaMaintenance.areaCode            
        }
        $('#myUpdateModal').modal('show');
    }
    $scope.modelShowSave = function () {
        $('#myUpdateModal').modal('hide');
        if ($scope.areaMaintenance.areaCode == a && $scope.areaMaintenance.areaName == b && $scope.areaMaintenance.cityCode == c) {
            $http({
                url: "/eleting-web/area/updateForCheck",
                method: "post",
                dataType: "json",
                data: $scope.areaMaintenance,
            }).success(function (data) {
                if (data.code == 200) {
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("修改成功", 'info');
                    $scope.modelRepeat();
                } else if (data.code == 300003) {
                    jBox.tip("片区编码或者片区名称已存在;修改失败", 'info');
                } else {
                    jBox.tip("修改失败", 'info');
                }
            }).error(function () {
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改失败", 'info');
            });
        } else {
            $http({
                url: "/eleting-web/area/update",
                method: "post",
                dataType: "json",
                data: $scope.areaMaintenance,
            }).success(function (data) {
                if (data.code == 200) {
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("修改成功", 'info');
                    $scope.modelRepeat();
                } else if (data.code == 300003) {
                    jBox.tip("片区编码或者片区名称已存在", 'info');
                } else {
                    jBox.tip("修改失败", 'info');
                }
            }).error(function () {
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改失败", 'info');
            });
        }
    }
    /**
     * 片区管理<br>
     * <p>
     * 禁用
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-7-11
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    window.viewRemove = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/area/update",
                    method: "post",
                    dataType: "json",
                    data: {
                        id: data,
                        status: "1"
                    },
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }).success(function (data) {
                    $('#myform').data('bootstrapValidator').resetForm(true);
                    $("#grid").dataTable().api().ajax.reload();
                    jBox.tip("禁用成功", 'info');
                }).error(function () {

                });
            else
                jBox.tip("禁用失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认禁用吗？", "禁用提示", submit, {
            buttons: {
                '确认': true,
                '取消': false
            }
        });

    };
    /**
     * 片区管理<br>
     * <p>
     * 恢复
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-7-11
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    window.viewRecover = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/area/update",
                    method: "post",
                    dataType: "json",
                    data: {
                        id: data,
                        status: "0"
                    },
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }).success(function (data) {
                    $('#myform').data('bootstrapValidator').resetForm(true);
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("恢复成功", 'info');
                }).error(function () {

                });
            else
                jBox.tip("恢复失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认恢复吗？", "禁用提示", submit, {
            buttons: {
                '确认': true,
                '取消': false
            }
        });

    };
    /* 用户管理<br>
     <p>查询、回车键查询</p>con
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.areatabChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $scope.areatabChexked()
        }
    });
});