var myapp = angular.module("myapp", []);
myapp.controller("EquipBind", function ($scope, $http, $state) {
    /* 设备绑定<br>;
    *<p>加载树</p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //a请求树
    window.httpTree = function () {
        $http({
            url: "/eleting-web/pkIf/getPkIfTree",
            method: "get",
            dataType: "json",
            params: {pkPosAreaCode: window.localStorage.getItem('areaCode')},
        }).success(function (data) {
            getMenuTree(data.datum);
        }).error(function () {
        });
    }();

    function getMenuTree(data) {
        $("#menuTt").tree({
            data: data,
            onClick: function (node) {
                //$("#menuTt").tree("toggle", node.target);
            },
            onLoadSuccess: function (node, data) {
                //$("#menuTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                //var n = $("#menuTt").tree("getSelected");
                //if(n!=null){
                //    $("#menuTt").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                //    $("#menuTt").tree("toggle",n.target);
                //}
                //隐藏根节点
                $("#" + $('#menuTt').tree('getRoot').domId).hide();
                //    清楚缓存
                window.localStorage.setItem('bindwg', '');
                window.localStorage.setItem('binddc', '');
                window.localStorage.setItem('bindzjq', '');
                window.localStorage.setItem('bindzpk', '');
            },
            onClick: function (node) {
                $('.tebwg').css('display', 'none');
                $('.tebdc').css('display', 'none');
                $('.tebtcw').css('display', 'none');
                // toggle
                $("#menuTt").tree("toggle", node.target);
                $(node.target).closest('li').siblings().children('.tree-node').each(function () {
                    $("#menuTt").tree("collapse", this);
                });
                window.localStorage.setItem('bindPk', node.id);
                window.localStorage.setItem('bindPkName', node.text);
                window.localStorage.setItem('bindwg', '');
                window.localStorage.setItem('binddc', '');
                window.localStorage.setItem('bindzjq', '');
                $scope.myTreeType = node.treeType;
                qihuan(node.treeType);
                httpTree(node.id)
            }
        });
    };
    /* 设备绑定<br>;
     *<p>加载二级树</p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //a请求树
    window.httpTree = function (obj) {
        $http({
            url: "/eleting-web/otherEpIf/getTree",
            method: "get",
            dataType: "json",
            params: {pkIfId: obj},
        }).success(function (data) {
            getparamsTree(data.datum);
        }).error(function () {

        });
    };

    function getparamsTree(data) {
        $("#menuTt1").tree({
            data: data,
            onLoadSuccess: function (e, data) {
                var nodes = $('#menuTt1').tree('getChildren');//获取所有节点
                for (var k = 0; k < nodes.length; k++) {
                    switch (nodes[k].treeType) {
                        case 0:
                            $("#" + nodes[k].target.id + " .tree-icon").addClass("gui-tcc");
                            break;
                        case 1:
                            $("#" + nodes[k].target.id + " .tree-icon").addClass("gui-wg");
                            break;
                        case 2:
                            $("#" + nodes[k].target.id + " .tree-icon").addClass("gui-zjq");
                            break;
                        case 3:
                            $("#" + nodes[k].target.id + " .tree-icon").addClass("gui-dc");
                            break;
                        case 4:
                            $("#" + nodes[k].target.id + " .tree-icon").addClass("gui-tcw");
                            break;
                    }
                }

                //$("#menuTt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                //var n = $("#menuTt1").tree("getSelected");
                //if(n!=null){
                //    $("#menuTt1").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
                //    $("#menuTt1").tree("toggle",n.target);
                //}
                //隐藏根节点
                $("#" + $('#menuTt1').tree('getRoot').domId).hide();
                //    清空缓存
            },
            onContextMenu: function (e, row) {

                Ev = e || window.event;
                var mousePos = mouseCoords(Ev);

                function mouseCoords(ev) {
                    if (ev.pageX || ev.pageY) {
                        return {x: ev.pageX, y: ev.pageY};
                    }
                    return {
                        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                        y: ev.clientY + document.body.scrollTop - document.body.clientTop
                    };
                }

                if (row.treeType != 0) {
                    if (row.treeType == 3) {
                        $(".equipLine").css("display", "block")
                    } else {
                        $(".equipLine").css("display", "none")
                    }
                    $("#myDiv").css("left", mousePos.x + 'px').css('top', mousePos.y + 'px');
                    $scope.ThisTypeName = row.treeType;
                    $scope.myTreeId = row.id;//节点类型
                    $("#menuTt1").tree("select", row.target);
                } else {
                    $("#myDiv").css("left", -10000 + 'px').css('top', -10000 + 'px');
                }
            },
            onClick: function (node, e) {
                $('.tebwg').css('display', 'none');
                $('.tebdc').css('display', 'none');
                $('.tebtcw').css('display', 'none');
                $scope.myTreeType = node.treeType;//节点类型
                $("#myDiv").css("left", -10000 + 'px').css('top', -10000 + 'px');
                // toggle
                //$("#menuTt1").tree("toggle", node.target);
                //$(node.target).closest('li').siblings().children('.tree-node').each(function(){
                //    $("#menuTt1").tree("collapse", this);
                //});
                switch (node.treeType) {
                    case 0:
                        window.localStorage.setItem('bindwg', '');
                        window.localStorage.setItem('binddc', '');
                        window.localStorage.setItem('bindzjq', '');
                        break;
                    case 1:
                        $scope.myBindwg = node.id;
                        window.localStorage.setItem('bindwg', node.id);
                        window.localStorage.setItem('binddc', '');
                        window.localStorage.setItem('bindzjq', '');
                        break;
                    case 2:
                        $scope.myBindzjq = node.id;
                        window.localStorage.setItem('bindzjq', node.id);
                        window.localStorage.setItem('bindwg', '');
                        window.localStorage.setItem('binddc', '');
                        break;
                    case 3:
                        $scope.myBinddc = node.id;
                        window.localStorage.setItem('binddc', node.id);
                        window.localStorage.setItem('bindwg', '');
                        window.localStorage.setItem('bindzjq', '');
                        break;
                    case 4:
                        $(".wg").css('display', 'none');
                        $(".zjq").css('display', 'none');
                        $(".dc").css('display', 'none');
                        $(".tcw").css('display', 'none');

                }
                qihuan(node.treeType)
            }
        });
    }

//取消浏览器右键点击默认菜单
    function doNothing() {
        window.event.returnValue = false;
        return false;
    }

    var myBody = document.getElementsByTagName("body")[0];
    var table = document.getElementById('menuTt1');
    var table1 = document.getElementById('equipBind');
    var table2 = document.getElementById('menuTt');
    //myBody.oncontextmenu = function () {
    //    return false;
    //};
    table.oncontextmenu = function () {
        return false;
    };
    table1.oncontextmenu = function () {
        return false;
    };
    table2.oncontextmenu = function () {
        return false;
    };
    $('body').on('click', function () {
        $("#myDiv").css("left", -10000 + 'px').css('top', -10000 + 'px');
    });
    //解除绑定
    $scope.relieveArr = {}
    $scope.relieveParams = function (obj) {
        $scope.relieveArr = {};
        $scope.relieveArr.id = $scope.myTreeId;//主键id
        $scope.relieveArr.treeType = $scope.ThisTypeName;
        $("#myDiv").css("left", -10000 + 'px').css('top', -10000 + 'px');
        $http({
            url: "/eleting-web/otherEpIf/updateForCutBind",
            method: "post",
            dataType: "json",
            params: {id: $scope.myTreeId, treeType: $scope.ThisTypeName},
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("解绑成功", 'info');
                httpTree(window.localStorage.getItem('bindPk'))
                $('.tebwg').css('display', 'none');
                $('.tebdc').css('display', 'none');
                $('.tebtcw').css('display', 'none');
                $(".wg").css('display', 'none');
                $(".zjq").css('display', 'none');
                $(".dc").css('display', 'none');
                $(".tcw").css('display', 'none');
            } else {

            }
        }).error(function () {

        });
    }
//上线
    $scope.ONlineParams = function () {
        var timestamp = (new Date()).valueOf();
        timestamp = new Date(timestamp + 28800000).toISOString().slice(0, 10) + " " + new Date(timestamp + 28800000).toISOString().slice(11, 19)
        $http({
            url: "/eleting-web/epGemIf/update",
            method: "post",
            dataType: "json",
            data: {busStatus: "02", id: $scope.myTreeId, epGemOnlineTime: timestamp},
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("上线成功", 'info');
            } else {
                jBox.tip("上线失败", 'info');
            }
        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    }
    //下线
    $scope.DownLineParams = function () {
        var timestampOff = (new Date()).valueOf();
        timestampOff = new Date(timestampOff + 28800000).toISOString().slice(0, 10) + " " + new Date(timestampOff + 28800000).toISOString().slice(11, 19)
        // console.log('解绑',timestampOff)
        // return false
        $http({
            url: "/eleting-web/epGemIf/update",
            method: "post",
            dataType: "json",
            data: {busStatus: "03", id: $scope.myTreeId, epGemOfflineTime: timestampOff},
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("下线成功", 'info');
            } else {
                jBox.tip("下线失败", 'info');
            }
        }).error(function () {
            jBox.tip("链接失败", 'info');
        });
    }
    //按钮切换
    window.qihuan = function (data) {
        switch (data) {
            case 0:
                $(".wg").css('display', 'inline');
                $(".zjq").css('display', 'none');
                $(".dc").css('display', 'inline');
                $(".tcw").css('display', 'none');
                break;
            case 1:
                $(".wg").css('display', 'none');
                $(".zjq").css('display', 'inline');
                $(".dc").css('display', 'inline');
                $(".tcw").css('display', 'none');
                break;
            case 2:
                $(".wg").css('display', 'none');
                $(".zjq").css('display', 'none');
                $(".dc").css('display', 'inline');
                $(".tcw").css('display', 'none');
                break;
            case 3:
                $(".wg").css('display', 'none');
                $(".zjq").css('display', 'none');
                $(".dc").css('display', 'none');
                $(".tcw").css('display', 'inline');
                break;
        }
    };
    //请求数据
    $scope.paramsHttp = function (obj) {
        if (obj == 'wg' || obj == 'zjq') {
            $('.tebwg').css('display', 'block');
            $('.tebdc').css('display', 'none');
            $('.tebtcw').css('display', 'none');
            window.localStorage.setItem('gridType', obj);
            $("#wggrid").dataTable().api().ajax.reload();
        } else if (obj == 'dc') {
            $('.tebwg').css('display', 'none');
            $('.tebdc').css('display', 'block');
            $('.tebtcw').css('display', 'none');
            $("#dcgrid").dataTable().api().ajax.reload();
        } else if (obj == 'tcw') {
            $('.tebwg').css('display', 'none');
            $('.tebdc').css('display', 'none');
            $('.tebtcw').css('display', 'block');
            $("#tcwgrid").dataTable().api().ajax.reload();
        }
    };
    //网关跟中继器查询
    $scope.paramsHttpCheck = function () {
        $("#wggrid").dataTable().api().ajax.reload();
    };
    /* 设备绑定<br>
     * 功能描述：<br>
     * <p>
     *  加载中继器或者网关
     * </p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.equipParqamsFac = {};
    $scope.uniqueMarkFac = {};
    $scope.equipParqamsFac.pageNum = '1';
    $scope.equipParqamsFac.pageSize = '100000';
    window.paramsGrid = function () {
        //加载码表(厂商)
        $http({
            url: "/eleting-web/epGemParams/getProviders",
            method: "get",
            dataType: "json",
            params: $scope.equipParqamsFac,
        }).success(function (data) {
            $scope.uniqueMarkFac = data.datum.list;
        }).error(function () {

        });
        //加载网关或者中继器表格
        $("#wggrid").dataTable({
            fnDrawCallback: function () {
                //设置选中状态
                $("#wggrid >tbody >tr").click(function () {
                    $(this).children("td").eq(0).children().prop("checked", true);
                    $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                });
                $("#wggrid >tbody >tr").mouseover(function () {
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                });
            },
            ajax: {
                url: "/eleting-web/otherEpIf/getOtherEpIfPageInfoByCondition",
                data: function (params) {
                    params.pageNum = parseInt((params.start + 1) / params.length + 1);
                    params.pageSize = params.length;
                    params.deviceTypeId = window.localStorage.getItem('gridType');
                    params.providerId = $("select[name='zjq']").val();
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
                    width: "3%"

                },
                {
                    data: "epName",
                    title: "设备名称",
                    width: "20%"
                },
                {
                    data: "equipTypeName",
                    title: "设备类型",
                    width: "20%"
                },
                {
                    data: "deviceId",
                    title: "设备编号",
                    width: "15%"
                },
                {
                    data: "providerName",
                    title: "厂商名称",
                    width: "20%"
                },
                {
                    data: "model",
                    title: "型号",
                    width: "10%"
                },
                {
                    data: "id",
                    title: "操作",
                    render: function (data, type, row) { // 模板化列显示内容
                        var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">绑定</button>';
                        return butt
                    },
                    width: "12%"
                }

            ],
        });
    }();
    /* 设备绑定<br>
     * 功能描述：<br>
     * <p>
     *  网关与选中
     * </p>
     * @param  $scope.geoMange：选中内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.EquipBindWgMange = {};
    $scope.EquipBindZjqMange = {};
    $scope.EquipBindSeaMange = {};
    window.viewUpdate = function (data) {
        var rows = $("#wggrid").DataTable().rows('.selected').data();
        if (rows[0].deviceTypeId == 'wg') {
            updateUse(data)
        } else {
            zjqupdateUse(data);
        }
    };

    //绑定网关
    function updateUse(obj) {
        $scope.EquipBindWgMange = {};//清空数据
        var rows = $("#wggrid").DataTable().rows('.selected').data();
        $scope.EquipBindWgMange.id = rows[0].id;//主键ID
        $scope.EquipBindWgMange.pkIfId = window.localStorage.getItem('bindPk')//停车厂ID
        $http({
            url: "/eleting-web/otherEpIf/update",
            method: "post",
            dataType: "json",
            data: $scope.EquipBindWgMange,
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("绑定成功", 'info');
                httpTree(window.localStorage.getItem('bindPk'))
            } else {
                jBox.tip("绑定失败", 'info');
            }
        }).error(function () {

        });
    }

    //绑定修改中继器数据
    function zjqupdateUse(obj) {
        $scope.EquipBindZjqMange = {};//清空数据
        var rows = $("#wggrid").DataTable().rows('.selected').data();
        $scope.EquipBindZjqMange.id = rows[0].id;//主键ID
        $scope.EquipBindZjqMange.gatewayId = $scope.myBindwg//网关厂ID
        $http({
            url: "/eleting-web/otherEpIf/update",
            method: "post",
            dataType: "json",
            data: $scope.EquipBindZjqMange,
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("绑定成功", 'info');
                httpTree(window.localStorage.getItem('bindPk'))
            } else {
                jBox.tip("绑定失败", 'info');
            }
        }).error(function () {

        });
    }

    /* 设备绑定<br>
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
    $scope.uniqueMarkArae.uniqueMark = "areaCode";
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
    /* 设备绑定<br>
     * 功能描述：<br>
     * <p>
     *  加载地磁
     * </p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    ;
    $scope.dcgrid = {}
    window.paramsDcGrid = function (obj) {
        //加载地磁
        $("#dcgrid").dataTable({
            fnDrawCallback: function () {
                //设置选中状态
                $("#dcgrid >tbody >tr").click(function () {
                    $(this).children("td").eq(0).children().prop("checked", true);
                    $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                });
                $("#dcgrid >tbody >tr").mouseover(function () {
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                });
            },
            ajax: {
                url: "/eleting-web/epGemIf/getEpGemIfPageInfoByCondition",
                data: function (params) {
                    params.pageNum = parseInt((params.start + 1) / params.length + 1);
                    params.pageSize = params.length;
                    params.deviceTypeId = 'dc';
                    params.epGemArea = $("select[name='epGemArea']").val();
                    params.epGemName = $scope.dcgrid.epGemName;
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
                    width: "5%"
                },
                {
                    data: "id",
                    title: "设备类型",
                    render: function () {
                        return '地磁'
                    },
                    width: "10%"
                },
                {
                    data: "epGemName",
                    title: "设备名称",
                    width: "30%"
                },
                {
                    data: "areaName",
                    title: "所属片区",
                    width: "15%"
                },

                {
                    data: "epGemPdtr",
                    title: "厂商名称",
                    width: "15%"
                },
                {
                    data: "epGemModelNo",
                    title: "型号",
                    width: "15%"
                },
                {
                    data: "id",
                    title: "操作",
                    render: function (data, type, row) { // 模板化列显示内容
                        var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="DcviewUpdate(\'' + data + '\')">绑定</button>';
                        return butt
                    },
                    width: "15%"
                }

            ],
        });
    }();
    /* 设备绑定<br>
     * 功能描述：<br>
     * <p>
     *  地磁选中
     * </p>
     * @param  $scope.geoMange：选中内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.EquipBindDcMange = {};
    $scope.EquipBindSeaMange = {};
    window.DcviewUpdate = function (data) {
        DcupdateUse(data)
    };

    function DcupdateUse(obj) {
        $scope.EquipBindDcMange = {};//清空数据
        var rows = $("#dcgrid").DataTable().rows('.selected').data();
        $scope.EquipBindDcMange.id = rows[0].id;//主键ID
        if (window.localStorage.getItem('bindzjq') == '') {
            if (window.localStorage.getItem('bindwg') == '') {
                $scope.EquipBindDcMange.pkIfId = window.localStorage.getItem('bindPk')//停车厂ID
                $scope.EquipBindDcMange.gatewayId = -1// 网关主键ID
                $scope.EquipBindDcMange.repeaterId = -1//中继器主键ID
                //bindDarParams(window.localStorage.getItem('bindPk'),$scope.myTreeType)
            } else {
                $scope.EquipBindDcMange.pkIfId = -1;//停车厂ID
                $scope.EquipBindDcMange.gatewayId = $scope.myBindwg;//网关主键ID
                $scope.EquipBindDcMange.repeaterId = -1//中继器主键ID
                //bindDarParams($scope.myBindwg,$scope.myTreeType)
            }
        } else {
            $scope.EquipBindDcMange.pkIfId = -1//停车厂ID
            $scope.EquipBindDcMange.gatewayId = -1//网关主键ID
            $scope.EquipBindDcMange.repeaterId = $scope.myBindzjq;//中继器主键ID
            //bindDarParams($scope.myBindzjq,$scope.myTreeType)
        }
        ;
        $http({
            url: "/eleting-web/epGemIf/update",
            method: "post",
            dataType: "json",
            data: $scope.EquipBindDcMange,
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("绑定成功", 'info');
                httpTree(window.localStorage.getItem('bindPk'))
            } else {
                jBox.tip("绑定失败", 'info');
            }
        }).error(function () {
        });
    }

    /* 设备绑定<br>;
     * 功能描述：<br>
     * <p>
     *  加载停车位
     * </p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.paramsTcwGrid = function (obj) {
        //加载网关或者中继器表格
        $("#tcwgrid").dataTable({
            fnDrawCallback: function () {
                //设置选中状态
                $("#tcwgrid >tbody >tr").click(function () {
                    $(this).children("td").eq(0).children().prop("checked", true);
                    $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                });
                $("#tcwgrid >tbody >tr").mouseover(function () {
                    $(this).addClass('selected');
                    $(this).siblings().removeClass('selected');
                });
            },
            ajax: {
                url: "/eleting-web/pkSpIf/getPkSpIfPageInfoByCondition",
                dataSrc: function (json) {
                    json.recordsTotal = json.datum.total;//总个数
                    json.recordsFiltered = json.datum.total;
                    json.start = json.datum.pageNum * json.datum.pageSize - 10;//起始位置
                    json.length = json.datum.pageSize;
                    return json.datum.pkSpIfList;
                },
                data: function (params) {
                    params.pageNum = parseInt((params.start + 1) / params.length + 1);
                    params.pageSize = params.length;
                    params.pkName = window.localStorage.getItem('bindPkName');
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
                    width: "3%"

                },
                {
                    data: "pkName",
                    title: "停车场名称",
                    width: "12%"
                },
                {
                    data: "pkSpNumber",
                    title: "停车位号",
                    width: "12%"
                },
                {
                    data: "pkSpGroupName",
                    title: "停车位组",
                    width: "5%"
                },
                {
                    data: "id",
                    title: "操作",
                    render: function (data, type, row) { // 模板化列显示内容
                        var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt "  onclick="TcwviewUpdate(\'' + data + '\')">绑定</button>';
                        return butt
                    },
                    width: "14%"
                }

            ],
        });
    }();
    /* 设备绑定<br>
     * 功能描述：<br>
     * <p>
     *  地磁选中
     * </p>
     * @param  $scope.geoMange：选中内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.EquipBindTcwMange = {};
    $scope.EquipBindSeaMange = {};
    window.TcwviewUpdate = function (data) {
        TcwupdateUse(data)
    };

    function TcwupdateUse(obj) {
        $scope.EquipBindTcwMange = {};//清空数据
        var rows = $("#tcwgrid").DataTable().rows('.selected').data();
        $scope.EquipBindTcwMange.id = rows[0].id;//主键ID
        $scope.EquipBindTcwMange.epGemIfId = window.localStorage.getItem('binddc')//停车厂ID
        $http({
            url: "/eleting-web/pkSpIf/updateForBind",
            method: "post",
            dataType: "json",
            data: $scope.EquipBindTcwMange,
        }).success(function (data) {
            if (data.code == 200) {
                jBox.tip("绑定成功", 'info');
                httpTree(window.localStorage.getItem('bindPk'))
            } else if (data.code == 411) {
                jBox.tip("地磁已绑定有车位，请重新选择地磁或者解除该地磁车位绑定", 'info');
            } else {
                jBox.tip("绑定失败", 'info');
            }

        }).error(function () {

        });
    }
});

