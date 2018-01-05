var myapp=angular.module("myapp",[]);
myapp.controller("dataBackup",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $scope.dataBackupMangeseach={};
    $scope.dataBackupMange= {};
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                //updateUse(rows[0].serviceId);
            });
        },
        paging:false,
        ajax: {
            url: "/eleting-web/data/mysql/list",
            dataSrc: function (json) {
                if(json.code==200){
                    json.recordsTotal = json.datum.length;//总个数
                    json.recordsFiltered = json.datum.length;
                    return json.datum;
                }else{
                    json.recordsTotal = "0";//总个数
                    json.recordsFiltered = "0";
                    return ""
                }
            },
            data: function (params) {
                if(!$scope.dataBackupMangeseach.ip){
                    params.ip = '10.10.16.234';
                }else{
                    params.ip = $scope.dataBackupMangeseach.ip;
                }
                console.log('传入数据',params.ip)
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
            title: "ip",
                render: function (data, type, row) { // 模板化列显示内容
                   if(!$scope.dataBackupMange.ip){
                    return '10.10.16.234';
                }else{
                    return $scope.dataBackupMangeseach.ip;
                };
            },
            width:"40%"

        },
        {
            data: "fileName",
            title: "文件名称",
            width:"40%"

        },
        {
            data: "serviceId",
            title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-open btn-tebBt"  onclick="viewUpdate(\'' + data + '\')">还原</button>';
                    return butt;
                },
                width:"15%"
            }
            ],
        });
    //重置
    $scope.modelRepeat=function(){
        $scope.targe=0;
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    //
    /* 数据库备份<br>
     * 功能描述：<br>
     * <p>
     *  备份
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     $scope.targe=0;
     $scope.timeOnly={};
     $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        if(!$("input[name='databaseName']").val()){
            $("input[name='databaseName']").focus();
            jBox.tip("请填写数据库名称", 'info');
            return false
        }
        $("#myModal").modal('show')
    };
    $scope.modelShowAdd = function(){
        $("#myModal").modal('hide')
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web//data/mysql/backup",
            method:"post",
            dataType: "json",
            data:$scope.dataBackupMange,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            var count=60;
            var aa = setInterval(function(){
                count = count-1;
                $scope.timeOnly = {};
                $scope.timeOnly.time = count;
                $("button[name='beifen']").html("备份("+count+"s)");
                if(count<0){
                    clearInterval(aa);
                    $("button[name='beifen']").html("备份")
                    $(".addYes").removeAttr("disabled","disabled");//移除禁用属性

                    $scope.timeOnly="";
                }
            },1000);

            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                jBox.tip("备份成功", 'info');
            }else{
                jBox.tip("备份失败", 'info');
            }

        }).error(function(){

        });
    }
    /* 数据库备份<br>
     * 功能描述：<br>
     * <p>
     * 还原
     * </p>
     * 创建者：肖烈 创建时间: 2017-07-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     window.viewUpdate = function(obj){
        updateUse(obj)
    };
    function updateUse(obj){
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.dataBackupMange.fileName = rows[0].fileName;
        console.log($scope.dataBackupMange)
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $http({
            url:"/eleting-web/data/mysql/recover",
            method:"post",
            dataType: "json",
            data:$scope.dataBackupMange,
        }).success(function(data){
            if(data.code==200){
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("还原成功", 'info');
            }else{
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("还原失败", 'info');
            }

        }).error(function(){

        });
    }
//    删除
window.viewRemove=function(data){
    var submit = function (v, h, f) {
        if (v == true)
            $http({
                url:"/eleting-web/configuration_management/delete_service",
                method:"post",
                dataType: "json",
                params:{service_id:data},
            }).success(function(data){
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
    $scope.dataBacktabChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
    //    回车键查询
    // $(document).keypress(function(e) {
    //     alert(222)
    //     // 回车键事件
    //     if(e.which == 13) {
    //         stopDefault()
    //         $scope.dataBacktabChexked();
    //     }
    // });
    //阻止浏览器的默认行为
    function stopDefault( e ) {
        //阻止默认浏览器动作(W3C)
        if ( e && e.preventDefault )
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
        return false;
    }

});

