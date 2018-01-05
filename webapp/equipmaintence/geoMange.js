var myapp = angular.module("myapp", []);
myapp.controller("geoMange", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    /* 地磁设备管理<br>
     * @param  $scope.geoMange：新增内容集合<br>
     * @param  $scope.geoMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.geoMange = {};
    $scope.geoMangeseach = {};
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
            url: "/eleting-web/epGemIf/getEpGemIfPageInfoByCondition",
            dataSrc: function (json) {
                if (json.code == 444) {
                    $('#myModal').modal('hide');//隐藏新增模态框
                    $('#myUpdateModal').modal('hide');//隐藏修改模态框
                    setTimeout(function () {
                        $state.go("login/loginCheck");
                        swal({
                            title: '登录失效，请重新登录',
                            type: 'warning',
                            timer: '2000',
                            showCancelButton: false,
                            showConfirmButton: false,
                        });
                    }, 1000);
                    return false;
                }
                ;
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                // for (var i = 0; i < json.datum.list.length; i++) {
                //     json.datum.list[i].epGemOnlineTime = new Date(json.datum.list[i].epGemOnlineTime + 28800000).toISOString().slice(0, 10)
                //     json.datum.list[i].epGemOfflineTime = new Date(json.datum.list[i].epGemOfflineTime + 28800000).toISOString().slice(0, 10)
                // }
                ;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.epGemName = $scope.geoMangeseach.epGemName;
                params.epProvideridId = $("select[name='uniqueMarkShow']").val();
                params.epGatewayId = $scope.geoMangeseach.epGatewayId;
                params.epDeviceId = $scope.geoMangeseach.epDeviceId;
                params.epGemModelNo = $scope.geoMangeseach.epGemModelNo;
                $scope.geoMange.pageNum = params.pageNum;
                $scope.geoMange.pageSize = params.pageSize;
            },
            contentType: "application/json",
            type: "get",
            dataType: "JSON"
        },
        columns: [
            {
                title: "序号",
                data: function (data, type, row, meta) {
                    return meta.row + 1
                },
                width: "2%"

            },
            {
                data: "epGemName",
                title: "设备名称",
                width: "10%"
            },
            {
                data: "epDeviceId",
                title: "设备编号",
                width: "7%"
            },
            {
                data: "epGemPdtr",
                title: "设备生产商",
                width: "6%"
            },
            {
                data: "epGemModelNo",
                title: "设备型号",
                width: "5%"
            },
            {
                data: "areaName",
                title: "所属片区",
                width: "6%"
            },
            {
                data: "epGatewayId",
                title: "设备所属网关",
                width: "6%"
            },
            {
                data: "epRepeateridId",
                title: "所属中继器",
                width: "6%"
            },
            {
                data: "epGemFirmwareVer",
                title: "版本",
                width: "8%"
            },
            {
                data: "busStatus",
                title: "业务状态",
                render: function (data, type, row) { // 模板化列显示内容
                    if (data == "01") {
                        return "已检测";
                    } else if (data == "02") {
                        return "上线中"
                    } else if (data == "03") {
                        return "已下线"
                    } else if (data == "04") {
                        return "已维修"
                    } else if (data == "05") {
                        return "已报废"
                    } else if (data == "00") {
                        return "未检测"
                    }
                },
                width: "5%"
            },
            {
                data: "curStatus",
                title: "初始化状态",
                render: function (data, type, row) { // 模板化列显示内容
                    if (data == "01") {
                        return "初始化成功";
                    } else if (data == "02") {
                        return "初始化中"
                    } else if (data == "03") {
                        return "初始化成功"
                    } else if (data == "04") {
                        return "初始化失败"
                    } else if (data == "00") {
                        return "未初始化"
                    } else if (data == "05") {
                        return "初始化超时"
                    } else if (data == "06") {
                        return "初始化未响应"
                    } else if (data == "07") {
                        return "参数错误"
                    } else if (data == "08") {
                        return "没有连接"
                    }
                },
                width: "6%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt1 = '<button style="margin-right: 10px;cursor: pointer;" name="initializeShow"  class=" gui-btn btn-add btn-tebBt"   onclick="initializeShow(\'' + data + '\')">初始化</button>';
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-check btn-tebBt"  onclick="viewcheck(\'' + data + '\')">查看</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt + butt1
                },
                width: "14%"
            }

        ],
    });
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  筛选片区
     * </p>
     * @param  $scope.uniqueMarkFar：厂商查询条件集合<br>
     * @param  uniqueMark：唯一标示<br>
     * @param  pageNum：当前页码<br>
     * @param  pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.uniqueMarkArae = {};
    $scope.uniqueMarkArae.cityCode = window.localStorage.getItem("cityCode");
    $scope.uniqueMarkArae.pageNum = "1";
    $scope.uniqueMarkArae.pageSize = "10000";
    $http({
        url: "/eleting-web/area/getAreaPageInfoByCondition",
        method: "get",
        dataType: "json",
        params: $scope.uniqueMarkArae,
        headers: {
            token: window.localStorage.getItem("token")
        }
    }).success(function (data) {
        $scope.uniqueMarkAreaShow = data.datum.list
    }).error(function () {

    });
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  筛选厂商
     * </p>
     * @param  $scope.uniqueMarkFar：厂商查询条件集合<br>
     * @param  uniqueMark：唯一标示<br>
     * @param  pageNum：当前页码<br>
     * @param  pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.uniqueMarkFar = {};
    $scope.uniqueMarkFar.uniqueMarks = ['provider-dc'];
    $scope.uniqueMarkFar.pageNum = "1";
    $scope.uniqueMarkFar.pageSize = "10000";
    $http({
        url: "/eleting-web/codeTable/getCodeTablePageInfoByConditionForProvider",
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
    //加载设备型号
    $scope.uniqueMarkModel = {};
    $scope.uniqueMarkModel.pageNum = "1";
    $scope.uniqueMarkModel.pageSize = "10000";
    window.modelCodeSea = function (a) {
        $scope.uniqueMarkModel.deviceTypeCode = 'dc';
        $scope.uniqueMarkModel.providerCode = $("select[name='epGemPdtr']").val();
        $http({
            url: "/eleting-web/epModel/getEpModelPageInfoByCondition",
            method: "get",
            dataType: "json",
            params: $scope.uniqueMarkModel,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            var myobj1 = document.getElementById('epGemModelNo');
            //珊瑚所有项
            myobj1.options.length = 0;
            //添加一个选项

            for (var o = 0; o < data.datum.list.length; o++) {
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj1.options.add(new Option(data.datum.list[o].model, data.datum.list[o].model)); //这个兼容IE与firefox
            }
            paramsJsonSea()
        }).error(function () {
        });
        UpdateEpGemName()//调取关联名字函数
    };
    //加载参数
    $scope.uniqueMarkParamsJson = {};
    $scope.uniqueMarkParamsJson.pageNum = "1";
    $scope.uniqueMarkParamsJson.pageSize = "10000";
    window.paramsJsonSea = function () {
        $('.addMain').html('')//清空下来框内容
        //$scope.uniqueMarkParamsJson.model=$("select[name='epGemModelNo']").val();
        if (!$scope.Usemodel) {
            $scope.uniqueMarkParamsJson.model = $("select[name='epGemModelNo']").val();
        } else {
            $scope.uniqueMarkParamsJson.model = $scope.Usemodel;
        }
        $http({
            url: "/eleting-web/epGemParams/getEpGemParamsPageInfoByCondition",
            method: "get",
            dataType: "json",
            params: $scope.uniqueMarkParamsJson,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            if (data.datum.list.length >= 1) {
                $scope.uniqueMarkParamsJsonShow = data.datum.list[0].paramsName;
            }
        }).error(function () {

        });
    }
    //新增li
    //动态新增
    $(function () {
        $('#add').click(function () {
            var cj = $("select[name='epGemModelNo']").val()
            if (cj == '' || cj == null || cj == undefined) {
                var submit = function (v, h, f) {
                    return true;
                };
                // 自定义按钮
                $.jBox.confirm("请选择设备型号", "添加参数提示", submit, {buttons: {'关闭': true}});
                return false;
            }
            if (typeof $scope.uniqueMarkParamsJsonShow == 'undefine') {
                var submit = function (v, h, f) {
                    return true;
                };
                $.jBox.confirm("设备参数名不存在,请到设备参数页面维护", "添加参数提示", submit, {buttons: {'关闭': true}});
                return false;
            } else {
                var cd = JSON.parse($scope.uniqueMarkParamsJsonShow);
                if (cd.length == 0) {
                    var submit = function (v, h, f) {
                        return true;
                    };
                    $.jBox.confirm("设备参数名为空,请到设备参数页面维护", "添加参数提示", submit, {buttons: {'关闭': true}});
                    return false;
                } else {
                    $('.addMain').prepend('<li><label class="ul-label control-label" alain="right"><select name="pkPosStreet" class="gui-select pkPosStreet"></select></label><input type="text" name="hailo" class="gui-input form-control" style="margin-left: 6px;" data-bv-notempty="true" data-bv-notempty-message="片区名称不能为空"/><span class="gui-CloseTip remove">&#xf0018;</span></li>');
                    $("select[name='pkPosStreet']:eq(0)").html('');
                    for (var i = 0, roadsLength = cd.length; i < roadsLength; i++) {
                        $("select[name='pkPosStreet']:eq(0)").append("<option  value=" + cd[i] + ">" + cd[i] + "</option>");
                    }
                }
            }

            $('.remove').click(function () {
                $(this).parent().remove();
            });
        });
    });
    //重置
    $scope.modelRepeat = function () {
        $scope.targe = 0;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        $('.addMain').html('')
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        var myobj = document.getElementById('epGemModelNo');
        $("select[name='epGemModelNo']").html('');
        myobj.options.add(new Option("无", ''));
    };
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.uniqueMarkFar：厂商查询条件集合<br>
     * @param  $scope.targe：限制重复提交<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.targe = 0;
    $scope.modelShow = function () {
        //$scope.geoMange={}
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var cc = [];
        var a = $("select[name='pkPosStreet']").length;
        for (var i = 0; i < a; i++) {
            var aa = document.getElementsByName("pkPosStreet")[i];
            cc.push(aa.options[aa.selectedIndex].text, aa.parentNode.parentNode.childNodes[1].value);
        }
        var bp = document.getElementById('epGemPdtr');
        $scope.geoMange.epGemPdtr = bp.options[bp.selectedIndex].text;
        $scope.geoMange.epProvideridId = $("select[name='epGemPdtr']").val();//厂商ID
        $scope.geoMange.epGemModelNo = $("select[name='epGemModelNo']").val();//设备型号
        $scope.geoMange.epGemName = $("input[name='epGemName']").val();//设备名称
        $scope.geoMange.epDeviceId = $("input[name='epDeviceId']").val();//设备ID
        $scope.geoMange.epGemArea = $("select[name='epGemArea']").val();//设备名称
        $scope.geoMange.paramsJson = JSON.stringify(cc);//参数
        $scope.geoMange.parentId = '001';//上级ID
        $scope.geoMange.id = null;//主键ID
        $('#myModal').modal('show');

    };
    $scope.modelShowAdd = function () {
        $('#myModal').modal('hide');
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/epGemIf/add",
            method: "post",
            dataType: "json",
            data: $scope.geoMange,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $scope.targe = 0;
            $(".addYes").removeAttr("disabled", "disabled");
            if (data.code == 200) {
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat()
            } else if (data.code == 300003) {
                jBox.tip("设备已存在；新增失败", 'info');
            } else {
                jBox.tip("新增失败", 'info');
            }
        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    }
    //    关联设备名字
    window.UpdateEpGemName = function () {
        var aa = document.getElementById("epGemPdtr");
        $("input[name='epGemName']").val(aa.options[aa.selectedIndex].text + "【地磁】" + $("input[name='epDeviceId']").val());
        $("input[name='epProvideridId']").val($("select[name='epGemPdtr']").val());

    };
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.geoMange1：修改内容集合<br>
     * @param  $scope.uniqueMarkFar：厂商查询条件集合<br>
     * @param  $scope.targeUpdate：限制重复提交<br>
     * @param  epGemOnlineTime：设备上线时间<br>
     * @param  epGemOfflineTime：设备下线时间<br>
     * @param  epGemPdtr：设备生产商<br>
     * @param  epGemName：设备名字<br>
     * @param  epProvideridId：厂商ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate = function (data) {
        updateUse(data)
    };
    window.UpdateEpGemName1 = function () {
        var aa = document.getElementById("epGemPdtr1");
        $("input[name='epGemName1']").val(aa.options[aa.selectedIndex].text + $("input[name='epDeviceId1']").val());
        $("input[name='epProvideridId1']").val($("select[name='epGemPdtr1']").val());
    };

    function updateUse(obj) {
        $scope.modelRepeat()
        $scope.geoMange = {}//清空数据
        $http({
            url: "/eleting-web/epGemIf/getEpGemIfById",
            method: "get",
            dataType: "json",
            params: {id: obj},
        }).success(function (data) {
            $scope.geoMange = data.datum;
            console.log('$scope.geoMange',$scope.geoMange)
            $scope.Usemodel = data.datum.epGemModelNo;
            paramsJsonSea();//调取参数重写
            // $scope.geoMange.epGemOnlineTime = new Date(data.datum.epGemOnlineTime + 28800000).toISOString().slice(0, 10);
            // $scope.geoMange.epGemOfflineTime = new Date(data.datum.epGemOfflineTime + 28800000).toISOString().slice(0, 10);
            $("input[name='epGemName']").val(data.datum.epGemName);
            //    重写设备型号
            var myobj1 = document.getElementById('epGemModelNo');
            //删除所有项
            myobj1.options.length = 0;
            //添加一个选项
            myobj1.options.add(new Option(data.datum.epGemModelNo, data.datum.epGemModelNo)); //这个兼容IE与firefox
            //设备参数显示
            var kk = JSON.parse(data.datum.paramsJson);
            $('.addMain').html('')
            for (var j = 0; j < kk.length; j = j + 2) {
                $('.addMain').prepend('<li><label class="ul-label control-label" alain="right"><select name="pkPosStreet" class="gui-select pkPosStreet"></select></label><input type="text" name="hailo" value="' + kk[j + 1] + '" class="gui-input form-control" style="margin-left: 6px;" /><span class="gui-CloseTip remove">&#xf0018;</span></li>');
                $("select[name='pkPosStreet']").append("<option  value=" + kk[j] + ">" + kk[j] + "</option>");
                $('.remove').click(function () {
                    $(this).parent().remove();
                });
            }

        }).error(function () {

        });
    }

    //保存修改
    $scope.modelSave = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var cc = [];
        var a = $("select[name='pkPosStreet']").length;
        for (var i = 0; i < a; i++) {
            var aa = document.getElementsByName("pkPosStreet")[i];
            cc.push(aa.options[aa.selectedIndex].text, aa.parentNode.parentNode.childNodes[1].value);
        }
        var bp = document.getElementById('epGemPdtr');
        $scope.geoMange.epGemPdtr = bp.options[bp.selectedIndex].text;
        $scope.geoMange.epProvideridId = $("select[name='epGemPdtr']").val();
        $scope.geoMange.epGemModelNo = $("select[name='epGemModelNo']").val();
        $scope.geoMange.epGemName = $("input[name='epGemName']").val();
        $scope.geoMange.epGemArea = $("select[name='epGemArea']").val();
        $scope.geoMange.paramsJson = JSON.stringify(cc);
        $('#myUpdateModal').modal('show');
    }
    $scope.modelShowSave = function () {
        $('#myUpdateModal').modal('hide');
        $http({
            url: "/eleting-web/epGemIf/update",
            method: "post",
            dataType: "json",
            data: $scope.geoMange,
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("修改成功", 'info');
                $("#grid").dataTable().fnDraw(false);
                $scope.modelRepeat()
            } else if (data.code == 300003) {
                jBox.tip("设备已存在；修改失败", 'info');
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
                    url: "/eleting-web/epGemIf/delete",
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
    $scope.geotabChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
    //    回车键查询
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $scope.geotabChexked()
        }
    });
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  查看
     * </p>
     * @param  epGemOnlineTime：设备上线时间<br>
     * @param  epGemOfflineTime：设备下线时间<br>
     * @param  busStatus：业务状态<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.geoMange1 = {}
    window.viewcheck = function (data) {
        $http({
            url: "/eleting-web/epGemIf/getEpGemIfById",
            method: "get",
            dataType: "json",
            params: {id: data},
        }).success(function (data) {
            $scope.geoMange1 = data.datum;
            // $scope.geoMange1.epGemOnlineTime = new Date($scope.geoMange1.epGemOnlineTime + 28800000).toISOString().slice(0, 10);
            // $scope.geoMange1.epGemOfflineTime = new Date($scope.geoMange1.epGemOfflineTime + 28800000).toISOString().slice(0, 10);
            var obj = $scope.geoMange1.busStatus;
            var obj1 = $scope.geoMange1.curStatus;
            if (obj == "01") {
                $scope.geoMange1.busStatus = "检测";
            } else if (obj == "02") {
                $scope.geoMange1.busStatus = "上线"
            } else if (obj == "03") {
                $scope.geoMange1.busStatus = "下线"
            } else if (obj == "04") {
                $scope.geoMange1.busStatus = "维修"
            } else if (obj == "05") {
                $scope.geoMange1.busStatus = "报废"
            } else {
                $scope.geoMange1.busStatus = "未检测"
            }
            ;
            if (obj1 == "01") {
                $scope.geoMange1.curStatus = "初始化成功";
            } else if (obj1 == "02") {
                $scope.geoMange1.curStatus = "初始化中"
            } else if (obj1 == "03") {
                $scope.geoMange1.curStatus = "初始化成功"
            } else if (obj1 == "04") {
                $scope.geoMange1.curStatus = "初始化失败"
            } else {
                $scope.geoMange1.curStatus = "未初始化"
            }

            //显示参数
            var kk = JSON.parse(data.datum.paramsJson);
            $('.addCheckMain').html('');
            for (var j = 0; j < kk.length; j = j + 2) {
                $('.addCheckMain').prepend('<li><div class="form-group"><label class="ul-label control-label"' +
                    ' alain="right">' + kk[j] + '</label><input type="text" readonly name="hailo" value="' + kk[j + 1] + '" class="gui-input form-control" style="margin-left: 6px;" /></div></li>');

            }
            ;
            //$("#mycheckModal input").attr("disabled","disabled");
            $('#mycheckModal').modal('show');

        }).error(function () {

        });
    };
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  初始化，设置初始化按钮状态
     * </p>
     * @param  providerId：厂商id<br>
     * @param  $scope.initializeShow：初始化参数集合<br>
     * @param  $scope.initializeShow1：初始化修改状态参数集合<br>
     * @param  model：型号<br>
     * @param  version：版本号<br>
     * @param  gatewayId：网关id<br>
     * @param  repeaterId：中继器id<br>
     * @param  deviceId：设备id<br>
     * @param  deviceId：设备id<br>
     * @param  $scope.geoMangeCooke：Cooke数据<br>
     * @param  id：主键ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    var initializeCount = 0;
    $scope.initializeShow = {};
    $scope.initializeShow1 = {};
    window.initializeShow = function (data, e) {
        //触发初始化提示
        if (initializeCount == 1) {
            var submit = function (v, h, f) {
                return true;
            };
            // 自定义按钮
            $.jBox.confirm("已经有初始化过程，请等待！！！", "初始化提示", submit, {buttons: {'关闭': true}});
            return false;
        }
        ;
        $http({
            url: "/eleting-web/epGemIf/updateInitParams",
            method: "post",
            dataType: "json",
            data: {id: data},
        }).success(function (json) {
            if (json.code == 200) {
                $("#grid").dataTable().api().ajax.reload();
//通过ID查询选择行数据
                $http({
                    url: "/eleting-web/epGemIf/getEpGemIfById",
                    method: "get",
                    dataType: "json",
                    params: {id: data},
                }).success(function (jsonH) {
                    $("#grid").dataTable().api().ajax.reload();
                    $scope.initializeShow = {};//情况数据
                    $scope.geoMangeCooke = {};
                    $scope.geoMangeCooke = jsonH.datum//作为cooke容器
                    $scope.initializeShow.repeaterId = jsonH.datum.epRepeateridId;//中继器ID
                    //$scope.initializeShow.repeaterId='00000';//中继器ID
                    $scope.initializeShow.gatewayId = jsonH.datum.epGatewayId;//网关ID
                    //$scope.initializeShow.gatewayId='10123',
                    $scope.initializeShow.providerId = jsonH.datum.epProvideridId;//厂商ID
                    $scope.initializeShow.model = jsonH.datum.epGemModelNo;//设备型号
                    $scope.initializeShow.version = '';//版本号
                    $scope.initializeShow.deviceId = jsonH.datum.epDeviceId;//设备ID
                    $scope.initializeShow.platform = 'web';//借口类型
                    initializeCount = 1;
                    $scope.initializeId = data;
//修改初始化状态
                    $scope.initializeShow1.curStatus = "02";//初始化状态
                    $scope.initializeShow1.id = data;//主键ID
                    $http({
                        url: "/eleting-web/epGemIf/update",
                        method: "post",
                        dataType: "json",
                        data: $scope.initializeShow1,
                    }).success(function (data) {
                        $("#grid").dataTable().api().ajax.reload();
                        //statusTip()//调取初始化状态函数
                    }).error(function () {

                    });
//开始初始化
                    $http({
                        url: "/eleting-web/sensor/initSensor",
                        method: "post",
                        dataType: "json",
                        data: $scope.initializeShow,
                    }).success(function (data) {
                        if (data.code == 200) {
                            $("#grid").dataTable().api().ajax.reload();
                            //    轮循
                            var timer = setInterval(function () {
                                $http({
                                    url: "/eleting-web/deviceInitResult/getInitResult",
                                    method: "GET",
                                    params: {
                                        providerId: jsonH.datum.epProvideridId,
                                        gatewayId: jsonH.datum.epGatewayId,
                                        repeaterId: jsonH.datum.epRepeateridId,
                                        deviceId: jsonH.datum.epDeviceId
                                    },
                                }).success(function (data) {
                                    var a = JSON.parse(data.datum.result).result;
                                    $scope.resultMsg = JSON.parse(data.datum.result).msg;
                                    switch (a) {
                                        case "0":
                                            clearInterval(timer);
                                            $scope.updateDcStu("03");
                                            $("#tipBox").animate({right: '0px'});
                                            $("#tipBox p").html($scope.resultMsg);
                                            setTimeout(function () {
                                                $("#tipBox").animate({right: '-400px'});
                                            }, 2000);
                                            break;
                                        case "-1":
                                            clearInterval(timer);
                                            $scope.updateDcStu("08");
                                            $("#tipBox").animate({right: '0px'});
                                            $("#tipBox p").html($scope.resultMsg);
                                            setTimeout(function () {
                                                $("#tipBox").animate({right: '-400px'});
                                            }, 2000);
                                            break;
                                        case "2":
                                            $("#tipBox").animate({right: '0px'});
                                            $("#tipBox p").html($scope.resultMsg);
                                            break;
                                        case "-100":
                                            clearInterval(timer);
                                            $scope.updateDcStu("06");
                                            $("#tipBox").animate({right: '0px'});
                                            $("#tipBox p").html($scope.resultMsg);
                                            setTimeout(function () {
                                                $("#tipBox").animate({right: '-400px'});
                                            }, 2000);
                                            break;
                                        case -1000:
                                            clearInterval(timer);
                                            $scope.updateDcStu("07");
                                            $("#tipBox").animate({right: '0px'});
                                            $("#tipBox p").html($scope.resultMsg);
                                            setTimeout(function () {
                                                $("#tipBox").animate({right: '-400px'});
                                            }, 2000)
                                            break;
                                    }
                                    $("#grid").dataTable().api().ajax.reload();
                                    initializeCount = 0
                                }).error(function () {
                                });
                            }, 2000);
                        }

                        /* 地磁设备管理<br>
                         * 功能描述：<br>
                         * <p>
                         *  初始化，超时状态提示
                         * </p>
                         * @param  providerId：厂商id<br>
                         * 创建者：肖烈 创建时间: 2017-04-22<br>
                         *  @author 肖烈
                         * @version 1.0.0.0
                         */
                        var date = new Date();
                        date.setTime(date.getTime() + 1 * 60 * 1000); //设置date为当前时间+30分搜索
                        $.cookie('statusNmae', $scope.geoMangeCooke.epDeviceId, {expires: date})
                        $.cookie('statusNmaeFover', $scope.geoMangeCooke.epDeviceId, {expires: 365});
                        setTimeout(function () {
                            clearInterval(timer);//清除循环定时器
                            if ($.cookie('statusNmae') == null || $.cookie('statusNmae') == undefined || $.cookie('statusNmae') == "") {
                                if (initializeCount == 1) {
                                    $scope.initializeShow = {};
                                    $("#tipBox p").html($scope.initializeId + '初始化超时');
                                    $scope.initializeShow.id = $scope.initializeId;
                                    $scope.initializeShow.curStatus = "05";
                                    $http({
                                        url: "/eleting-web/epGemIf/update",
                                        method: "post",
                                        dataType: "json",
                                        data: $scope.initializeShow,
                                    }).success(function (data) {
                                        $("#grid").dataTable().api().ajax.reload();
                                        initializeCount = 0
                                    }).error(function () {
                                    });
                                    $("#tipBox").animate({right: '0px'});
                                    setTimeout(function () {
                                        $("#tipBox").animate({right: '-400px'});

                                    }, 20000);
                                }
                            }
                        }, 61000);
                    }).error(function () {

                    });
                }).error(function () {
                });
            } else {
                jBox.tip("数据更新不成功，初始化失败", 'info');
            }
        }).error(function () {

        });

    };
    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  修改初始化状态
     * </p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.updateDcStu = function (obj) {
        $scope.initializeShow1.curStatus = obj;//初始化状态
        $http({
            url: "/eleting-web/epGemIf/update",
            method: "post",
            dataType: "json",
            data: $scope.initializeShow1,
        }).success(function (data) {
            $("#grid").dataTable().api().ajax.reload();
            initializeCount = 0
        }).error(function () {
        });
    }

    /* 地磁设备管理<br>
     * 功能描述：<br>
     * <p>
     *  初始化，状态提示
     * </p>
     * @param  providerId：厂商id<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //$scope.geoMangeOutTime={}
    //window.statusTip=function(){
    //    var date=new Date();
    //    date.setTime(date.getTime()+1*60*1000); //设置date为当前时间+30分搜索
    //    $.cookie('statusNmae',$scope.geoMangeCooke.epDeviceId,{ expires: date})
    //    $.cookie('statusNmaeFover',$scope.geoMangeCooke.epDeviceId,{ expires: 365});
    //    setTimeout(function(){
    //        if($.cookie('statusNmae')==null||$.cookie('statusNmae')==undefined||$.cookie('statusNmae')==""){
    //            if(initializeCount==1){
    //                $scope.initializeShow={};
    //                $("#tipBox p").html($.cookie('statusNmaeFover')+"初始化超时");
    //                $scope.initializeShow.id=$scope.initializeId;
    //                $scope.initializeShow.curStatus="05";
    //                $http({
    //                    url:"/eleting-web/epGemIf/update",
    //                    method:"post",
    //                    dataType: "json",
    //                    data:$scope.initializeShow,
    //                }).success(function(data){
    //                    $("#grid").dataTable().api().ajax.reload();
    //                    initializeCount=0
    //                }).error(function(){
    //                });
    //                $("#tipBox").animate({right:'0px'});
    //                setTimeout(function(){
    //                    $("#tipBox").animate({right:'-400px'});
    //
    //                },20000);
    //            }
    //        }
    //    },61000);
    //};
//    回车键查询
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $("#grid").dataTable().api().ajax.reload();
        }
    });
////    消息推送
//    var has_had_focus = false;
//// Stomp.js boilerplate
//    if (location.search == '?ws') {
//        var ws = new WebSocket('ws://192.168.1.1:15674/ws');
//    } else {
//        var ws = new SockJS('http://10.10.16.239:15674/stomp');
//    }
//
//// Init Client
//    var client = Stomp.over(ws);
//
//// SockJS does not support heart-beat: disable heart-beats
//    client.heartbeat.outgoing = 0;
//    client.heartbeat.incoming = 0;
//
////消息推送成功
//    var on_connect = function(x) {
//        $scope.initializeShow1={}
//        client.subscribe("/exchange/directExchange/eletingKeyForDevice", function(d) {
//            initializeCount=0;
//            $scope.initializeShow1.id=$scope.initializeId;
//            var msg=JSON.parse(d.body);
//            $("#tipBox").animate({right:'0px'});
//            if(msg.result!=0){
//                $("#tipBox p").html(msg.msg);
//                $scope.initializeShow1.curStatus="04";
//                setTimeout(function(){
//                    $("#tipBox").animate({right:'-400px'});
//                },30000);
//            }else{
//                $scope.initializeShow1.curStatus="03";
//                $("#tipBox p").html(msg.deviceId+"初始化成功");
//                setTimeout(function(){
//                    $("#tipBox").animate({right:'-400px'});
//                },2000)
//            };
//            $http({
//                url:"/eleting-web/epGemIf/update",
//                method:"post",
//                dataType: "json",
//                data:$scope.initializeShow1,
//            }).success(function(data){
//                $("#grid").dataTable().api().ajax.reload();
//            }).error(function(){
//            });
//        });
//    };
//// Declare on_error
//    var on_error =  function() {
//    };
//// Conect to RabbitMQ
//    client.connect('eleting', '1234', on_connect, on_error, 'sczh');
    //手动关闭提示框
    $scope.closeTip = function () {
        $("#tipBox").animate({right: '-400px'});
    }
//
});

