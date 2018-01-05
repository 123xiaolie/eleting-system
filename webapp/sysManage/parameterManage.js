var myapp=angular.module("myapp",[]);
myapp.controller("parameterManage",function($scope,$http,$state){
    /* 应用服务参数管理<br>;
     *<p>加载树</p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //a请求树
    /* 应用服务参数管理<br>;
     *<p>加载树</p>
     * 创建者：肖烈 创建时间: 2017-04-22<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    //a请求树
    window.httpTree=function(obj){
        $http({
            url:"/eleting-web/configuration_management/get_server_file_info",
            method:"get",
            dataType: "json",
            //params:{pkIfId:obj},
        }).success(function(data){
            var ac = [];
            ac.push(data.datum);
            getparamsTree(ac);
        }).error(function(){

        });
    }();
    function getparamsTree(data){
        //data.state="closed";
        $("#menuTt1").tree({
            data:data,
            onLoadSuccess:function(e,data){
                var nodes  =$('#menuTt1').tree('getChildren');//获取所有节点
                //delete nodes[0].children[0].children[0]["children"];

                //$("#"+nodes[k].target.id+" .tree-icon").addClass("gui-tcc");
                for(var k=0;k<nodes[0].children.length;k++){
                    for(var j=0;j<nodes[0].children[k].children.length;j++){
                        $("#"+nodes[0].children[k].children[j].target.id+" .tree-icon").removeClass("tree-folder");
                        $("#"+nodes[0].children[k].children[j].target.id+" .tree-hit").removeClass("tree-collapsed");
                        $("#"+nodes[0].children[k].children[j].target.id+" .tree-hit").removeClass("tree-expanded");
                        $("#"+nodes[0].children[k].children[j].target.id+" .tree-hit").css("margin-left","17px");
                    }
                }
                //隐藏根节点
                $("#"+$('#menuTt1').tree('getRoot').domId).hide();
                //    清空缓存
            },
            onClick: function(node,e) {
                $scope.fileId = node.id;
                var father = $(this).tree("getParent",node.target);
                $scope.serviceId = father.id;
                $("#grid").dataTable().api().ajax.reload();
                $("#menuTt1").tree("toggle", node.target);
                var nodes  =$('#menuTt1').tree('getChildren');//获取所有节点
                //delete nodes[0].children[0].children[0]["children"];
                //$("#"+nodes[k].target.id+" .tree-icon").addClass("gui-tcc");
                for(var k=0;k<nodes[0].children.length;k++){
                    for(var j=0;j<nodes[0].children[k].children.length;j++){
                        $("#"+nodes[0].children[k].children[j].target.id+" .tree-hit").removeClass("tree-collapsed");
                        $("#"+nodes[0].children[k].children[j].target.id+" .tree-hit").removeClass("tree-expanded");
                    }
                }
            }
        });
    };
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
                updateUse(rows[0].paramId);
            });
        },
        paging:false,
        ajax: {
            url: "/eleting-web/configuration_management/get_file_content",
            dataSrc: function (json) {
                if(json.code==200&&json.datum!=null){
                    json.recordsTotal = json.datum.length;//总个数
                    json.recordsFiltered = json.datum.length;
                    return json.datum;
                }else{
                    json.recordsTotal = 0;//总个数
                    json.recordsFiltered = 0;
                    return ""
                }

            },
            data: function (params) {
                if(!$scope.fileId||!$scope.serviceId){
                    params.file_id="0";
                    params.service_id="0";
                }else{
                    params.file_id=$scope.fileId;
                    params.service_id=$scope.serviceId;
                }
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
                data: "paramName",
                title: "参数名称",
                width:"10%"
            },
            {
                data: "paramXpath",
                title: "参数原名",
                width:"27%"
            },
            {
                data: "paramValue",
                title: "参数值",
                width:"27%"
            },
            {
                data: "paramType",
                title: "参数类型",
                width:"8%"
            },
            {
                data: "paramId",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-delet btn-tebBt"  onclick="viewtypeJihuo(\'' + data + '\')">激活</button>';
                    return butt;
                },
                width:"8%"
            }

        ],
    });
    //重置
    $scope.modelRepeat=function(){
        document.getElementById("myform").reset();
    };
    /* 应用服务参数管理<br>;
     *<p>数据回填</p>
     *<br/>$scope.paramsManage:数据集合；
     * 创建者：肖烈 创建时间: 2017-07-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.paramsManage={};
    window.viewtypeUpdate = function(obj){
        updateUse(obj)
    }
    function updateUse(obj){
        $scope.paramsManage={}
        var rows = $("#grid").DataTable().rows('.selected').data();
        $scope.paramsManage.paramId=obj;
        $("input[name='paramName']").val(rows[0].paramName);
        $("input[name='paramXpath']").val(rows[0].paramXpath);
        $("input[name='paramValue']").val(rows[0].paramValue);
        $("select[name='paramType']").val(rows[0].paramType)
    }
    /* 应用服务参数管理<br>;
     *<p>保存修改</p>
     *<br/>$scope.paramsManage:数据集合；
     * 创建者：肖烈 创建时间: 2017-07-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.modelSave = function(){
        console.log()
        $http({
            url:"/eleting-web/configuration_management/modify_param",
            method:"post",
            dataType: "json",
            params:{file_id:$scope.fileId,service_id:$scope.serviceId,user_name:encodeURI(window.localStorage.getItem("userName")),param_id:$scope.paramsManage.paramId,param_type:$("select[name='paramType']").val(),param_name:encodeURI($("input[name='paramName']").val()),param_value:$("input[name='paramValue']").val(),param_xpath:$("input[name='paramXpath']").val(),
            },
        }).success(function(data){
            if(data.code==200){
                $("#grid").dataTable().fnDraw(false);
                jBox.tip("修改成功", 'info');
                $scope.modelRepeat()
            }else{
                jBox.tip("修改失败", 'info');
            }
        }).error(function(){

        });
    }
//    重置
    $scope.modelRepeat = function(){
        document.getElementById("myform").reset();
    };
    /* 应用服务参数管理<br>;
     *<p>激活配置</p>
     *<br/>$scope.paramsManage:数据集合；
     * 创建者：肖烈 创建时间: 2017-07-13<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    window.viewtypeJihuo = function(){
        $http({
            url:"/eleting-web/configuration_management/active_configuration",
            method:"get",
            dataType: "json",
            params:{service_id:$scope.serviceId,},
        }).success(function(data){
            if(data.code==200){
                jBox.tip("激活成功", 'info');
            }else{
                jBox.tip("激活失败", 'info');
            }
        }).error(function(){

        });
    }
});

