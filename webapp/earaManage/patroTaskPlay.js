var myapp = angular.module("myapp", []);
myapp.controller("patroTaskPlay", function ($scope, $http, $state) {
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    //    默认区域代码
    $("input[name='areaName']").val(window.localStorage.getItem("areaName"));
    $("input[name='areaName1']").val(window.localStorage.getItem("areaName"));
    $("input[name='pkArea']").val(window.localStorage.getItem("areaCode"));
    $("input[name='pkArea1']").val(window.localStorage.getItem("areaCode"));
    var input = $('.jqPickmeup');
    //日期插件
    input.pickmeup({
        position: 'right',
        before_show: function () {
            input.pickmeup('set_date', input.val(), true);
        },
        change: function (formated) {
            input.val(formated);
        }
    });
    //    新增
    /**
     * 初始化停车位组<br>
     * <br> 创建者：肖烈 创建时间: 2017-04-13
     * <br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.epPdaIfIdGridStop = {}
    function pkSpGroup(obj) {
        $scope.epPdaIfIdGridStop.pageNum = "1";
        $scope.epPdaIfIdGridStop.pageSize = "1000";
        $scope.epPdaIfIdGridStop.pkIfId = obj;
        $http({
            url: "/eleting-web/pkSpIfGroup/getPkSpIfGroupPageInfoByCondition",
            method: "get",
            dataType: "json",
            params: $scope.epPdaIfIdGridStop,
        }).success(function (data) {
            $scope.epPdaIfIdGridStopShow = data.datum.list;
        }).error(function () {

        });
    }

    pkSpGroup()

    $scope.patroTaskMangeseach = {};
    $scope.patroTaskMange = {};
    $("#grid").dataTable({
        ajax: {
            url: "/eleting-web/ispctWkSch/getIspctWkSchPageInfoByCondition",
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
                    json.datum.list[i].ispctWkSchWkDate = new Date(json.datum.list[i].ispctWkSchWkDate + 28800000).toISOString().slice(0, 10);
                }
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.ispctIfId = $scope.patroTaskMangeseach.ispctIfId;
                params.ispctName = $scope.patroTaskMangeseach.ispctName;
                params.pkSpName = $scope.patroTaskMangeseach.pkSpName;
                params.beginDate = $("input[name='fistDate']").val();
                params.endDate = $("input[name='listDate']").val();
            },
            contentType: "application/json",
            type: "get",
            dataType: "JSON"
        },
        columns: [
            {
                data: "ispctIfId",
                title: "巡视员工号",
                width: "8%"

            },
            {
                data: "ispctName",
                title: "巡视员名字",
                width: "10%"
            },
            {
                data: "ispctWkSchWkDate",
                title: "工作计划日期",
                width: "10%"
            },
            {
                data: "pkSpName",
                title: "停车场名字",
                render: function (data, type, row) {
                    if (data != null && data != undefined && data.length > 15) {
                        //var data=
                        return "<a id='" + row.id + "' onmouseover=showPopContent('" + row.id + "','" + data + "')>" + data.substring(0, 10) + "...</a>";
                    } else {
                        return data;
                    }
                },
                width: "10%"
            },
            {
                data: "codeName",
                title: "所属区域",
                width: "10%"
            },
            {
                data: "pkPosStreet",
                title: "停车场所在街道",
                width: "19%"
            },
            {
                data: "pkSpGroupName",
                title: "停车位组",
                render: function (data, type, row) {
                    if (data != null && data != undefined && data.length > 15) {
                        return "<a id='" + row.id + "2" + "' onmouseover=showPopContent('" + row.id + "2" + "','" + data + "')>" + data.substring(0, 10) + "...</a>";
                    } else {
                        return data;
                    }
                },
                width: "8%"
            },
            {
                data: "epPdaIfName",
                title: "PDA设备名字",
                render: function (data, type, row) {
                    if (data != null && data != undefined && data.length > 15) {
                        return "<a id='" + row.id + "1" + "' onmouseover=showPopContent('" + row.id + "1" + "','" + data + "')>" + data.substring(0, 15) + "...</a>";
                    } else {
                        return data;
                    }
                },
                width: "15%"
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
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function () {
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].pkIfId);
            });
        },
    });
    //    新增
    /**
     * 巡视员计划--新增<br>
     * 功能描述：<br>
     * <p>
     * 新增巡查人员计划,停车场列表
     * </p>
     * @param $scope.epPdaIfIdGridStop：巡查人员集合
     * <br>
     * @param $scope.epPdaIfIdGridStopShow：停车位组集合
     * <br> 创建者：肖烈 创建时间: 2017-04-13
     * <br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.epPdaIfIdGridStop = {};
    $scope.epPdaIfIdGridStopShow = {};
    $("#epPdaIfIdGridStop").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#epPdaIfIdGridStop >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#epPdaIfIdGridStop").DataTable().rows('.selected').data();
                submitEntStop(rows[0].id);
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
                params.pkName = $scope.epPdaIfIdGridStop.pkName;
                params.pkPosAreaCode = window.localStorage.getItem("areaCode");
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
                    var redio = "<input type='radio' name='epPdaIfIdGridStop'/>";
                    return redio

                },
                width: "5%"
            },
            {
                data: "pkName",
                title: "停车场名字",
                width: "60%"

            },
            {
                data: "codeName",
                title: "所属区域",
                width: "20%"
            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEntStop(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    window.submitEntStop = function (data) {
        $("#epPdaIfIdGridFa").css("display", "block");
        var rows = $("#epPdaIfIdGridStop").DataTable().rows('.selected').data();
        $("input[name='pkIfId']").val(rows[0].id);
        $("input[name='pkName']").val(rows[0].pkName);
        $("input[name='areaCode']").val(rows[0].areaCode);
        $("input[name='pkArea']").val(rows[0].pkArea);
        $scope.epPdaIfIdGrid.pkSpId = data;//停车场ID
        $scope.epPdaIfIdGrid1.pkSpId = data;
        $("#epPdaIfIdGrid").dataTable().api().ajax.reload();
        $("#epPdaIfIdGrid1").dataTable().api().ajax.reload();
        $("#myform").data("bootstrapValidator").destroy();//先去掉验证，与下面对应
        $("#myform").bootstrapValidator();//初始化验证，与上面对应
        //加载停车场组
        pkSpGroup(data)
    };
    $scope.tabChexkedAddSp = function () {
        $("#epPdaIfIdGridStop").dataTable().api().ajax.reload();
    }
    //PDA列表
    /**
     * 巡视员计划--加载PDA设备列表<br>
     * 功能描述：<br>
     * <p>
     * 加载PDA设备列表
     * </p>
     * @param $scope.epPdaIfIdGrid：PDA内容集合
     * <br>创建者：肖烈 创建时间: 2017-04-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.epPdaIfIdGrid = {};
    $("#epPdaIfIdGrid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#epPdaIfIdGrid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                submitEnt();
            });
        },
        pageLength: "5",
        ajax: {
            url: "/eleting-web/epPdaIf/getEpPdaIfPageInfoByCondition",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.epPdaName = $scope.epPdaIfIdGridStop.epPdaName;
                params.pkSpId = $scope.epPdaIfIdGrid.pkSpId;
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
                    var redio = "<input type='radio' name='22'/>";
                    return redio

                },
                width: "5%"
            },
            {
                data: "epPdaName",
                title: "设备pda名字",
                width: "30%"

            },
            {
                data: "id",
                title: "PDA设备ID",
                width: "30%"

            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEnt(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "35%"
            }

        ],
    });
    //查询PDA
    $scope.tabChexkedAddPDA = function () {
        $("#epPdaIfIdGrid").dataTable().api().ajax.reload();
    }
    //选择PDA
    window.submitEnt = function () {
        var rows = $("#epPdaIfIdGrid").DataTable().rows('.selected').data();
        $("input[name='epPdaIfName']").val(rows[0].epPdaName);
        $("input[name='epPdaIfId']").val(rows[0].id);
        $("#myform").data("bootstrapValidator").destroy();//先去掉验证，与下面对应
        $("#myform").bootstrapValidator();//初始化验证，与上面对应
    };
    //通过区域代码查询巡视员ID、名字、停车场ID
    //巡查人员列表
    /**
     * 巡视员计划--加载巡查人员列表<br>
     * 功能描述：<br>
     * <p>
     * 加载巡查人员列表
     * </p>
     * @param $scope.epPdaIfIdGrid1：巡查人员集合
     * <br>创建者：肖烈 创建时间: 2017-04-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.epPdaIfIdGrid1 = {};
    $("#epPdaIfIdGrid1").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#epPdaIfIdGrid1 >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#epPdaIfIdGrid1").DataTable().rows('.selected').data();
                submitEnt1(rows[0].id);
            });
        },
        pageLength: "5",
        ajax: {
            url: "/eleting-web/ispctIf/getIspctIfPageInfoByCondition",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.ispctWkId = $scope.epPdaIfIdGrid1.ispctWkId;
                params.ispctName = $scope.epPdaIfIdGrid1.ispctName;
                params.ispctArea = window.localStorage.getItem("areaCode");
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
                    var redio = "<input type='radio' name='ispctName'/>";
                    return redio
                },
                width: "5%"
            },
            {
                data: "ispctWkId",
                title: "巡视员ID",
                width: "20%"

            },
            {
                data: "ispctName",
                title: "巡视员名字",
                width: "20%"

            },
            {
                data: "codeName",
                title: "区域代码",
                width: "20%"

            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEnt1(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "35%"
            }

        ],
    });
    //查询巡查人员
    $scope.tabChexkedAddPer = function () {
        $("#epPdaIfIdGrid1").dataTable().api().ajax.reload();
    }
    //选择巡查人员
    window.submitEnt1 = function () {
        var rows = $("#epPdaIfIdGrid1").DataTable().rows('.selected').data();
        $("input[name='ispctName']").val(rows[0].ispctName);
        $("input[name='ispctIfId']").val(rows[0].ispctWkId);
        $("#myform").data("bootstrapValidator").destroy();//先去掉验证，与下面对应
        $("#myform").bootstrapValidator();//初始化验证，与上面对应
    }
    $scope.model = {};
    $scope.modelShow = function () {
        //刷新列表
        $("#epPdaIfIdGridStop").dataTable().api().ajax.reload();
        $("#epPdaIfIdGrid").dataTable().api().ajax.reload();
        $("#epPdaIfIdGrid1").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdetStop").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdet").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdet1").dataTable().api().ajax.reload();
        $scope.targe = 0;
        $(".addYes").removeAttr("disabled", "disabled")//移除禁用属性
        var timestamp = Date.parse(new Date());
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
    };
    $scope.geoadd = function () {
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.targe = 1;
        if ($scope.targe == 1) {
            $(".addYes").attr("disabled", "disabled")
        }
        var aa = document.getElementById("pkSpGroupId");
        $scope.patroTaskMange.pkSpGroupName = aa.options[aa.selectedIndex].text;
        $scope.patroTaskMange.stringDates = $("input[name='ispctWkSchWkDate']").val();
        $scope.patroTaskMange.ispctIfId = $("input[name='ispctIfId']").val();
        $scope.patroTaskMange.ispctName = $("input[name='ispctName']").val();
        $scope.patroTaskMange.pkArea = $("input[name='pkArea']").val();
        $scope.patroTaskMange.pkSpGroupId = $("select[name='pkSpGroupId']").val();
        $scope.patroTaskMange.epPdaIfId = $("input[name='epPdaIfId']").val();
        $scope.patroTaskMange.pkIfId = $("input[name='pkIfId']").val();
        $scope.patroTaskMange.epPdaIfName = $("input[name='epPdaIfName']").val();
        $http({
            url: "/eleting-web/ispctWkSch/add",
            method: "post",
            dataType: "json",
            data: $scope.patroTaskMange,
            headers: {
                token: window.localStorage.getItem("token")
            }
        }).success(function (data) {
            $(".addYes").removeAttr("disabled", "disabled")
            if (data.code == 200) {
                $("#grid").dataTable().api().ajax.reload();
                $("#epPdaIfIdGridFa").css("display", "none");
                $('#myModal').modal('hide');
                jBox.tip("新增成功", 'info');
            } else if (data.code == 300003) {
                jBox.tip("工作计划已存在", 'info');
            } else {
                jBox.tip("新增失败", 'info');
            }

        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    };
    /**
     * 巡视员计划--修改<br>
     * 功能描述：<br>
     * <p>
     * 修改巡视员计划
     * </p>
     * @param $scope.patroTaskMange1：修改巡查人员信息集合<br>
     * @param $scope.epPdaIfIdGridUpdat：查询停车场条件集合<br>
     * @param $scope.epPdaIfIdGridUpdat.pkSpId：停车场主键ID<br>
     * @param pageNum：当前页码<br>
     * @param pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.patroTaskMange1 = {};
    $scope.epPdaIfIdGridUpdat = {}
    $scope.epPdaIfIdGridUpdatGroup = []
    window.viewUpdate = function (data) {
        updateUse(data)
    };
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
            $scope.epPdaIfIdGridUpdatGroup = data.datum.list;
            var myobj = document.getElementById('pkSpGroupId1');
            //珊瑚所有项
            myobj.options.length = 0;
//添加一个选项

            for (var o = 0; o < $scope.epPdaIfIdGridUpdatGroup.length; o++) {
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj.options.add(new Option($scope.epPdaIfIdGridUpdatGroup[o].pkSpGroupName, $scope.epPdaIfIdGridUpdatGroup[o].id)); //这个兼容IE与firefox
            }
            if (a != null && a != "" && a != undefined) {
                $("select[name='pkSpGroupId1']").val(a)
            }
        }).error(function () {

        });
    }

    //pkSpGroupUpdate();

    //点击停车位组请求停车位组数据
    function updateUse(obj) {
        //刷新列表
        $("#epPdaIfIdGridStop").dataTable().api().ajax.reload();
        $("#epPdaIfIdGrid").dataTable().api().ajax.reload();
        $("#epPdaIfIdGrid1").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdetStop").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdet").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdet1").dataTable().api().ajax.reload();
        var rows = $("#grid").DataTable().rows('.selected').data();
        //查询停车位组
        pkSpGroupUpdate(window.localStorage.getItem('patroTaskPlayPkId'), rows[0].pkSpGroupId);
        $scope.epPdaIfIdGridUpdat.pkIfId = rows[0].pkIfId;//停车场ID
        $scope.epPdaIfIdGridUpdat.pageNum = "1";
        $scope.epPdaIfIdGridUpdat.pageSize = "1000";
        $scope.targeUpdate = 0;
        $scope.patroTaskMange1 = rows[0];
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        $('#myUpdateModal').modal('show');
        $scope.patroTaskMange1.pkSpGroupId = rows[0].pkSpGroupId;
        window.localStorage.setItem('patroTaskPlayPkId', rows[0].pkIfId)
        $("input[name='ispctWkSchWkDate1']").val(rows[0].ispctWkSchWkDate);
        $("input[name='ispctIfId1']").val(rows[0].ispctIfId);
        $("input[name='ispctName1']").val(rows[0].ispctName);
        $("input[name='pkSpName1']").val(rows[0].pkSpName);
        $("input[name='pkIfId1']").val(rows[0].pkIfId);
        $("input[name='pkPosStreet1']").val(rows[0].pkPosStreet);
        $("select[name='pkSpGroupId1']").val(rows[0].pkSpGroupId);
        $("input[name='epPdaIfName1']").val(rows[0].epPdaIfName);
        $("input[name='epPdaIfId1']").val(rows[0].epPdaIfId);
    }

    //修改--停车场列表
    $scope.epPdaIfIdGridupdetStop = {};
    $("#epPdaIfIdGridupdetStop").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#epPdaIfIdGridupdetStop >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#epPdaIfIdGridupdetStop >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                var rows = $("#epPdaIfIdGridupdetStop").DataTable().rows('.selected').data();
                submitEntUpdateStop(rows[0].id);
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
                params.pkName = $scope.epPdaIfIdGridupdetStop.pkName;
                params.pkPosAreaCode = window.localStorage.getItem("areaCode");
                //params.pkPosAreaCode="621105";
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
                    var redio = "<input type='radio' name='epPdaIfIdGridStop'/>";
                    return redio

                },
                width: "5%"
            },
            {
                data: "pkName",
                title: "停车场名字",
                width: "60%"

            },
            {
                data: "codeName",
                title: "停车场名字",
                width: "20%"

            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEntUpdateStop(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    window.submitEntUpdateStop = function (data) {
        window.localStorage.setItem('patroTaskPlayPkId', data)
        pkSpGroupUpdate(data)
        $("#epPdaIfIdGridupdetFa").css("display", "block");
        var rows = $("#epPdaIfIdGridupdetStop").DataTable().rows('.selected').data();
        $("input[name='pkIfId1']").val(rows[0].id);
        $("input[name='pkSpName1']").val(rows[0].pkName);
        $("#epPdaIfIdGridupdet").dataTable().api().ajax.reload();
        $("#epPdaIfIdGridupdet1").dataTable().api().ajax.reload();
        $scope.epPdaIfIdGridupdetStop.pageNum = "1";
        $scope.epPdaIfIdGridupdetStop.pageSize = "1000";
        $scope.epPdaIfIdGridupdetStop.pkIfId = data;
        $http({
            url: "/eleting-web/pkSpIfGroup/getPkSpIfGroupPageInfoByCondition",
            method: "get",
            dataType: "json",
            params: $scope.epPdaIfIdGridupdetStop
        }).success(function (data) {
            $scope.epPdaIfIdGridUpdatGroup = data.datum.list;
        }).error(function () {

        });

    };
    $scope.tabChexkedUpdateSp = function () {
        $("#epPdaIfIdGridupdetStop").dataTable().api().ajax.reload();
    };
    //PDA列表
    $("#epPdaIfIdGridupdet").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#epPdaIfIdGridupdet >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#epPdaIfIdGridupdet >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                var rows = $("#epPdaIfIdGridupdet").DataTable().rows('.selected').data();
                submitEntUpdate(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/epPdaIf/getEpPdaIfPageInfoByCondition",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.pkSpId = $scope.epPdaIfIdGridupdetStop.pkIfId;
                params.epPdaName = $scope.epPdaIfIdGridupdetStop.epPdaName;
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
                    var redio = "<input type='radio' name='12'/>";
                    return redio

                },
                width: "5%"
            },
            {
                data: "epPdaName",
                title: "设备pda名字",
                width: "30%"

            },
            {
                data: "id",
                title: "PDA设备ID",
                width: "30%"

            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEntUpdate(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "35%"
            }

        ],
    });
    $scope.tabChexkedUpdatePDA = function () {
        $("#epPdaIfIdGridupdet").dataTable().api().ajax.reload();
    }
    //修改--筛选PDA
    window.submitEntUpdate = function () {
        var rows = $("#epPdaIfIdGridupdet").DataTable().rows('.selected').data();
        $("input[name='epPdaIfName1']").val(rows[0].epPdaName);
        $("input[name='epPdaIfId1']").val(rows[0].id);
    }
    //修改--巡查人员
    /* 巡视员计划--修改<br>
     * 功能描述：<br>
     * <p>
     * 修改巡视人员
     * </p>
     * @param $scope.epPdaIfIdGridPer：修改巡查人员信息集合<br>
     * 创建者：肖烈 创建时间: 2017-04-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.epPdaIfIdGridPer = {};
    $("#epPdaIfIdGridupdet1").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#epPdaIfIdGridupdet1 >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#epPdaIfIdGridupdet1").DataTable().rows('.selected').data();
                submitEntPer(rows[0].id);
            });
        },
        pageLength: "5",
        ajax: {
            url: "/eleting-web/ispctIf/getIspctIfPageInfoByCondition",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                json.length = json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum = parseInt((params.start + 1) / params.length + 1);
                params.pageSize = params.length;
                params.ispctWkId = $scope.epPdaIfIdGridPer.ispctWkId;
                params.ispctName = $scope.epPdaIfIdGridPer.ispctName;
                params.ispctArea = window.localStorage.getItem("areaCode");
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
                    var redio = "<input type='radio' name='ispctName'/>";
                    return redio
                },
                width: "5%"
            },
            {
                data: "ispctWkId",
                title: "巡视员ID",
                width: "30%"

            },
            {
                data: "ispctName",
                title: "巡视员名字",
                width: "30%"

            },
            {
                data: "codeName",
                title: "所属片区",
                width: "20%"

            },
            {
                data: "id",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEntPer(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    //修改--查询巡查人员
    $scope.tabChexkedUpdatePer = function () {
        $("#epPdaIfIdGridupdet1").dataTable().api().ajax.reload();
    }
    //修改---巡查人员选择
    window.submitEntPer = function () {
        var rows = $("#epPdaIfIdGridupdet1").DataTable().rows('.selected').data();
        $("input[name='ispctName1']").val(rows[0].ispctName);
        $("input[name='ispctIfId1']").val(rows[0].ispctWkId);
    }
    //保存修改
    /* 巡视员计划--修改<br>
     * 功能描述：<br>
     * <p>
     * 保存修改
     * </p>
     * @param $scope.patroTaskMange1：修改巡查人员信息集合<br>
     * @param ispctWkSchWkDate：巡视员工作计划工作日期<br>
     * @param ispctIfId：巡视员id<br>
     * @param ispctName：巡视员名字<br>
     * @param pkIfId：停车场信息ID<br>
     * @param pkArea：停车场所在区域划分代码<br>
     * @param pkSpGroupId：停车位组id<br>
     * @param epPdaIfId：PDA设备ID<br>
     * @param pkPosStreet：停车场所在街道<br>
     * 创建者：肖烈 创建时间: 2017-04-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.patroTaskMange1 = {};
    $scope.geoUpdate = function () {
        var aa = document.getElementById("pkSpGroupId1");
        $scope.patroTaskMange1.pkSpGroupName = aa.options[aa.selectedIndex].text;
        $scope.patroTaskMange1.ispctWkSchWkDate = $("input[name='ispctWkSchWkDate1']").val();
        $scope.patroTaskMange1.ispctIfId = $("input[name='ispctIfId1']").val();
        $scope.patroTaskMange1.ispctName = $("input[name='ispctName1']").val();
        $scope.patroTaskMange1.pkIfId = $("input[name='pkIfId1']").val();
        $scope.patroTaskMange1.pkSpName = $("input[name='pkName1']").val();
        $scope.patroTaskMange1.pkArea = $("input[name='pkArea1']").val();
        $scope.patroTaskMange1.pkSpGroupId = $("select[name='pkSpGroupId1']").val();
        $scope.patroTaskMange1.epPdaIfId = $("input[name='epPdaIfId1']").val();
        $scope.patroTaskMange1.epPdaIfName = $("input[name='epPdaIfName1']").val();
        $scope.patroTaskMange1.pkPosStreet = $("input[name='pkPosStreet1']").val();
        $scope.targeUpdate = 1;
        if ($scope.targeUpdate == 1) {
            $(".updateYes").attr("disabled", "disabled")
        }
        $http({
            url: "/eleting-web/ispctWkSch/update",
            method: "post",
            dataType: "json",
            data: $scope.patroTaskMange1,
        }).success(function (data) {
            $(".updateYes").removeAttr("disabled", "disabled")
            if (data.code == 200) {
                $('#myUpdateModal').modal('hide');
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            } else if (data.code == 300003) {
                jBox.tip("工作计划已存在", 'info');
            } else {
                jBox.tip("修改失败", 'info');
            }

        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    };
//    删除
    window.viewRemove = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/ispctWkSch/delete",
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

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };
    //    查询
    $scope.partroTasktabChexked = function () {
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $scope.partroTasktabChexked()
        }
    });
});
