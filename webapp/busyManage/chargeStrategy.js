var myapp=angular.module("myapp",[]);
myapp.controller("chargeStrategy",function($scope,$http,$state){
    //初始化表单验证
    $('#myform').bootstrapValidator();
    $('#myManyUpdateModal').bootstrapValidator();
    $scope.chargeStrategy={};
    $scope.chargeStrategySeacher={};
    $("#grid").dataTable({
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").mouseover(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").dblclick(function(){
                var rows = $("#grid").DataTable().rows('.selected').data();
                updateUse(rows[0].id);
            });
        },
        ajax: {
            url: "/eleting-web/chargeRules/getChargeRulesPageInfoByCondition",
            dataSrc: function (json) {
                if(json.code==444){
                    $('#myModal').modal('hide');//隐藏新增模态框
                    $('#myUpdateModal').modal('hide');//隐藏修改模态框
                    setTimeout(function(){
                        $state.go("login/loginCheck");
                        swal({
                            title: '登录失效，请重新登录',
                            type: 'warning',
                            timer:'2000',
                            showCancelButton: false,
                            showConfirmButton:false,
                        });
                    },1000)
                    return false;
                };
                json.recordsTotal = json.datum.total;//总个数
                json.recordsFiltered = json.datum.total;
                json.start = json.datum.pageNum*json.datum.pageSize-10;//起始位置
                json.length =json.datum.pageSize;
                for(var i=0;i<json.datum.chargeRulesList.length;i++){
                    json.datum.chargeRulesList[i].chargeTime=new Date(json.datum.chargeRulesList[i].chargeTime+28800000).toISOString().slice(0, 10);
                }
                return json.datum.chargeRulesList;
            },
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.moduleId=$("select[name='moduleIdSeacher']").val();
                params.beginDate=$("input[name='beginDate']").val();
                params.endDate=$("input[name='endDate']").val();
                params.ruleName=$scope.chargeStrategySeacher.ruleName;
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON"
        },
        columns: [
            {
                data: "ruleName",
                title: "策略名称",
                width:"15%"
            },
            {
                data: "moduleName",
                title: "模板名称",
                width:"13%"
            },

            {
                data: "chargeTime",
                title: "日期",
                width:"13%"
            },
            {
                data: "beginPrice",
                title: "起步价格(元)",
                width:"10%"
            }
            ,
            {
                data: "beginTime",
                title: "起步时长(分钟)",
                width:"15%"
            },
            {
                data: "chargeTimeBegin",
                title: "计费时间起点(分钟)",
                width:"15%"
            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button>';
                    return butt;
                },
                width:"15%"
            }

        ],
    });
    //重置
    $scope.modelRepeat=function(){
        document.getElementById("myform").reset();
        $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
        $("input[name='yearOther']").removeAttr('disabled','disabled');//移除日期禁用
        $("#myform").data('bootstrapValidator').destroy();
        $('#myform').bootstrapValidator();
    };
    /**
     * 计费策略<br>
     * 功能描述：<br>
     * <p>
     * 计费策略---新增
     * </p>
     * <br>@param $scope.chargeStrategy：策略新增数据集合
     * <br>@param $scope.chargeStrategyModuleId：模板集合
     * <br>@param $scope.targe：限制重复点击标识
     * <br>@param $scope.chargeStrategyModuleId：模板Id集合
     * <br>@param pageNum：当前页码
     * <br>@param pageSize：每条查询条数
     * <br>@param $scope.chargeStrategyModuleId：模板Id集合
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     * @author 肖烈
     * @version 1.0.0.0
     */
    $scope.chargeStrategyModuleId={};
    //加载模板
    $scope.chargeStrategyModuleId.pageNum="1";
    $scope.chargeStrategyModuleId.pageSize="10000";
    $http({
        url:"/eleting-web/chargeModule/getModuleLists",
        method:"get",
        dataType: "json",
        params:$scope.chargeStrategyModuleId,
    }).success(function(data){
        $scope.chargeStrategyModuleId=data.datum.datum.list;
    }).error(function(){

    });
    /* 计费策略<br>
     * 功能描述：<br>
     * <p>
     *  获取计费策略
     * </p>
     * @param  $scope.parkMangeCharhe：计费策略查询条件集合<br>
     * @param  pageNum：当前页码<br>
     * @param  pageSize：每页查询条数<br>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.parkMangeCharhe={};
    $scope.parkMangeCharhe.pageNum="1";
    $scope.parkMangeCharhe.pageSize="10000";
    window.modelParams = function(){
        $http({
            url:"/eleting-web/chargeRules/getRuleLists",
            method:"get",
            dataType: "json",
            params: $scope.parkMangeCharhe,
        }).success(function(data){
            $scope.parkMangeCharheShow=data.datum.datum.list;
            var myobj=document.getElementById('ruleNameMany');
            //删除所有项
            myobj.options.length=1;
            //添加一个选项
            for(var o=0;o<$scope.parkMangeCharheShow.length;o++){
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj.options.add(new Option($scope.parkMangeCharheShow[o].ruleName,$scope.parkMangeCharheShow[o].id)); //这个兼容IE与firefox
            }
        //    批量删除
            var myobj1=document.getElementById('ruleNameMany1');
            //删除所有项
            myobj1.options.length=1;
            //添加一个选项
            for(var k=0;k<$scope.parkMangeCharheShow.length;k++){
                //obj.add(new Option("文本","值")); //这个只能在IE中有效
                myobj1.options.add(new Option($scope.parkMangeCharheShow[k].ruleName,$scope.parkMangeCharheShow[k].id)); //这个兼容IE与firefox
            }
        }).error(function(){
        });
    };
    window.modelParams();
    $scope.targe=0;
    $scope.modelShow=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.chargeStrategy.moduleId=$("select[name='moduleId']").val();
        $scope.chargeStrategy.year=$("input[name='yearOther']").val();
        $("#myModal").modal('show')

    };
    $scope.modelShowAdd = function(){
        $("#myModal").modal('hide')
        $scope.targe=1;
        if($scope.targe==1){
            $(".addYes").attr("disabled","disabled")
        }
        $http({
            url:"/eleting-web/chargeRules/add",
            method:"post",
            dataType: "json",
            data:$scope.chargeStrategy,
            headers:{
                token:window.localStorage.getItem("token")
            }
        }).success(function(data){
            $scope.targe=0;
            $(".addYes").removeAttr("disabled","disabled")//移除禁用属性
            if(data.code==200){
                $("#grid").dataTable().api().ajax.reload();
                window.modelParams();
                jBox.tip("新增成功", 'info');
                $scope.modelRepeat();
            }else if(data.code==300003){
                jBox.tip("本条计费策略已存在;新增失败", 'info');
            }else{
                jBox.tip("新增失败", 'info');
            }
        }).error(function(){
            $scope.targe=0;
            jBox.tip("链接失败", 'info');
        });
    }
    //修改
    /**
     * 计费策略修改<br>
     * 功能描述：<br>
     * <p>
     * 计费策略修改
     * </p>
     * <br>@param $scope.chargeStrategy1：策略修改数据集合
     * <br>@param $scope.targeUpdate：限制重复点击标识
     * <br>@param createTime：创建日期
     * <br>@param provider：唯一标识
     * <br> 创建者：肖烈 创建时间: 2017-03-12
     * @author 肖烈
     * @version 1.0.0.0
     */
    window.viewtypeUpdate=function(data){
        updateUse(data)
    };
    function updateUse(obj){
        $scope.modelRepeat();
        $scope.chargeStrategy={};
        $http({
            url:"/eleting-web/chargeRules/getChargeRulesById",
            method:"get",
            dataType: "json",
            params:{id:obj},
        }).success(function(data){
            $scope.chargeStrategy=data.datum;
            $scope.chargeStrategy.chargeTime=new Date($scope.chargeStrategy.chargeTime+28800000).toISOString().slice(0, 10)
            var yearOther=$scope.chargeStrategy.chargeTime.slice(0, 4)
            $("input[name='yearOther']").val(yearOther);
            $("input[name='yearOther']").attr('disabled','disabled');
            $("input[name='year']").val($scope.chargeStrategy.chargeTime);
        }).error(function(){

        });
    }
    //保存修改
    $scope.modelSave=function(){
        $scope.chargeStrategy.moduleId=$("select[name='moduleId']").val();
        $scope.chargeStrategy.year=$("input[name='year']").val();
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
       $("#myupdateModal").modal('show')
    };
    $scope.modelShowUpdate = function(){
        $("#myupdateModal").modal('hide')
        $http({
            url:"/eleting-web/chargeRules/update",
            method:"post",
            dataType: "json",
            data:$scope.chargeStrategy,
        }).success(function(data){
            if(data.code==200){
                $("#grid").dataTable().fnDraw(false);
                window.modelParams();
                $scope.modelRepeat();
                jBox.tip("修改成功", 'info');
            }else{
                jBox.tip("修改失败", 'info');
            }
        }).error(function(){
            $("#grid").dataTable().api().ajax.reload();
            jBox.tip("修改失败", 'info');
        });
    }
    $scope.manyUpdateTip=function(){
        $('#myManyUpdateModal').data('bootstrapValidator').resetForm(true);
    };
    $scope.manydeleteTip = function(){

    }
    //改变计费 策略获得参数
    $scope.ruleNaameChangeParams={};
    $scope.ruleNaameChange=function(){
        $scope.ruleNaameChangeParams.beginDate=$("input[name='beginDate1']").val();
        $scope.ruleNaameChangeParams.endDate=$("input[name='endDate1']").val();
        var aa=document.getElementById("ruleNameMany");
        $scope.ruleNaameChangeParams.ruleName=aa.options[aa.selectedIndex].text;
        if (!$("#myManyUpdateModal").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $http({
            url:"/eleting-web/chargeRules/batchUpdate",
            method:"post",
            dataType: "json",
            data: $scope.ruleNaameChangeParams,
        }).success(function(data){
            if(data.code==200){
                jBox.tip("修改成功", 'info');
                $('#myManyUpdateModal').modal('hide');
                window.modelParams();
                $('#myManyUpdateModal').data('bootstrapValidator').resetForm(true);
                //$("#grid").dataTable().api().ajax.reload();
                $("#grid").dataTable().fnDraw(false);
            }else{
                jBox.tip("修改失败", 'info');
            }

        }).error(function(){
            jBox.tip("修改失败", 'info');
        });
    }
    //    删除
    /**
     * 计费策略删除<br>
     * 功能描述：<br>
     * <p>
     * 计费策略删除
     * </p>
     * <br>@param id：主键ID
     * <br>@param rows[0].id：选择行ID
     * <br> 创建者：肖烈 创建时间: 2017-04-13
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.viewRemove=function(data){
        var aa=document.getElementById("ruleNameMany1");
        var submit = function (v, h, f) {
            if (v == true)
                $http({
                    url:"/eleting-web/chargeRules/delete",
                    method:"post",
                    dataType: "json",
                    data:{ruleName:aa.options[aa.selectedIndex].text},
                    headers:{
                        token:window.localStorage.getItem("token")
                    }
                }).success(function(data){
                    if(data.code==200){
                        //$("#grid").dataTable().api().ajax.reload();
                        window.modelParams();
                        $("#grid").dataTable().fnDraw(false);
                        jBox.tip("删除成功", 'info');
                        $('#myManydeleteModal').modal('hide');
                    }else{
                        jBox.tip("删除失败", 'info');
                    }

                }).error(function(){

                });
            else
                jBox.tip("删除失败", 'info');
            return true;
        };
        // 自定义按钮
        $.jBox.confirm("删除该策略下所有数据，确认删除吗？", "删除提示", submit, { buttons: { '确认': true, '取消': false} });
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
    //筛选
    window.moduleIdSeacherChange=function(){
        $("#grid").dataTable().api().ajax.reload();
    }
});
