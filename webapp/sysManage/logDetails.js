var myapp=angular.module("myapp",[]);
myapp.controller("logDetails",function($scope,$http,$state){
    //http://10.10.16.34:8097/log/get_log_summary?tableName=log_summary&id=18199001234&startTime=20170613-103000000&endTime=20170613-235959999
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
            url: "/log/get_log",
            dataSrc: function (json) {
                json.recordsTotal = json.datum.length;//总个数
                json.recordsFiltered = 0;
                json.start = 0;//起始位置
                json.length =0;
                return json.datum;
            },
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
                params.id=18199001234;
                params.tableName='log';
               params.idList=window.localStorage.getItem('logDetails')
            },
            contentType:"application/json",
            type: "get",
            dataType:"JSON",
        },
        columns: [
            {
                data: "level",
                title: "level",
                width:"4%"
            },
            {
                data: "method",
                title: "method",
                width:"15%"
            },
            {
                data: "msg",
                title: "msg",
                width:"14%"
            },
            {
                data: "params",
                title: "params",
                width:"10%"
            },
            {
                data: "remoteAddr",
                title: "remoteAddr",
                width:"6%"
            },
            {
                data: "thread",
                title: "thread",
                width:"10%"
            },
            {
                data: "system",
                title: "system",
                width:"12%"
            },
            {
                data: "thread",
                title: "thread",
                width:"10%"
            },
            {
                data: "time",
                title: "time",
                width:"9%"
            },
            {
                data: "user",
                title: "user",
                width:"7%"
            }

        ],
    });
});
