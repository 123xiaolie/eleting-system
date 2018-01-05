var myapp=angular.module("myapp",[]);
myapp.controller("equipParameterManage",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    $('#myupdateform').bootstrapValidator();
    /* 设备参数<br>
     * @param  $scope.equipParaMange：新增内容集合<br>
     * @param  $scope.equipParaMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     $scope.equipParaMange={};
     $scope.equipParaMangeseach={};
    /* 设备参数<br>
     * <p>
     * 筛选厂商
     * </p>
     * @param $scope.uniqueMarkFar：厂商查询条件集合<br>
     * @param uniqueMark：唯一标识<br>
     * @param pageNum：当前页码<br>
     * @param pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     $scope.uniqueMarkFar={};
    //$scope.uniqueMarkFar.uniqueMark="provider";
    $scope.uniqueMarkFar.pageNum="1";
    $scope.uniqueMarkFar.pageSize="10000";
    $http({
        url:"/eleting-web/epGemParams/getProviders",
        method:"get",
        dataType: "json",
        params:$scope.uniqueMarkFar,
        headers:{
            token:window.localStorage.getItem("token")
        }
    }).success(function(data){
        $scope.uniqueMarkShow=data.datum.list
    }).error(function(){

    });
    //加载设备类型
    $scope.uniqueMarkProvider={}
    $scope.uniqueMarkProvider.pageNum="1";
    $scope.uniqueMarkProvider.pageSize="10000";
    window.facCodeSea=function(){
        $scope.uniqueMarkProvider.providerCode=$("select[name='providerCode']").val();
        $http({
            url:"/eleting-web/epGemParams/getDeviceTypes",
            method:"get",
            dataType: "json",
            params:$scope.uniqueMarkProvider,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            var myobj=document.getElementById('deviceTypeCode');
            //删除所有项
            myobj.options.length=0;
            //添加一个选项

            for(var o=0;o<data.datum.list.length;o++){
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj.options.add(new Option(data.datum.list[o].deviceTypeName,data.datum.list[o].deviceTypeCode)); //这个兼容IE与firefox
            }
            //$scope.uniqueDeviceTypeShow=data.datum.list
            modelCodeSea()//请求型号函数
        }).error(function(){

        });
    };
    //加载设备型号
    $scope.uniqueMarkModel={};
    $scope.uniqueMarkModel.pageNum="1";
    $scope.uniqueMarkModel.pageSize="10000";
    window.modelCodeSea=function(a){
        $scope.uniqueModelShow={};
        if(a!=null&&a!=""&&a!=undefined){
            $scope.uniqueMarkModel.deviceTypeCode=a;
        }else{
            $scope.uniqueMarkModel.deviceTypeCode=$("select[name='deviceTypeCode']").val();
        }
        $scope.uniqueMarkModel.providerCode=$("select[name='providerCode']").val();
        $http({
            url:"/eleting-web/epModel/getEpModelPageInfoByCondition",
            method:"get",
            dataType: "json",
            params:$scope.uniqueMarkModel,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            var myobj1=document.getElementById('model');
            //珊瑚所有项
            myobj1.options.length=0;
            //添加一个选项

            for(var o=0;o<data.datum.list.length;o++){
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj1.options.add(new Option(data.datum.list[o].model,data.datum.list[o].model)); //这个兼容IE与firefox
            }
        }).error(function(){

        });
    };
    //新增li
    //动态新增
    $(function(){
        $('.remove').click(function(){
            $(this).parent().remove(); //parent() 返回当前元素集合的父元素
        });//为原有的btn绑定点击时间
        $('#add').click(function(){
            $('.addMain').prepend('<li><label class="ul-label control-label " alain="right" >参数名</label><input type="text" name="paramsName" class="gui-input form-control" style="margin-left: 6px;" data-bv-notempty="true" data-bv-notempty-message="片区名称不能为空"/><span class="gui-CloseTip remove">&#xf0018;</span></li>');
            $('.remove').click(function(){
                $(this).parent().remove();
            });
        });


    });
    //重置
    $scope.modelRepeat=function(){
        document.getElementById("myform").reset();
        $('.addMain').html('')
        var myobj1=document.getElementById('deviceTypeCode');
        $("select[name='deviceTypeCode']").html('');
        myobj1.options.add(new Option("请选择设备类型",''));
        var myobj=document.getElementById('model');
        $("select[name='model']").html('');
        myobj.options.add(new Option("请选择设备型号",''));
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    }

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
                //updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/epGemParams/getEpGemParamsPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.providerName=$scope.equipParaMangeseach.providerName;
                params.deviceTypeName=$scope.equipParaMangeseach.deviceTypeName;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            //{
            //    title: "选择",
            //    data: function (data, type, row, meta) {
            //        return "<input type='radio' name='areaCode'/>"
            //    },
            //    width:"5%"
            //
            //},
            {
                data: "deviceTypeName",
                title: "设备类型",
                width:"15%"
            },
            {
                data: "providerName",
                title: "设备厂商",
                width:"20%"

            },

            {
                data: "model",
                title: "设备型号",
                width:"15%"
            },

            {
                data: "paramsName",
                title: "参数名",
                width:"35%"
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
    /* 设备参数<br>
     * <p>
     * 新增
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     $scope.targe=0;
     $scope.modelShow=function(){
        var cc=[];
        var a=$("input[name='paramsName']").length;
        for(var i=0;i<a;i++){
            var aa=document.getElementsByName("paramsName")[i];
            cc.push(aa.value);
        }
        var aa=document.getElementById('providerCode');
        $scope.equipParaMange.providerName=aa.options[aa.selectedIndex].text;
        $scope.equipParaMange.providerCode=$("select[name='providerCode']").val();
        var bb=document.getElementById('deviceTypeCode');
        $scope.equipParaMange.deviceTypeName=bb.options[bb.selectedIndex].text;
        $scope.equipParaMange.deviceTypeCode=$("select[name='deviceTypeCode']").val();
        $scope.equipParaMange.model=$("select[name='model']").val();
        $scope.equipParaMange.paramsName=JSON.stringify(cc);
        $scope.equipParaMange.id=null;
        if(!$scope.equipParaMange.providerCode){
            swal({
                title: '请选择设备厂商',
                type: 'warning',
                timer:'1000',
                showCancelButton: false,
                showConfirmButton:false,
            });
            return
        }else{
            if(!$scope.equipParaMange.deviceTypeCode){
                swal({
                    title: '请选择设备类型',
                    type: 'warning',
                    timer:'1000',
                    showCancelButton: false,
                    showConfirmButton:false,
                });
                return
            }else{
                if(!$scope.equipParaMange.model){
                    swal({
                        title: '请选择设备型号',
                        type: 'warning',
                        timer:'1000',
                        showCancelButton: false,
                        showConfirmButton:false,
                    });
                    return
                }
            }
        }
         $('#myModal').modal('show');
    }
    $scope.modelShowAdd = function(){
        $('#myModal').modal('hide');
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/epGemParams/add",
            method:"post",
            dataType: "json",
            data:$scope.equipParaMange,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled");
            if(data.code==200){
                $scope.modelRepeat()
                $("#grid").dataTable().api().ajax.reload();
                $('.addMain').html('');
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat()
            }else if(data.code==300003){
                jBox.tip("设备已存在;新增失败", 'info');
            }
            else{
                jBox.tip("新增失败", 'info');
            }
        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
    /* 设备参数<br>
     * <p>
     * 修改
     * </p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
     window.viewUpdate=function(data){
        updateUse(data)

    };
    function updateUse(obj){
        $http({
            url:"/eleting-web/epGemParams/getEpGemParamsById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.equipParaMange.id = data.datum.id;
            $("select[name='providerCode']").val(data.datum.providerCode);
            $("select[name='deviceTypeCode']").val(data.datum.deviceTypeCode);
            modelCodeSea(data.datum.deviceTypeCode);//再次调取设备类型
            //重写设备类型
            var myobj=document.getElementById('deviceTypeCode');
            //删除所有项
            myobj.options.length=0;
            //添加一个选项
                myobj.options.add(new Option(data.datum.deviceTypeName,data.datum.deviceTypeCode)); //这个兼容IE与firefox
        //    遍历写出参数
        var cj=JSON.parse(data.datum.paramsName);
        $('.addMain').html('')
        for(var j=0;j<cj.length;j++){
            $('.addMain').prepend('<li><label class="ul-label control-label " alain="right" >参数名</label><input type="text" name="paramsName" class="gui-input form-control" style="margin-left: 6px;" data-bv-notempty="true" value="'+cj[j]+'" data-bv-notempty-message="片区名称不能为空"/><span class="gui-CloseTip remove">&#xf0018;</span></li>');
            $('.remove').click(function(){
                $(this).parent().remove();
            });
        }

    }).error(function(){

    });
}
    //保存修改

    $scope.modelSave=function(){
        $('#myUpdateModal').modal('hide');
        var cc=[];
        var a=$("input[name='paramsName']").length;
        for(var i=0;i<a;i++){
            var aa=document.getElementsByName("paramsName")[i];
            cc.push(aa.value);
        }
        var aa=document.getElementById('providerCode');
        $scope.equipParaMange.providerName=aa.options[aa.selectedIndex].text;
        $scope.equipParaMange.providerCode=$("select[name='providerCode']").val();
        var bb=document.getElementById('deviceTypeCode');
        $scope.equipParaMange.deviceTypeName=bb.options[bb.selectedIndex].text;
        $scope.equipParaMange.deviceTypeCode=$("select[name='deviceTypeCode']").val();
        $scope.equipParaMange.model=$("select[name='model']").val();
        $scope.equipParaMange.paramsName=JSON.stringify(cc);
        console.log('$scope.equipParaMange',$scope.equipParaMange)
        $('#myUpdateModal').modal('show');
    }
    $scope.modelShowSave = function(){
        $('#myUpdateModal').modal('hide');
        $http({
            url:"/eleting-web/epGemParams/update",
            method:"post",
            dataType: "json",
            data:$scope.equipParaMange,
        }).success(function(data){
            if(data.code==200){
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
                $scope.modelRepeat();
            }else if(data.code==300003){
                jBox.tip("设备已存在；修改失败", 'info');
            }else{
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
                url:"/eleting-web/epGemParams/delete",
                method:"post",
                dataType: "json",
                data:{id:data},
                headers:{
                    token:window.localStorage.getItem("token")
                }
            }).success(function(data){
                    //$("#grid").dataTable().api().ajax.reload();
                    jBox.tip("删除成功", 'info');
                    $("#grid").dataTable().fnDraw(false);
                }).error(function(){

                });
                return true;
            };
        // 自定义按钮
        $.jBox.confirm("确认删除吗？", "删除提示", submit, { buttons: { '确认': true, '取消': false} });

    };
    //    查询
    $scope.qeuipParamstabChexked=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
//    回车键查询
$(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            $scope.qeuipParamstabChexked()
        }
    });
});
