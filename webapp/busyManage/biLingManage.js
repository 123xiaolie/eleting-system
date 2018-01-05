var myapp=angular.module("myapp",[]);
myapp.controller("biLingManage",function($scope,$http,$state){
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
            url: "/eleting-web/codeTable/getCodeTablePageInfoByCondition",
            data: function (params) {
                params.pageNum=parseInt((params.start+1)/params.length+1);
                params.pageSize=params.length;
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
                data: "code",
                title: "区域名",
                width:"20%"
            },
            {
                data: "uniqueMark",
                title: "策略描述",
                width:"30%"
            },
            {
                data: "uniqueMark",
                title: "节假日态",
                width:"10%"
            },
            {
                data: "uniqueMark",
                title: "策略优先级",
                width:"10%"
            }
            ,
            {
                data: "uniqueMark",
                title: "状态",
                width:"10%"
            },
            {
                data: "id",
                title:"操作",
                render: function (data, type, row) { // 模板化列显示内容
                    var butt = '<button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-update btn-tebBt"  onclick="viewtypeUpdate(\'' + data + '\')">修改</button><button style="margin-right: 10px;cursor: pointer" class="Check-report gui-btn btn-remove btn-tebBt"  onclick="viewtypeRemove(\'' + data + '\')">删除</button>';
                    return butt;
                },
                width:"15%"
            }

        ],
    });
});
