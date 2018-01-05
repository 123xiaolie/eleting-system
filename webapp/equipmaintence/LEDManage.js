var myapp=angular.module("myapp",[]);
myapp.controller("LEDManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* LED显示管理<br>
     * @param  $scope.LEDShowMange：新增内容集合<br>
     * @param  $scope.LEDShowMange：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.LEDShowMange={};
    $scope.LEDShowMangeseach={}
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).prop("checked", true);
                $(this).siblings().removeAttr("checked", "checked");
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/ledInfo/getLedInfoPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.ledId=$scope.LEDShowMangeseach.ledId;
                var aa=document.getElementById("pkIdCheck");
                if(aa.options[aa.selectedIndex].text=='全部')
                params.pkName='';
                else params.pkName=aa.options[aa.selectedIndex].text;
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
                data: "ledId",
                title: "LED编号",
                width:"15%"
            },
            {
                data: "message",
                title: "消息内容",
                width:"40%"
            },
            {
                data: "rollType",
                title: "滚动方式",
                render: function (data, type, row) { // 模板化列显示内容
                   switch (data){
                       case 1:
                           return '横向滚动';
                       break;
                       case 2:
                           return '竖直滚动'
                   }
                },
                width:"10%"
            },
            {
                data: "pkName",
                title: "停车场名字",
                width:"20%"
            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width:"10%"
            }

        ],
    });
    /* LED显示管理<br>
     * 功能描述：<br>
     * <p>
     *  加载停车场
     * </p>
     * @param  $scope.LEDpk：停车场集合<br>
     * @param  pkPosAreaCode：停车场所在区域划分代码<br>
     * @param  pageNum：第几页<br>
     * @param  pageSize：每页多少条<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.LEDpk={};
    $scope.LEDpk.pkPosAreaCode=window.localStorage.getItem('areaCode');
    $scope.LEDpk.pageNum='1';
    $scope.LEDpk.pageSize='100000';
    $http({
        url:"/eleting-web/pkIf/getPkIfPageInfoByCondition",
        method:"get",
        dataType: "json",
        params:$scope.LEDpk,
    }).success(function(data){
        $scope.LEDpkShow=data.datum.list;
    }).error(function(){

    });
    /* LED显示管理<br>
     * 功能描述：<br>
     * <p>
     *  重置
     * </p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.modelRepeat=function(){
        $scope.targe=0;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    /* LED显示管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.targe：限制重复提交<br>
     * @param  $scope.LEDShowMange.rollType：滚动方式<br>
     * @param  $scope.LEDShowMange.pkId：停车场 ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.LEDShowMange.rollType=$("select[name='rollType']").val();
        $scope.LEDShowMange.pkId=$("select[name='pkId']").val();
        $scope.LEDShowMange.id=null;
        $('#myModal').modal('show');

    };
    $scope.modelShowAdd = function(){
        $('#myModal').modal('hide');
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/ledInfo/add",
            method:"post",
            dataType: "json",
            data:$scope.LEDShowMange,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            if(data.code==200){
                $scope.modelRepeat()
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("新增成功", 'info');
            }else if(data.code==300003){
                jBox.tip("此消息已存在；新增失败", 'info');
            }
            else{
                jBox.tip("新增失败", 'info');
                $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            }
        }).error(function(){
            jBox.tip("新增失败", 'info');
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        });
    }
    /* LED显示管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.LEDShowMange1：修改内容集合<br>
     * @param  $scope.targeUpdate：限制重复提交<br>
     * @param  $scope.LEDShowMange1.rollType：滚动方式<br>
     * @param  $scope.LEDShowMange1.pkId：停车场 ID<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate=function(data){
        updateUse(data)
    };
    function updateUse(obj){
        $scope.LEDShowMange={};
        $scope.modelRepeat()
        $http({
            url:"/eleting-web/ledInfo/getLedInfoById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.LEDShowMange=data.datum;
        }).error(function(){
        });
    }
    //保存修改
    $scope.modelSave=function(){
        $('#myUpdateModal').modal('show');
    }
    $scope.modelShowSave = function(){
        $('#myUpdateModal').modal('hide');
        $scope.LEDShowMange.rollType=$("select[name='rollType']").val();
        $scope.LEDShowMange.pkId=$("select[name='pkId']").val();
        $http({
            url:"/eleting-web/ledInfo/update",
            method:"post",
            dataType: "json",
            data:$scope.LEDShowMange,
        }).success(function(data){
            if(data.code==200){
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
                $scope.modelRepeat()
            }else if(data.code==300003){
                jBox.tip("此消息已存在；修改失败", 'info');
            }else{
                jBox.tip("提交失败", 'info');
            }
        }).error(function(){
            $("#grid").dataTable().fnDraw(false);
            jBox.tip("提交失败", 'info');
        });
    }
//    删除
    window.viewRemove=function(data){
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/ledInfo/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    $("#grid").dataTable().api().ajax.reload();
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
    $scope.tabChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $("#grid").dataTable().api().ajax.reload();
        }
    });
//    通过停车场筛选
    window.pkChange=function(){
        $("#grid").dataTable().api().ajax.reload();
    };
});
