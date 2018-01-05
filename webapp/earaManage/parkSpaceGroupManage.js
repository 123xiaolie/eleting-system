var myapp=angular.module("myapp",[]);
myapp.controller("parkSpaceGroupManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 停车位组管理<br>
     * @param  $scope.parkSpaceGroupManage：新增内容集合<br>
     * @param  $scope.parkSpaceGroupManageseach：查询内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkSpaceGroupManage={};
    $scope.parkSpaceGroupManageseach={}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse();
            });
        },
        ajax: {
            url: "/eleting-web/pkSpIfGroup/getPkSpIfGroupPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.pkName=$scope.parkSpaceGroupManageseach.pkName;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                title: "序号",
                data: function (data, type, row, meta) {
                    return meta.row + 1
                },
                width:"5%"

            },
            {
                data: "pkName",
                title: "停车场名字",
                width:"20%"

            },
            {
                data: "pkSpGroupName",
                title: "停车位组名称",
                width:"10%"

            },
            {
                data: "pkIfNo",
                title: "停车场编号",
                width:"50%"

            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width:"15%"
            }

        ],
    });
    /* 停车位组管理<br>
     * 功能描述：<br>
     * <p>
     *  新增，加载停车场
     * </p>
     * @param  targe：新增按钮限制参数<br>
     * @param  $scope.parkSpaceGroupManage.pkIfId：选中停车场ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $("#gridStop").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#gridStop >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#gridStop").DataTable().rows('.selected').data();
                submitEnt(rows[0].id);
            });
            $("#gridStop >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
        },
        pageLength:"5",
        paging:false,
        ajax: {
            url: "/eleting-web/pkIf/getPkIfPageInfoByCondition",
            dataSrc: function (json) {
                if(json.code==444){
                    $('#myModal').modal('hide');
                }
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum*json.datum.pageSize-10;//起始位置
                json.length =json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1)+1;
                params.pageSize=params.length+11;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON",
        },
        columns: [
            {
                title: "选择",
                data:"",
                render: function (data, type, row) { // 模板化列显示内容
                    var redio="<input type='radio' name='222'/>";
                    return redio

                },
                width:"5%"
            },
            {
                data: "pkName",
                title: "停车场名字",
                width:"55%"

            },
            {
                data: "pkSpAmnt",
                title: "停车场停车位数量",
                width:"15%"

            },
            {
                data: "pkPosAreaCode",
                title: "区域代码",
                width:"15%"

            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEnt(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width:"10%"
            }

        ],
    });
    //选择停车场
    window.submitEnt=function(){
        var rows = $("#gridStop").DataTable().rows('.selected').data();
        $("input[name='pkName']").val(rows[0].pkName);
        $scope.parkSpaceGroupManage.pkIfId=rows[0].id
    }
    $scope.model={};
    $scope.modelShow=function(){
        $scope.targe=0;
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        var timestamp = Date.parse(new Date());
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
        $('#myform').data('bootstrapValidator').resetForm(true);
    }
    $scope.geoadd=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/pkSpIfGroup/add",
            method:"post",
            dataType: "json",
            data:$scope.parkSpaceGroupManage,
        }).success(function(data){
            $("#grid").dataTable().api().ajax.reload();
            $('#myModal').modal('hide');
            jBox.tip("新增成功", 'info');
        }).error(function(){

        });
    };
    /* 停车位组管理<br>
     * 功能描述：<br>
     * <p>
     *  修改，加载停车场
     * </p>
     * @param  targeUpdate：新增按钮限制参数<br>
     * @param  $scope.parkSpaceGroupManage1.pkIfId：选中停车场ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $("#gridUpdateStop").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#gridUpdateStop >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                submitEntUpdate();
            });
            $("#gridUpdateStop >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
        },
        pageLength:"5",
        paging:false,
        ajax: {
            url: "/eleting-web/pkIf/getPkIfPageInfoByCondition",
            dataSrc: function (json) {
                if(json.code==444){
                    $('#myUpdateModal').modal('hide');
                    setTimeout(function(){
                        $state.go("login/loginCheck");
                        swal({
                            title: '登录失效，请重新登录',
                            type: 'warning',
                            timer:'2000',
                            showCancelButton: false,
                            showConfirmButton:false,
                        });
                    },1000);
                    return false;
                }
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum*json.datum.pageSize-10;//起始位置
                json.length =json.datum.pageSize;
                return json.datum.list;
            },
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1)+1;
                params.pageSize=params.length+11;
                //params.pkName=$scope.epPdaIfIdGridStop.pkName;
                //params.pkPosAreaCode=$scope.epPdaIfIdGridStop.pkPosAreaCode;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                title: "选择",
                data:"",
                render: function (data, type, row) { // 模板化列显示内容
                    var redio="<input type='radio' name='222'/>";
                    return redio

                },
                width:"5%"
            },
            {
                data: "pkName",
                title: "停车场名字",
                width:"55%"

            },
            {
                data: "pkSpAmnt",
                title: "停车场停车位数量",
                width:"15%"

            },
            {
                data: "pkPosAreaCode",
                title: "区域代码",
                width:"15%"

            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="submitEntUpdate(\'' + data + '\')">选择</button>';
                    return butt;
                },
                width:"10%"
            }

        ],
    });
    window.submitEntUpdate=function(){
        var rows = $("#gridUpdateStop").DataTable().rows('.selected').data();
        $("input[name='pkName1']").val(rows[0].pkName);
        $scope.parkSpaceGroupManage1.pkIfId=rows[0].id
    }
    window.viewUpdate=function(data){
        updateUse(data)

    };
    function updateUse(obj){
        $scope.targeUpdate=0;
        $("#myupdateform").data('bootstrapValidator').destroy();
        $('#myupdateform').bootstrapValidator();
        $(".updateYes").removeAttr("disabled")//移除禁用属性
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.parkSpaceGroupManage1=rows[0];
        $("input[name='pkName1']").val(rows[0].pkName);
        $("input[name='pkSpGroupName1']").val(rows[0].pkSpGroupName);
        console.log("$scope.parkSpaceGroupManage1",$scope.parkSpaceGroupManage1)
        $('#myUpdateModal').modal('show');
    }
    //保存修改
    $scope.patroUpdate=function(){
        $scope.targeUpdate=1;
        if($scope.targeUpdate==1){
            $(".updateYes").attr("disabled","disabled")
        }
        console.log("修改",$scope.parkSpaceGroupManage1)
        //return false
        $http({
            url:"/eleting-web/pkSpIfGroup/update",
            method:"post",
            dataType: "json",
            data:$scope.parkSpaceGroupManage1,
        }).success(function(data){
            if(data.code==200){
                $('#myUpdateModal').modal('hide');
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
            }else {
                jBox.tip("修改失败", 'info');
            }

        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
//    删除
    window.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/pkSpIfGroup/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                }).success(function(data){
                    //$("#grid").dataTable().api().ajax.reload();
                    $("#grid").dataTable().fnDraw(false);
                    jBox.tip("删除成功", 'info');
                }).error(function(){

                });
            else
                jBox.tip("删除失败", 'info');

            return true;
        };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, { buttons: { '确认': true, '取消': false} });

    };
    //    查询
    $scope.parkSGtabChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $scope.parkSGtabChexked()
        }
    });

});
