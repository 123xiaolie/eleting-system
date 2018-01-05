var myapp=angular.module("myapp",[]);
myapp.controller("logManage",function($scope,$http,$state){
        /* 日志管理<br>
         * 功能描述：<br>
         * <p>
         *  查询一级菜单
         * </p>
         * @param  $scope.logMange：查询条件内容集合<br>
         * 创建者：肖烈 创建时间: 2017-04-25<br>
         *  @author 肖烈
         * @version 1.0.0.0
         */
    $scope.logMange={};//查询条件内容集合
    $("#grid").dataTable({
        bJQueryUI:false,//是否允许终端用户从一个选择列表中选择分页的页数，页数为10，25，50和100，需要分页组件bPaginate的支持
        bLengthChange:false,//是否开启分页功能,即使设置为false,仍然会有一个默认的<前进,后退>分页组件
        bProcessing:false,//是否开启不限制长度的滚动条（和sScrollY属性结合使用），不限制长度的滚动条意味着当用户拖动滚动条的时候DataTable会不断加载数据
        fnDrawCallback: function () {
            //设置选中状态
            $("#grid >tbody >tr").click(function () {
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
            $("#grid >tbody >tr").mouseover(function(){
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
            });
        },
        ajax: {
            url: "/user_logs/get_user_operation_info",
            dataSrc: function (json) {
                if(json.code==444){
                    swal({
                        title: '登录失效，请重新登录',
                        type: 'warning',
                        timer:'2000',
                        showCancelButton: false,
                        showConfirmButton:false,
                    });
                    return false;
                };
                json.recordsTotal = json.datum.length;//总个数
                json.recordsFiltered = 0;
                json.start = 0;//起始位置
                json.length =0;
                return json.datum;
            },
            data: function (params) {
                params.id=18109871234;
                if(!$("input[name='startTime']").val()||!$("input[name='startHour']").val()||!$("input[name='startMin']").val()){
                    params.startTime='20150803-144700125';
                }else{
                    params.startTime=$("input[name='startTime']").val()+"-"+$("input[name='startHour']").val()+$("input[name='startMin']").val()+"000";//开始时间
                }
                if(!$("input[name='endTime']").val()||!$("input[name='endHour']").val()||!$("input[name='endMin']").val()){
                    params.endTime='20150803-165206274';
                }else{
                    params.endTime=$("input[name='endTime']").val()+"-"+$("input[name='endHour']").val()+$("input[name='endMin']").val()+"999";//结束时间
                }
                console.log(" params.startTime", params.startTime);
                console.log(" params.endTime", params.endTime);
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON",
        },
        columns: [
            {
                data: "userId",
                title: "用户ID",
                width:"15%"
            },
            {
                data: "operation",
                title: "操作",
                width:"30%"
            },
            {
                data: "result",
                title: "操作结果",
                width:"20%"
            },
            {
                data: "date",
                title: "时间",
                width:"30%"
            }
        ],
    });
    $scope.viewUpdateSum={};
    window.viewUpdate=function(){
        var rows = $("#grid").DataTable().rows('.selected').data();
        var aa=rows[0].logList;
        var bb='';
        var arr=[];
        var Arr=[];
        arr=aa.split('(');
        Arr=arr[1].split(')');
        window.localStorage.setItem('logDetails',Arr[0]);
        $state.go('index.content.sysManage/logDetails');
    }
    $scope.tabChexked = function(){
        $("#grid").dataTable().api().ajax.reload();
    }
});
