var myapp = angular.module("myapp", []);
myapp.controller("parkSpaceManage", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 停车位管理<br>
     * @param  $scope.parkSpaceMange：新增内容集合<br>
     * @param  $scope.parkSpaceMangeseach：新增查询内容集合<br>
     * @param  $scope.parkSpaceMangeseach1：修改停车位查询内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkSpaceMange = {};
    $scope.parkSpaceMangeseach = {}
    $scope.parkSpaceMangeseach1 = {}
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
            url: "/eleting-web/pkSpIf/getPkSpIfPageInfoByCondition",
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
                return json.datum.pkSpIfList;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.pkName = $scope.parkSpaceMangeseach.pkName;
                params.epGemName = $scope.parkSpaceMangeseach.epGemName;
                params.pkSpNumber = $scope.parkSpaceMangeseach.pkSpNumber;
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
                data: "pkName",
                title: "停车场名字",
                width: "15%"
            },
            {
                data: "pkSpNumber",
                title: "停车位号",
                width: "10%"

            },
            {
                data: "pkSpGroupName",
                title: "停车位组",
                width: "10%"
            },
            {
                data: "epGemName",
                title: "设备名称",
                width: "30%"
            },

            {
                data: "pkSpStatus",
                title: "停车位状态",
                render: function (data, type, row) { // 模板化列显示内容
                    if (data == "0") {
                        return "未初始化"
                    } else if (data == "1") {
                        return "空闲无车"
                    } else if (data == "2") {
                        return "有车未超时"
                    }
                    else if (data == "3") {
                        return "超时"
                    } else if (data == "4") {
                        return "锁定占用"
                    } else if (data == "5") {
                        return "暂停使用"
                    } else if (data == "6") {
                        return "未启用"
                    }
                },
                width: "10%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width: "20%"
            }

        ],
    });
    //重置
    $scope.modelRepeat=function(){
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    /* 停车位管理<br>
     * 停车位组<br>
     * @param  $scope.parkSpacePkGroup：停车位组查询条件集合<br>
     * @param  $scope.parkSpaceGroupShow：停车位组集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkSpacePkGroup = {}
    function pkSpGroup(obj) {
        $scope.parkSpacePkGroup.pageNum = "1";
        $scope.parkSpacePkGroup.pageSize = "1000";
        $scope.parkSpacePkGroup.pkIfId = obj;
        $http({
            url: "/eleting-web/pkSpIfGroup/getPkSpIfGroupPageInfoByCondition",
            method: "get",
            dataType: "json",
            params: $scope.parkSpacePkGroup,
        }).success(function (data) {
            $scope.parkSpaceGroupShow = data.datum.list;
        }).error(function () {

        });
    }

    pkSpGroup()
    /* 停车位管理<br>
     * 新增<br>
     * @param  $scope.parkSpacePkAdd：新增内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.model = {};
    $scope.parkSpacePkAdd = {};
    $scope.modelShow = function () {
        $scope.parkSpaceGroupShow = '';
        $scope.targe = 0;
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        var timestamp = Date.parse(new Date());
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
    }
    /* 停车位管理<br>
     * 功能描述：<br>
     * <p>
     *  新增，加载停车场，停车场列表
     * </p>
     * @param  $scope.parkSpaceMange.pkIfId：选中停车场ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $("#gridPark").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#gridPark >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                checkedPark()
            });
            $("#gridPark >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
        },
        pageLength: "5",
        ajax: {
            url: "/eleting-web/pkIf/getPkIfPageInfoByCondition",
            dataSrc: function (json) {
                if (json.code == 444) {
                    $('#myModal').modal('hide');
                    return false;
                }
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.pkName = $scope.parkSpaceMangeseach.pkName;

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
                    var redio = "<input type='radio' name='epPdaIfIdGridStop0'/>";
                    return redio

                },
                width: "10%"

            },
            {
                data: "pkName",
                title: "停车场名字",
                width: "30%"
            },
            {
                data: "id",
                title: "停车场名字id",
                width: "45%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="checkedPark(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    //选择停车场
    //搜索停车场
    $scope.seachPark = function () {
        $("#gridPark").dataTable().api().ajax.reload();
    };
    window.checkedPark = function () {
        $scope.parkSpaceMange ={}//清空数据
        var rows = $("#gridPark").DataTable().rows('.selected').data();
        $("input[name='pkName']").val(rows[0].pkName);
        $scope.parkSpaceMange.pkIfId = rows[0].id;
        pkSpGroup(rows[0].id)
        //    请求停车位号
        $http({
            url: "/eleting-web/pkSpIf/getMaxCarNumber",
            method: "get",
            dataType: "json",
            params: {"pkIfId": rows[0].id},
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $scope.parkSpaceMange.pkSpNumber = data.datum.datum
            $scope.modelRepeat()
        }).error(function () {

        });
    };
    $scope.geoadd = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var bb = document.getElementById("pkSpGroupName");          
        if(bb.options[bb.selectedIndex]){
            $scope.parkSpaceMange.pkSpGroupName = bb.options[bb.selectedIndex].text;            
        }else{
            jBox.tip("停车位组不能为空", 'info');
            return false;
        }
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        $scope.parkSpaceMange.pkSpGroupId = $("select[name='pkSpGroupName']").val();
        $scope.parkSpaceMange.pkName = $("input[name='pkName']").val();
        $http({
            url: "/eleting-web/pkSpIf/add",
            method: "post",
            dataType: "json",
            data: $scope.parkSpaceMange,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $("#grid").dataTable().api().ajax.reload();
            $("#gridPark").dataTable().api().ajax.reload();
            //$("#gridepGemName").dataTable().api().ajax.reload();
            $("#upDategridPark").dataTable().api().ajax.reload();
            //$("#upDategridepGemName").dataTable().api().ajax.reload();
            $('#myModal').modal('hide');
            jBox.tip("新增成功", 'info');
        }).error(function () {

        });
    }
    /* 停车位管理<br>
     * 功能描述：<br>
     * <p>
     *  修改---停车位组
     * </p>
     * @param  $scope.targeUpdate：限制重复点击按钮<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */

    $scope.epPdaIfIdGridUpdat = {};
    function pkSpGroupUpdate(obj, a) {
        $scope.epPdaIfIdGridUpdat.pkIfId = obj;//停车场ID
        $scope.epPdaIfIdGridUpdat.pageNum = "1";
        $scope.epPdaIfIdGridUpdat.pageSize = "1000";
        $http({
            url: "/eleting-web/pkSpIfGroup/getPkSpIfGroupPageInfoByCondition",
            method: "get",
            dataType: "json",
            params: $scope.epPdaIfIdGridUpdat,
        }).success(function (data) {
            var myobj = document.getElementById('pkSpGroupName1');
            //删除所有项
            myobj.options.length = 0;
            //添加一个选项

            for (var o = 0; o < data.datum.list.length; o++) {
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj.options.add(new Option(data.datum.list[o].pkSpGroupName, data.datum.list[o].id)); //这个兼容IE与firefox
            }
            if (a != null && a != "" && a != undefined) {
                $("select[name='pkSpGroupName1']").val(a)
            }
        }).error(function () {

        });
    }

    $scope.parkSpaceGroup1 = {}
    $scope.parkSpaceMange1 = {}
    window.viewUpdate = function (data) {
        updateUse(data)
    };
    function updateUse(obj) {
        $scope.targeUpdate = 0;
        var rows = $("#grid").DataTable().rows('.selected').data();
        window.localStorage.setItem('parkSpaceManagePkId', rows[0].pkIfId)
        pkSpGroupUpdate(window.localStorage.getItem('parkSpaceManagePkId'), rows[0].pkSpGroupId);
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        $scope.parkSpaceMange1 = rows[0];
        $('#myUpdateModal').modal('show');
    }

    /* 停车位管理<br>
     * 功能描述：<br>
     * <p>
     *  修改，停车场列表，选择停车场
     * </p>
     * @param  $scope.targeUpdate：限制重复点击按钮<br>
     * @param  $scope.parkSpaceMange1.pkIfId：修改是选中停车场ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $("#upDategridPark").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#upDategridPark >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                checkedParkUpdate()
            });
            $("#upDategridPark >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
        },
        pageLength: "5",
        ajax: {
            url: "/eleting-web/pkIf/getPkIfPageInfoByCondition",
            dataSrc: function (json) {
                if (json.code == 444) {
                    $('#myUpdateModal').modal('hide');
                    return false;
                }
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.pkName = $scope.parkSpaceMangeseach1.pkName;

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
                    var redio = "<input type='radio' name='epPdaIfIdGridStop1'/>";
                    return redio

                },
                width: "10%"

            },
            {
                data: "pkName",
                title: "停车场名字",
                width: "30%"
            },
            {
                data: "id",
                title: "停车场名字id",
                width: "45%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="checkedParkUpdate(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    //修改--搜索停车场
    $scope.seachParkUpdate = function () {
        $("#upDategridPark").dataTable().api().ajax.reload();
    };
    window.checkedParkUpdate = function () {
        var rows = $("#upDategridPark").DataTable().rows('.selected').data();
        $("input[name='pkName1']").val(rows[0].pkName);
        window.localStorage.setItem('parkSpaceManagePkId', rows[0].id)
        $scope.parkSpaceMange1.pkIfId = rows[0].id;
        pkSpGroupUpdate(rows[0].id)
        $http({
            url: "/eleting-web/pkSpIf/getMaxCarNumber",
            method: "get",
            dataType: "json",
            params: {"pkIfId": rows[0].id},
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $scope.parkSpaceMange1.pkSpNumber = data.datum.datum
            $scope.modelRepeat()
        }).error(function () {

        });
    };
    //保存修改
    $scope.geoUpdate = function () {
        var bb = document.getElementById("pkSpGroupName1");
        if(bb.options[bb.selectedIndex]){
            $scope.parkSpaceMange1.pkSpGroupName = bb.options[bb.selectedIndex].text;          
        }else{
            jBox.tip("停车位组不能为空", 'info');
            return false;
        }
        $scope.parkSpaceMange1.pkSpGroupId = $("select[name='pkSpGroupName1']").val();
        $scope.targeUpdate = 1;
        if ($scope.targeUpdate == 1) {
            $(".updateYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/pkSpIf/update",
            method: "post",
            dataType: "json",
            data: $scope.parkSpaceMange1,
        }).success(function (data) {
            $('#myUpdateModal').modal('hide');
            //$("#grid").dataTable().api().ajax.reload();
            $("#grid").dataTable().fnDraw(false);//只刷新当前页
            $("#gridPark").dataTable().api().ajax.reload();
            $("#gridepGemName").dataTable().api().ajax.reload();
            $("#upDategridPark").dataTable().api().ajax.reload();
            $("#upDategridepGemName").dataTable().api().ajax.reload();
            jBox.tip("修改成功", 'info');
        }).error(function () {
            $('#myUpdateModal').modal('hide');
            //$("#grid").dataTable().api().ajax.reload();
            $("#grid").dataTable().fnDraw(false);
            jBox.tip("修改失败", 'info');
        });
    }
//    删除
    window.viewRemove = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/pkSpIf/delete",
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
//    $(document).keypress(function(e) {
//        // 回车键事件
//        if(e.which == 13) {
//            $("#grid").dataTable().api().ajax.reload();
//        }
//    });
});
