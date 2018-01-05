var myapp = angular.module("myapp", []);
myapp.controller("geoDetectionManage", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    $scope.geoDetectionMangeseach = {}
    $scope.geoDetectionMangeseach.checkParamId = ''
    $scope.geoIsshow = false
    if(window.localStorage.getItem('userName') =='admin'){
        $scope.geoIsshow = true
    }
    /* 设备检测管理<br>
     *<p>加载厂商<p/>
     * @param $scope.equipModelManage：新增内容集合<br>
     * @param $scope.equipModelManageSeach：筛选内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-25<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //加载码表
    $scope.equipModelFac = {};
    $scope.equipModelFacShow = {}
    $scope.equipModelFac.uniqueMarks = ['provider-dc', 'provider-wg', 'provider-zjq', 'provider-dyj', 'provider-scsb', 'provider-pda'];
    $scope.equipModelFac.pageNum = "1";
    $scope.equipModelFac.pageSize = "10000";
    $http({
        url: "/eleting-web/codeTable/getCodeTablePageInfoByConditionForProvider",
        method: "get",
        dataType: "json",
        params: $scope.equipModelFac,
        headers: {
            token: window.localStorage.getItem("token")
        }
    }).success(function (data) {
        $scope.equipModelFacShow = data.datum.list
    }).error(function () {

    });
    /* 设备检测管理<br>
     * @param  $scope.geoDetMange：新增内容集合<br>
     * @param  $scope.geoDetectionMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */

    $scope.geoDetMange = {};
    $scope.geoDetectionMangeseach = {}
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
            url: "/eleting-web/epGemCheck/getEpGemCheckPageInfoByCondition",
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
                    json.datum.list[i].checkDate = new Date(json.datum.list[i].checkDate + 28800000).toISOString().slice(0, 10);
                }
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.deviceId = $scope.geoDetectionMangeseach.deviceId;
                params.beginDate = $("input[name='beginDate']").val();
                params.endDate = $("input[name='endDate']").val();
                params.checkParamId = $scope.geoDetectionMangeseach.checkParamId
                params.person = window.localStorage.getItem("userName");

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
                data: "checkParamId",
                title: "检测人",
                width: "10%"
            },
            {
                data: "deviceId",
                title: "设备id",
                width: "15%"

            },
            {
                data: "provider",
                title: "设备厂商",
                width: "20%"
            },
            {
                data: "result",
                title: "检测结果",
                width: "10%"
            },
            {
                data: "checkDate",
                title: "检测日期",
                width: "25%"
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
        $scope.geoDetMange = {}
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    /* 设备检测管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * @param  checkDate：检测日期<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.modelShow = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var aa = document.getElementById("provider");
        $scope.geoDetMange.checkDate = $("input[name='checkDate']").val();
        $scope.geoDetMange.provider = aa.options[aa.selectedIndex].text;
        $scope.geoDetMange.checkParamId = window.localStorage.getItem("userName");
        $scope.geoDetMange.id = null;
        console.log("aaaa", $scope.geoDetMange)
        if ($scope.geoDetMange.provider == '请选择厂商') {
            var submit = function (v, h, f) {
                if (v == true)
                    return true;
            };
            // 自定义按钮
            $.jBox.confirm("请选择厂商", "删除提示", submit, {buttons: {'关闭': true}});
            return false
        }
        $('#myModal').modal('show');
    }
    $scope.geoadd = function () {
        $('#myModal').modal('hide');
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/epGemCheck/add",
            method: "post",
            dataType: "json",
            data: $scope.geoDetMange,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $scope.targe = 0;
            $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
            if (data.code == 200) {
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat()
            } else {
                jBox.tip("新增失败", 'info');
            }
        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    }
    /* 设备检测管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.targeUpdate：限制重复点击<br>
     * @param  $scope.geoDetMange1：修改内容集合<br>
     * @param  checkDate：检测日期<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate = function (data) {
        updateUse(data)

    };
    function updateUse(obj) {
        $scope.targeUpdate = 0;
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $http({
            url: "/eleting-web/epGemCheck/getEpGemCheckById",
            method: "get",
            dataType: "json",
            params: {id: obj},
        }).success(function (data) {
            $scope.geoDetMange = data.datum;
            $scope.geoDetMange.checkDate = new Date($scope.geoDetMange.checkDate + 28800000).toISOString().slice(0, 10);
        }).error(function () {

        });
    }

    //保存修改
    $scope.modelSave = function () {
        $scope.geoDetMange.checkDate = $("input[name='checkDate']").val();
        var bb = document.getElementById("provider");
        $scope.geoDetMange.provider = bb.options[bb.selectedIndex].text;
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $('#myUpdateModal').modal('show');

    }
    $scope.geoUpdate = function () {
        $('#myUpdateModal').modal('hide');
        $http({
            url: "/eleting-web/epGemCheck/update",
            method: "post",
            dataType: "json",
            data: $scope.geoDetMange,
        }).success(function (data) {
            if (data.code == 200) {
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            } else {
                $("#grid").dataTable().fnDraw(false);
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
                    url: "/eleting-web/epGemCheck/delete",
                    method: "post",
                    dataType: "json",
                    data: {id: data},
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }).success(function (data) {
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("删除成功", 'info');
                }).error(function () {

                });
            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };
    //    查询
    $scope.geoDettabChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $scope.geoDettabChexked()
        }
    });
});
