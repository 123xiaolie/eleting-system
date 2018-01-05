var myapp=angular.module("myapp",[]);
myapp.controller("otherQuipMange",function($scope,$http,$state){
    //初始化验证
    $('#myform').bootstrapValidator();
    //加载码表(厂商)
    $scope.equipParqamsFac={};
    $scope.uniqueMarkFac={};
    $scope.equipParqamsFac.pageNum='1';
    $scope.equipParqamsFac.pageSize='100000';
    //$scope.equipParqamsFac.uniqueMark='provider';
    $http({
        url:"/eleting-web/epGemParams/getProviders",
        method:"get",
        dataType: "json",
        params:$scope.equipParqamsFac,
    }).success(function(data){
        $scope.uniqueMarkFac=data.datum.list;
    }).error(function(){

    });
    //    关联设备名字
    $scope.otherQuipMange={};
    $scope.otherQuipMangeseach={};
    window.UpdateEpGemName=function(){
        var aa=document.getElementById("providerId");
        var bb=document.getElementById("deviceTypeId");
        //var bb=document.getElementById("model");
        if($("#providerId").val()!=""&&$("#providerId").val()!=null&&$("#providerId").val()!=undefined){
            $("input[name='epName']").val(aa.options[aa.selectedIndex].text+"【"+bb.options[bb.selectedIndex].text+"】"+ $("#deviceId").val());
        }else{
            $("input[name='epName']").val("");
        }
    };
    //加载设备类型
    $scope.uniqueMarkProvider={}
    $scope.uniqueMarkProvider.pageNum="1";
    $scope.uniqueMarkProvider.pageSize="10000";
    window.facCodeSea=function(){
        $scope.uniqueMarkProvider.providerCode=$("select[name='providerId']").val();
        $http({
            url:"/eleting-web/epGemParams/getDeviceTypes",
            method:"get",
            dataType: "json",
            params:$scope.uniqueMarkProvider,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            var myobj=document.getElementById('deviceTypeId');
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
            $scope.uniqueMarkModel.deviceTypeCode=$("select[name='deviceTypeId']").val();
        }
        $scope.uniqueMarkModel.providerCode=$("select[name='providerId']").val();

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
            myobj1.options.length=1;
            //添加一个选项

            for(var o=0;o<data.datum.list.length;o++){
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj1.options.add(new Option(data.datum.list[o].model,data.datum.list[o].model)); //这个兼容IE与firefox
            }
            $("select[name='model']").val($scope.Usemodel);
            paramsJsonSea();
            UpdateEpGemName();//调用设备名称关联
        }).error(function(){

        });
    };
    //加载参数
    $scope.uniqueMarkParamsJson={};
    $scope.uniqueMarkParamsJson.pageNum="1";
    $scope.uniqueMarkParamsJson.pageSize="10000";
    window.paramsJsonSea=function(){
        $('.addMain').html('')//清空下来框内容
        if(!$scope.Usemodel){
            $scope.uniqueMarkParamsJson.model=$("select[name='model']").val();
        }else{
            $scope.uniqueMarkParamsJson.model = $scope.Usemodel;
        }
        $http({
            url:"/eleting-web/epGemParams/getEpGemParamsPageInfoByCondition",
            method:"get",
            dataType: "json",
            params:$scope.uniqueMarkParamsJson,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            if(data.datum.list.length<1){
                var submit = function (v, h, f) {
                    return true;
                };
                // 自定义按钮
                $.jBox.confirm("设备参数名不存在或者为空,请到设备参数页面维护", "添加参数提示", submit, { buttons: { '关闭': true} });
            }else{
                $scope.uniqueMarkParamsJsonShow=data.datum.list[0].paramsName;
            }
        }).error(function(){

        });
    }
    //新增li
    //动态新增
    $(function(){
        $('#add').click(function(){
            var cj=$("select[name='model']").val();
            if(cj==''||cj==null||cj==undefined){
                var submit = function (v, h, f) {
                    return true;
                };
                // 自定义按钮
                $.jBox.confirm("请选择设备型号", "添加参数提示", submit, { buttons: { '关闭': true} });
                return false;
            }
                var cd=JSON.parse($scope.uniqueMarkParamsJsonShow);
            if(cd.length==0){
                var submit = function (v, h, f) {
                    return true;
                };
                // 自定义按钮
                $.jBox.confirm("设备参数名不存在或者为空,请到设备参数页面维护", "添加参数提示", submit, { buttons: { '关闭': true} });
            }else{
                $('.addMain').prepend('<li><label class="ul-label control-label" alain="right"><select name="pkPosStreet" class="gui-select pkPosStreet"></select></label><input type="text" name="hailo" class="gui-input form-control" style="margin-left: 6px;" /><span class="gui-CloseTip remove">&#xf0018;</span></li>');
                $("select[name='pkPosStreet']:eq(0)").html('');
                for (var i = 0, roadsLength = cd.length; i < roadsLength; i++) {
                    $("select[name='pkPosStreet']:eq(0)").append("<option  value="+cd[i]+">" + cd[i] + "</option>");
                }
            }
            $('.remove').click(function(){
                $(this).parent().remove();
            });
        });
    });
    /* 其他设备管理<br>
     * @param  $scope.otherQuipMange：新增内容集合<br>
     * @param  $scope.otherQuipMangeseach：筛选条件集合<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //重置
    $scope.modelRepeat=function(){
        $scope.targe=0;
        document.getElementById("myform").reset();
        $('.addMain').html('');
        var myobj1=document.getElementById('deviceTypeId');
        $("select[name='deviceTypeId']").html('');
        myobj1.options.add(new Option("请选择设备类型",''));
        var myobj=document.getElementById('model');
        $("select[name='model']").html('');
        myobj.options.add(new Option("无",''));
        $(".addYes").removeAttr("disabled","disabled")
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };

    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).children("td").eq(0).children().prop("checked", true);
                $(this).siblings().children("td").eq(0).children().removeAttr("checked", "checked");
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                //updateUse(rows[0].id);
            });
            $("#grid >tbody >tr").dblclick(function(){
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/otherEpIf/getOtherEpIfPageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.epName=$scope.otherQuipMangeseach.epName;
                params.providerId=$("select[name='providerIdSeach']").val();
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
                width:"3%"
            },
            {
                data: "epName",
                title: "设备名称",
                width:"12%"

            },
            {
                data: "providerName",
                title: "厂商",
                width:"10%"
            },
            {
                data: "equipTypeName",
                title: "设备类型",
                width:"5%"
            },
            {
                data: "model",
                title: "设备型号",
                width:"5%"
            },
            {
                data: "deviceId",
                title: "设备编号",
                width:"5%"
            },
            {
                data: "parentName",
                title: "所属停车场",
                width:"10%"
            },
            // {
            //     data: "gatewayId",
            //     title: "所属网关",
            //     width:"10%"
            // },
            // {
            //     data: "repeaterId",
            //     title: "所属中继器",
            //     width:"15%"
            // },
            {
                data: "paramsJson",
                title: "设备参数",
                width:"15%"
            },
            //{
            //    data: "paramsJson",
            //    title: "设备参数",
            //    width:"10%"
            //},
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
    //
    /* 其他设备管理<br>
     * 功能描述：<br>
     * <p>
     *  新增
     * </p>
     * @param  $scope.targe：限制重复点击<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        var cc=[];
        var a=$("select[name='pkPosStreet']").length;
        for(var i=0;i<a;i++){
            var aa=document.getElementsByName("pkPosStreet")[i];
            cc.push(aa.options[aa.selectedIndex].value,aa.parentNode.parentNode.childNodes[1].value);
        }
        var bp=document.getElementById('providerId');
        var bd=document.getElementById('deviceTypeId');
        var bm=document.getElementById('model');
        $scope.otherQuipMange.epName=$("input[name='epName']").val();//设备，名称
        $scope.otherQuipMange.providerName=bp.options[bp.selectedIndex].text;//厂商名字
        $scope.otherQuipMange.providerId=$("select[name='providerId']").val();//厂商ID
        $scope.otherQuipMange.deviceTypeId=$("select[name='deviceTypeId']").val();//设备类型ID
        var aa=document.getElementById("deviceTypeId");
        $scope.otherQuipMange.deviceTypeName=aa.options[aa.selectedIndex].text;//设备类型
        $scope.otherQuipMange.equipTypeName=bp.options[bp.selectedIndex].text;//厂商名字
        $scope.otherQuipMange.model=$("select[name='model']").val();//设备型号
        $scope.otherQuipMange.paramsJson=JSON.stringify(cc);//参数
        $scope.otherQuipMange.id=null;//ID
        if(!$scope.otherQuipMange.providerId){
            swal({
                title: '请选择设备厂商',
                type: 'warning',
                timer:'1000',
                showCancelButton: false,
                showConfirmButton:false,
            });
            return
        }else{
            if(!$scope.otherQuipMange.deviceTypeId){
                swal({
                    title: '请选择设备类型',
                    type: 'warning',
                    timer:'1000',
                    showCancelButton: false,
                    showConfirmButton:false,
                });
                return
            }else{
                if(!$scope.otherQuipMange.model){
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
            url:"/eleting-web/otherEpIf/add",
            method:"post",
            dataType: "json",
            data:$scope.otherQuipMange,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")
            if(data.code==200){
                //清空新增项
                $("#grid").dataTable().api().ajax.reload();
                $scope.modelRepeat()
                jBox.tip("新增成功", 'info');
            }else if(data.code==300003){
                jBox.tip("设备已存在；新增失败", 'info');
            }
            else{
                jBox.tip("新增失败", 'info');
            }

        }).error(function(){
            jBox.tip("链接失败", 'info');
        });
    }
    /* 其他设备管理<br>
     * 功能描述：<br>
     * <p>
     *  修改
     * </p>
     * @param  $scope.targeUpdate：限制重复点击<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewUpdate=function(data){
        updateUse(data)

    };
    function updateUse(obj){
        $scope.modelRepeat()
        $scope.deviceTypeId="";
        $scope.otherQuipMange={};
        $http({
            url:"/eleting-web/otherEpIf/getOtherEpIfById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            if(data.code==200){
                $scope.Usemodel=data.datum.model;//重新复制model
                paramsJsonSea()//调取参数重写
                $scope.otherQuipMange=data.datum
                //设备参数显示
                var kk=JSON.parse(data.datum.paramsJson);
                $('.addMain').html('')
                for(var j=0;j<kk.length;j=j+2){
                    $('.addMain').prepend('<li><label class="ul-label control-label" alain="right"><select name="pkPosStreet" class="gui-select pkPosStreet"></select></label><input type="text" name="hailo" value="'+kk[j+1]+'" class="gui-input form-control" style="margin-left: 6px;" /><span class="gui-CloseTip remove">&#xf0018;</span></li>');
                    $("select[name='pkPosStreet']").append("<option  value="+kk[j]+">" + kk[j] + "</option>");
                    $('.remove').click(function(){
                        $(this).parent().remove();
                    });
                }
                //设备类型显示
                var myobj=document.getElementById('deviceTypeId');
                //删除所有项
                myobj.options.length=0;
                //添加一个选项
                myobj.options.add(new Option(data.datum.equipTypeName,data.datum.deviceTypeId)); //这个兼容IE与firefox
                //    设备型号
                //设备类型显示
                var myobj1=document.getElementById('model');
                //删除所有项
                myobj1.options.length=0;
                //添加一个选项
                myobj1.options.add(new Option(data.datum.model,data.datum.model)); //这个兼容IE与firefox
            }

        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave=function(){
        var cc=[];
        var a=$("select[name='pkPosStreet']").length;
        for(var i=0;i<a;i++){
            var aa=document.getElementsByName("pkPosStreet")[i];
            cc.push(aa.options[aa.selectedIndex].value,aa.parentNode.parentNode.childNodes[1].value);
        }
        var bp=document.getElementById('providerId');
        var bd=document.getElementById('deviceTypeId');
        var bm=document.getElementById('model');
        $scope.otherQuipMange.epName=$("input[name='epName']").val();;
        $scope.otherQuipMange.providerName=bp.options[bp.selectedIndex].text;
        $scope.otherQuipMange.providerId=$("select[name='providerId']").val();
        $scope.otherQuipMange.deviceTypeId=$("select[name='deviceTypeId']").val();
        $scope.otherQuipMange.model=$("select[name='model']").val();
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.otherQuipMange.paramsJson=JSON.stringify(cc);
        $scope.otherQuipMange.id=rows[0].id;
        var bb=document.getElementById("deviceTypeId");
        $scope.otherQuipMange.deviceTypeName=bb.options[bb.selectedIndex].text;//设备类型
        $('#myUpdateModal').modal('show');

    };
    $scope.modelShowSave =function(){
        $('#myUpdateModal').modal('hide');
        $http({
            url:"/eleting-web/otherEpIf/update",
            method:"post",
            dataType: "json",
            data:$scope.otherQuipMange,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            if(data.code==200){
                $scope.modelRepeat()
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
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
                    url:"/eleting-web/otherEpIf/delete",
                    method:"post",
                    dataType: "json",
                    data:{id:data},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
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
});

