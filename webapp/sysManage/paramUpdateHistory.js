var myapp=angular.module("myapp",[]);
myapp.controller("paramUpdateHistory",function($scope,$http,$state){
    $scope.areaMaintenanceManage={}
    $scope.areaMaintenanceseach={}
    $("#grid").dataTable({
        ajax: {
            url:"/eleting-web/configuration_management/get_param_modify_history",
            dataSrc: function (json) {
                console.log(json)
                if(json.code==200&&json.datum!=null){
                    json.recordsTotal = json.datum.total;//总个数
                    json.recordsFiltered = json.datum.total;
                    json.start = json.datum.page*json.datum.amount-10;//起始位置
                    json.length =json.datum.amount;
                    for(var k=0;k<json.datum.list.length;k++){
                        json.datum.list[k].changedDate=new Date(json.datum.list[k].changedDate+28800000).toISOString().slice(0, 10)
                    }
                    return json.datum.list;
                }else{
                    json.recordsTotal = 0;//总个数
                    json.recordsFiltered = 0;
                    json.start = 0;//起始位置
                    json.length =0;
                    return ""
                }
            },
            data: function (params) {
                params.page_num=parseInt((params.start+1)/params.length+1);
                params.amount=params.length;
                if(!$scope.areaMaintenanceseach.userName){
                    params.user = window.localStorage.getItem("userName");
                }else{
                    params.user=$scope.areaMaintenanceseach.userName;
                };
                if(!$("input[name='beginDate']").val()){
                    params.start="2017-07-13";
                }else{
                    params.start=$("input[name='beginDate']").val();
                }
                if(!$("input[name='endDate']").val()){
                    params.end="2017-07-13";
                }else{
                    params.end=$("input[name='endDate']").val();
                }
                params.user = encodeURI(params.user);
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
                data: "serviceSystem",
                title: "业务名称",
                width:"15%"
            },
            {
                data: "fileName",
                title: "文件名称",
                width:"15%"
            },
            {
                data: "paramName",
                title: "参数名称",
                width:"15%"
            },
            {
                data: "paramValue",
                title: "参数值",
                width:"25%"
            },
            {
                data: "changedBy",
                title: "修改人",
                width:"10%"
            },
            {
                data: "changedDate",
                title: "修改日期",
                width:"15%"
            }
        ],
    });
//    查询
    $scope.tabChexked = function(){
        $("#grid").dataTable().api().ajax.reload();
    };
});
