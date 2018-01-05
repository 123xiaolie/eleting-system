var myapp = angular.module("myapp", []);
myapp.controller("parameterModel", function ($scope, $http, $state) {
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 动态添加模板下拉
     * </p>
     * <br>@param $scope.parameterManageModuleShow：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    window.mySelect = function () {
        var myobj = document.getElementById('moduleId');
        //删除所有项
        myobj.options.length = 1;
        //添加一个选项
        for (var o = 0; o < $scope.parameterManageModuleShow.length; o++) {
            //obj.add(new Option("文本","值")); //这个只能在IE中有效
            myobj.options.add(new Option($scope.parameterManageModuleShow[o].moduleName, $scope.parameterManageModuleShow[o].moduleId)); //这个兼容IE与firefox
        }
        //参数
        var myobjparamsMoudleId = document.getElementById('paramsMoudleId');
        //删除所有项
        myobjparamsMoudleId.options.length = 1;
        //添加一个选项
        for (var o = 0; o < $scope.parameterManageModuleShow.length; o++) {
            //obj.add(new Option("文本","值")); //这个只能在IE中有效
            myobjparamsMoudleId.options.add(new Option($scope.parameterManageModuleShow[o].moduleName, $scope.parameterManageModuleShow[o].moduleId)); //这个兼容IE与firefox
        }

    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 加载模板列表
     * </p>
     * <br>@param $scope.chargeStrategyModuleId：模板数据集合
     * <br>@param $scope.ModelAllParams：返回模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.fileFIrstParmasId = null;
    $scope.ModelAllParams = {};
    $scope.parameterManageModuleShow = {};
    $("#Modelgrid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#Modelgrid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#Modelgrid >tbody >tr").dblclick(function () {
                var rows = $("#Modelgrid").DataTable().rows('.selected').data();
                $scope.ModelUsefun(rows[0].moduleId);
            });
        },
        paging: false,
        ajax: {
            url: "/eleting-web/configuration_management/get_module_info",
            dataSrc: function (json) {
                if (json.code == 200) {
                    json.recordsTotal = json.datum.length;//总个数
                    json.recordsFiltered = json.datum.length;
                    json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                    json.length = json.datum.pageSize;
                    $scope.fileFIrstParmasId = json.datum[0].moduleId;
                    $scope.parameterManageModuleShow = {};//模板下拉数据清空
                    $scope.parameterManageModuleShow = json.datum;
                    window.mySelect()
                    //加载文件列表
                    $("#grid").dataTable().api().ajax.reload();
                    $scope.ModelAllParams = json.datum;
                    return json.datum;
                } else {
                    return ""
                }
            },
            data: function (params) {
                params.pageNum = 1;
                params.pageSize = "10000";
                params.moduleId = $scope.thisModuleId;
            },
            contentType: "application/json",
            type: "get",
            dataType: "JSON"
        },
        columns: [
            {
                data: "moduleName",
                title: "模板名称",
                width: "25%"
            },
            {
                data: "moduleId",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="ModelviewtypeUpdate(\'' + data + '\')">选中</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="ModelviewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });

    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 模板数据回填
     * </p>
     * <br>@param $scope.chargeStrategyModuleId：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.useModul = {}
    window.ModelviewtypeUpdate = function (data) {
        $scope.ModelUsefun(data)
    }
    $scope.ModelUsefun = function (obj) {
        $http({
            url: "/eleting-web/configuration_management/get_module_info_by_id",
            method: "get",
            dataType: "json",
            params: {module_id: obj},
        }).success(function (data) {
            $scope.useModul = data.datum;
            $scope.fileFIrstParmasId = data.datum.moduleId;
            $("#grid").dataTable().api().ajax.reload();
        }).error(function () {

        });
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 新增模板
     * </p>
     * <br>@param $scope.useModuleName：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.ModelAdd = function () {
        for (var i = 0; i < $scope.ModelAllParams.length; i++) {
            if ($scope.ModelAllParams[i].moduleName == $scope.useModul.moduleName) {
                swal({
                    title: "模板" + "【" + $scope.useModul.moduleName + "】" + '已存在',
                    type: 'warning',
                    timer: '2000',
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                return false
            }
        }
        $http({
            url: "/eleting-web/configuration_management/add_module_info",
            method: "post",
            dataType: "json",
            params: {module_name: encodeURI($scope.useModul.moduleName)},
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("新增模板成功", 'info');
                $scope.useModul = ''
                $("#Modelgrid").dataTable().api().ajax.reload();
            } else {
                jBox.tip("新增模板失败", 'info');
            }
        }).error(function () {

        });
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 修改模板
     * </p>
     * <br>@param $scope.chargeStrategyModuleId：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.ModelUpdate = function () {
        $http({
            url: "/eleting-web/configuration_management/modify_module_info",
            method: "post",
            dataType: "json",
            params: {module_id: $scope.useModul.moduleId, module_name: encodeURI($scope.useModul.moduleName)},
        }).success(function (data) {
            if (data.code == 200) {
                $scope.useModul = {};
                $("#Modelgrid").dataTable().api().ajax.reload();
                jBox.tip("修改模板成功", 'info');
            }
        }).error(function () {

        });
    };
    //删除
    window.ModelviewRemove = function (obj) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/configuration_management/delete_module_info",
                    method: "post",
                    dataType: "json",
                    params: {module_id: obj},
                }).success(function (data) {
                    if (data.code == 200) {
                        $("#Modelgrid").dataTable().api().ajax.reload();
                        jBox.tip("删除模板成功", 'info');
                    }
                }).error(function () {

                });
            else
                jBox.tip("删除失败", 'info');
            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };

    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 加载文件列表
     * </p>
     * <br>@param $scope.chargeStrategyModuleId：模板数据集合
     * <br>@param $scope.fileSelectNum：文件集合
     * <br>@param $scope.FileAllParams：返回文件数据几个
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.FileAllParams = -{}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function () {
                var rows = $("#grid").DataTable().rows('.selected').data();
                $scope.fileUsefun(rows[0].fileId);
            });
        },
        paging: false,
        ajax: {
            url: "/eleting-web/configuration_management/get_module_file",
            dataSrc: function (json) {
                if (json.code == 200 && json.datum != null && json.datum.length > 0) {
                    json.recordsTotal = json.datum.length;//总个数
                    json.recordsFiltered = json.datum.length;
                    $scope.paramsFIrstParmasId = json.datum[0].fileId;
                    $("#paramsgrid").dataTable().api().ajax.reload();
                    $scope.FileAllParams = json.datum;
                    return json.datum;
                } else {
                    json.recordsTotal = 0;//总个数
                    json.recordsFiltered = 0;
                    $("#paramsgrid").dataTable().api().ajax.reload();
                    return ""
                }
            },
            data: function (params) {
                params.pageNum = 1;
                params.pageSize = "10000";
                params.module_id = $scope.fileFIrstParmasId;
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
                title: "文件序号",
                width: "5%"
            },
            {
                data: "fileName",
                title: "文件名称",
                width: "15%"
            },
            {
                data: "fileRealName",
                title: "文件原名",
                width: "15%"
            },
            {
                data: "fileType",
                title: "文件类型",
                width: "15%"
            },
            {
                data: "filePath",
                title: "文件路径",
                width: "15%"
            },
            {
                data: "moduleName",
                title: "模板名称",
                width: "20%"
            },
            {
                data: "fileId",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="fileviewtypeUpdate(\'' + data + '\')">选中</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="fileviewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 配置文件新增
     * </p>
     * <br>@param $scope.fileUseModul：模板数据集合
     * <br>@param module_id：模板ID
     * <br>@param file_description：文件名称
     * <br>@param file_type：文件类型
     * <br>@param file_path：文件路径
     * <br>@param File_real_name：文件原名
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.fileContent = {}
    $scope.fileModelAdd = function () {
        for (var j = 0; j < $scope.FileAllParams.length; j++) {
            if ($scope.FileAllParams[j].fileName == $scope.fileUseModul.fileName) {
                swal({
                    title: "文件名:" + "【" + $scope.fileUseModul.fileName + "】" + '已存在',
                    type: 'warning',
                    timer: '2000',
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                return false
            }
        }
        var aa = document.getElementById("moduleId");
        $scope.fileUseModul.moduleName = aa.options[aa.selectedIndex].text;//文件模板名称
        $('#filemyModal').modal('show');
        //$scope.fileContent.fileType=$scope.fileUseModul.fileType;//文件类型
        //$scope.fileContent.filePath=$scope.fileUseModul.fileType;//文件类型

    };
    $scope.modelShowfileAdd = function () {
        $('#filemyModal').modal('hide');
        $http({
            url: "/eleting-web/configuration_management/add_module_file_info",
            method: "post",
            dataType: "json",
            params: {
                module_id: $("select[name='moduleId']").val(),
                file_description: encodeURI($scope.fileUseModul.fileName),
                file_type: $scope.fileUseModul.fileType,
                file_path: $scope.fileUseModul.filePath,
                file_real_name: $scope.fileUseModul.fileRealName
            },
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("新增成功", 'info');
                $scope.fileUseModul = {};
                $scope.fileModelreset()
                $("#grid").dataTable().api().ajax.reload();
            }
        }).error(function () {

        });
    }
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 配置文件重置
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-07-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.fileModelreset = function () {
        document.getElementById("myfileform").reset();
        $("select[name='moduleId']").val("")
        $("select[name='moduleId']").removeAttr('disabled', 'disabled');
        $("select[name='fileType']").removeAttr('disabled', 'disabled');
        $("input[name='fileRealName']").removeAttr('disabled', 'disabled');
    };
    //改变文件刷新表格
    window.modelFileChange = function () {
        var bc = document.getElementById('moduleId');
        $scope.fileFIrstParmasId = bc.value;
        $("#grid").dataTable().api().ajax.reload();
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 配置文件数据回填
     * </p>
     * <br>@param $scope.fileUseModul：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    window.fileviewtypeUpdate = function (data) {
        $scope.fileUsefun(data)
    };
    $scope.fileUsefun = function (obj) {
        $scope.fileUseModul = {};
        $("select[name='moduleId']").attr('disabled', 'disabled');
        $("select[name='fileType']").attr('disabled', 'disabled');
        $("input[name='fileRealName']").attr('disabled', 'disabled');

        $http({
            url: "/eleting-web/configuration_management/get_module_file_by_id",
            method: "get",
            dataType: "json",
            params: {file_id: obj},
        }).success(function (data) {
            $scope.fileUseModul = data.datum;
            $scope.paramsFIrstParmasId = data.datum.fileId;
            $("select[name='moduleId']").val(data.datum.moduleId)
            $("#paramsgrid").dataTable().api().ajax.reload();
        }).error(function () {

        });
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 配置文件保存修改
     * </p>
     * <br>@param $scope.fileUseModul：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.fileModelSave = function () {
        var aa = document.getElementById("moduleId");
        $scope.fileUseModul.moduleName = aa.options[aa.selectedIndex].text;//文件模板名称
        $('#filemyUpdateModal').modal('show');
    };
    $scope.modelShowfileUpdate = function () {
        $('#filemyUpdateModal').modal('hide');
        $http({
            url: "/eleting-web/configuration_management/modify_module_file",
            method: "post",
            dataType: "json",
            params: {
                file_id: $scope.fileUseModul.fileId,
                file_description: encodeURI($scope.fileUseModul.fileName),
                file_type: $scope.fileUseModul.fileType,
                file_path: $scope.fileUseModul.filePath,
                file_real_name: $scope.fileUseModul.fileRealName
            },
        }).success(function (data) {
            if (data.code == 200) {
                $scope.fileUseModul = data.datum;
                $scope.fileModelreset();
                jBox.tip("修改成功", 'info');
                $("#grid").dataTable().api().ajax.reload();
            } else {
                jBox.tip("修改成功", 'info');
            }

        }).error(function () {

        });
    }
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 配置文件s删除
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
        //    删除
    window.fileviewRemove = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/configuration_management/delete_module_file",
                    method: "post",
                    dataType: "json",
                    params: {file_id: data},
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }).success(function (data) {
                    if (data.code == 200) {
                        $("#grid").dataTable().api().ajax.reload();
                        jBox.tip("删除成功", 'info');
                    } else {
                        jBox.tip("删除失败", 'info');
                    }

                }).error(function () {

                });
            else
                jBox.tip("删除失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 加载参数列表
     * </p>
     * <br>@param $scope.chargeStrategyModuleId：模板数据集合
     * <br>@param $scope.ParamsAllParams：返回模板参数数据集合；
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.ParamsAllParams = {};
    $scope.paramsFIrstParmasId = null;
    $("#paramsgrid").dataTable(
        {
        fnDrawCallback: function () {
            //设置选中状态
            $("#paramsgrid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#paramsgrid >tbody >tr").dblclick(function () {
                var rows = $("#paramsgrid").DataTable().rows('.selected').data();
                $scope.paramsUsefun(rows[0].paramId);
            });
        },
        paging: false,
        ajax: {
            url: "/eleting-web/configuration_management/get_conf_param_info",
            dataSrc: function (json) {
                if (json.code == 200 && json.datum != null) {
                    json.recordsTotal = json.datum.length;//总个数
                    json.recordsFiltered = json.datum.length;
                    $scope.ParamsAllParams = json.datum;
                    return json.datum;
                } else {
                    json.recordsTotal = 0;//总个数
                    json.recordsFiltered = 0;
                    return ""
                }
            },
            data: function (params) {
                params.pageNum = 1;
                params.pageSize = '10000';
                params.file_id = $scope.paramsFIrstParmasId;
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
                data: "paramName",
                title: "参数名称",
                width: "17%"
            },
            {
                data: "fileName",
                title: "文件名称",
                width: "15%"
            },
            {
                data: "moduleName",
                title: "模板名称",
                width: "18%"
            },

            {
                data: "paramType",
                title: "参数类型",
                width: "17%"
            },
            {
                data: "paramXpath",
                title: "参数Xpath",
                width: "18%"
            },
            {
                data: "paramId",
                title: "操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="paramsviewtypeUpdate(\'' + data + '\')">选中</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="paramsviewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width: "15%"
            }

        ],
    });
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 参数数据--模板联动文件
     * </p>
     * <br>@param $scope.fileSelectNum：文件集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.fileSelectNum = {}
    $scope.paramsUseModul = {}
    window.modelChange = function () {
        $scope.fileSelectNum = {};
        //$scope.paramsFileChange=
        var cc = document.getElementById('paramsMoudleId');
        var a;
        if (!cc.value) {
            a = $scope.thismodelId
        } else {
            a = cc.value
        }
        $http({
            url: "/eleting-web/configuration_management/get_module_file",
            method: "get",
            dataType: "json",
            params: {module_id: a}
        }).success(function (data) {
            if (data.code == 200) {
                $scope.fileSelectNum = data.datum;
                var myobj = document.getElementById('paramsFileId');
                //删除所有项
                myobj.options.length = 1;
                //添加一个选项

                for (var o = 0; o < data.datum.length; o++) {
                    //obj.add(new Option("文本","值")); //这个只能在IE中有效
                    myobj.options.add(new Option(data.datum[o].fileName, data.datum[o].fileId)); //这个兼容IE与firefox
                }
                $("select[name='paramsFileId']").val($scope.paramsUseModul.fileId);

            }
        }).error(function () {

        });
    };
    window.modelChange();
    //改变文件刷新表格
    window.paramsFileChange = function () {
        var ac = document.getElementById('paramsFileId');
        $scope.paramsFIrstParmasId = ac.value;
        $("#paramsgrid").dataTable().api().ajax.reload();
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 参数---重置
     * </p>
     * <br>@param $scope.paramstarge：限制重复提交
     * <br> 创建者：肖烈 创建时间: 2017-07-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.paramstarge = 0;

    $scope.parmasModelreset = function () {
        document.getElementById("paramsForm").reset();
        $("select[name='paramsMoudleId']").val("")
        $("select[name='paramsMoudleId']").removeAttr('disabled', 'disabled');
        $("select[name='paramsFileId']").removeAttr('disabled', 'disabled');
        $scope.paramstarge = 0;
        $(".paramsaddYes").removeAttr("disabled", "disabled")
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 参数数据---新增
     * </p>
     * <br>@param $scope.paramsUseModul：模板数据集合
     * <br>@param $scope.paramsUseModul：模板数据集合
     * <br>@param file_id：文件ID
     * <br>@param param_description：参数名称
     * <br>@param param_xpath：参数路径
     * <br>@param param_type：参数类型
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.parmasModelAdd = function () {
        $scope.paramsUseModul.param_id = '';
        //$scope.paramstarge=1;
        //if($scope.paramstarge==1){
        //    $(".paramsaddYes").attr("disabled","disabled")
        //}
        for (var k = 0; k < $scope.ParamsAllParams.length; k++) {
            if ($scope.ParamsAllParams[k].paramName == $scope.paramsUseModul.paramName) {
                swal({
                    title: "参数名:" + "【" + $scope.paramsUseModul.paramName + "】" + '已存在',
                    type: 'warning',
                    timer: '2000',
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                return false
            }
        }
        var aa = document.getElementById("paramsFileId");
        $scope.paramsUseModul.paramsFileName = aa.options[aa.selectedIndex].text;
        $('#paramsmyModal').modal('show');
    };
    $scope.modelShowparamsAdd = function () {
        $('#paramsmyModal').modal('hide');
        $http({
            url: "/eleting-web/configuration_management/add_conf_param_info",
            method: "post",
            dataType: "json",
            params: {
                file_id: $("select[name='paramsFileId']").val(),
                param_description: encodeURI($scope.paramsUseModul.paramName),
                param_xpath: $scope.paramsUseModul.paramXpath,
                param_type: $scope.paramsUseModul.paramType
            },
        }).success(function (data) {
            $scope.paramstarge = 0;
            if (data.code == 200) {
                $("#paramsgrid").dataTable().api().ajax.reload();
                $scope.paramsUseModul = {};
                jBox.tip("新增成功", 'info');
                $scope.parmasModelreset()
            } else {
                jBox.tip("新增失败", 'info');
            }
            $scope.paramsUseModul = data.datum;
        }).error(function () {

        });
    }
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 参数数据回填
     * </p>
     * <br>@param $scope.paramsUseModul：模板数据集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    window.paramsviewtypeUpdate = function (data) {
        $scope.paramsUsefun(data)
    };
    $scope.paramsUsefun = function (obj) {
        $scope.paramsUseModul = {};
        $("select[name='paramsMoudleId']").attr('disabled', 'disabled');
        $("select[name='paramsFileId']").attr('disabled', 'disabled');
        $http({
            url: "/eleting-web/configuration_management/get_conf_param_info_by_id",
            method: "get",
            dataType: "json",
            params: {param_id: obj},
        }).success(function (data) {
            $scope.paramsUseModul = data.datum;
            $scope.thismodelId = $scope.paramsUseModul.moduleId;
            $("select[name='paramsMoudleId']").val(data.datum.moduleId)
            window.modelChange();
        }).error(function () {

        });
    };
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 参数数据---修改
     * </p>
     * <br>@param $scope.paramsUseModul：模板数据集合
     * <br>@param $scope.paramsUseModul：模板数据集合
     * <br>@param file_id：文件ID
     * <br>@param param_name：参数名称
     * <br>@param param_xpath：参数路径
     * <br>@param param_type：参数类型
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
    $scope.parmasModelUpdate = function () {
        var aa = document.getElementById("paramsFileId");
        $scope.paramsUseModul.paramsFileName = aa.options[aa.selectedIndex].text;
        $('#pramsmyUpdateModal').modal('show');
    };
    $scope.modelShowparamsUpdate = function () {
        $('#pramsmyUpdateModal').modal('hide');
        $http({
            url: "/eleting-web/configuration_management/modify_module_param",
            method: "post",
            dataType: "json",
            params: {
                param_id: $scope.paramsUseModul.paramId,
                param_name: encodeURI($scope.paramsUseModul.paramName),
                param_xpath: $scope.paramsUseModul.paramXpath,
                param_type: $scope.paramsUseModul.paramType
            },
        }).success(function (data) {
            if (data.code == 200) {
                $("#paramsgrid").dataTable().api().ajax.reload();
                $scope.paramsUseModul = {};
                jBox.tip("修改成功", 'info');
                $scope.parmasModelreset()
            } else {
                jBox.tip("修改失败", 'info');
            }
            $scope.paramsUseModul = data.datum;
        }).error(function () {

        });
    }
    /**
     * 参数模板管理<br>
     * 功能描述：<br>
     * <p>
     * 参数---删除
     * </p>
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     *  @author 肖烈
     *  @version 1.0.0.0
     */
        //    删除
    window.paramsviewRemove = function (data) {
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url: "/eleting-web/configuration_management/delete_module_param",
                    method: "post",
                    dataType: "json",
                    params: {param_id: data},
                }).success(function (data) {
                    if (data.code == 200) {
                        $("#paramsgrid").dataTable().api().ajax.reload();
                        jBox.tip("删除成功", 'info');
                    } else {
                        jBox.tip("删除失败", 'info');
                    }

                }).error(function () {

                });
            else
                jBox.tip("删除失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, {buttons: {'确认': true, '取消': false}});

    };
});
