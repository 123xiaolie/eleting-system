
//====================行政区域代码转地域名==============
$.fn.mycity=function(i,j,k){
    var a=function(i,j,o,m){
        $.each(province, function (k, p) {
            var option = "<option value='" + p.province + "'>" + p.name + "</option>";
            $("#"+i).append(option);
        });
        $("#"+i).change(function () {
            var selValue = $(this).val();
            $("#"+j+" option:gt(0)").remove();
            $.each(city, function (k, p) {
                if (p.province == selValue) {
                    var araeID=p.province+ p.city
                    var option = "<option value='" + araeID + "'>" + p.name + "</option>";
                    $("#"+j).append(option);
                }
            });
            $("#"+j).trigger("change");
        });
        $("#"+j).change(function () {
            var selValue = $(this).val();
            $("#"+o+" option:gt(0)").remove();
            $.each(District, function (k, p) {
                var cityID=p.province+ p.city
                var cuntryID=p.province+ p.city+ p.country
                if (cityID== selValue) {
                    var option = "<option value='" +cuntryID+ "'>" + p.name + "</option>";
                    $("#"+o).append(option);
                }
            });
        });
        //初始化省市区
        var x="",y="",z="";
        if(m!=null&&m!=undefined){
            m= m.toString()
            if(m.length>=2){
                x=m.substring(0,2);
            }
            if(m.length>=4){
                if(m.substring(2,4)=="00"){
                    y=""
                }else {
                    y=m.substring(0,4);
                }
            }
            if(m.length>=6){
                if(m.substring(4,6)=="00"){
                    z="";
                }else {
                    z=m.substring(0,6);
                }
            }
        }
        $("#"+i).val(x);
        $("#"+i).trigger("change");
        $("#"+j).val(y);
        $("#"+j).trigger("change");
        $("#"+o).val(z);

    }
    return a;
}(jQuery);

//========================根据编码返回名称=============
$.fn.Cityname=function(x){
    //var myprobinceID= x.substring(0,2)
    //alert(myprobinceID)

    var b=function(x){
        x= x.toString()
        var myprobince="",mycity="",myDistrict="";
        var myprobinceID=x.substring(0,2);
        var mycityID=x.substring(2,4);
        var myDistrictID=x.substring(4,6);
        $.each(province, function (k, p) {
            if (p.province == myprobinceID) {
                myprobince= p.name;

            }
        });
        $.each(city, function (k, p) {
            if (p.province == myprobinceID&&mycityID== p.city) {
                mycity= p.name;
            }
        });
        $.each(District, function (k, p) {
            if (p.province == myprobinceID&&mycityID== p.city&&p.country==myDistrictID) {
                myDistrict= p.name;
            }
        });
        return myprobince+mycity+myDistrict;
    }
    return b;
}(jQuery);
//========通过权限判定是否显示增�?�删、改、查按钮================
$.fn.iSnotShow=function(arr){
    var a=function(arr){
        if(JSON.parse(window.localStorage.getItem("menuObj")).authority!="2"){
            for(var a=0;a<arr.length;a++){
                $("."+arr[a]).css("display","none");
            }
        }
    }
    return a
}(jQuery);
//==========通过权限判定是否显示操作栏===========
$.fn.ifIsShow=function(arr,data){
    var a=function(arr,data){
        if(data==""&&data==undefined&&data==null){
            data="2"
        };
        if(data=="0"){
            for(var a=0;a<arr.length;a++){
                $("."+arr[a]).css("display","none");
            }
        }
    }
    return a
}(jQuery);
//时间插件刷新表单验证
function dataValidator(data){
    $("#"+data).data("bootstrapValidator").destroy();//先去掉验证，与下面对应
    $("#"+data).bootstrapValidator();
    //$("#"+data).data('bootstrapValidator').validate().isValid()
}
//列表内容过长显示浮动
//鼠标悬停弹窗显示
function showPopContent(id,content){
    $("#"+id).popover({
        animation:true,
        html:false,
        placement:'right',
        trigger:'hover',
        content:content,
        delay:0,
        container:'body'
    });
    $("#"+id).popover("show");
}
//新日期插件
var input=$(".jqPickmeup");
input.pickmeup({
    before_show: function(){
        input.pickmeup('set_date', input.val(), true);
    },
    change: function(formated){
        input.val(formated);
    }
});
//设备管理，，动态增删li
$(function(){




    $('.remove').click(function(){

        $(this).parent().remove(); //parent() 返回当前元素集合的父元素

        changeSpan();
    });//为原有的btn绑定点击时间


    $('#add').click(function(){
        $('ul').prepend('<li><span></span><button class="remove">删除</button></li>');

        $('.remove').click(function(){
            $(this).parent().remove();
//                    changeSpan();
        });

//                changeSpan();
    });//新增li  并绑定btn点击事件  ， 然后 刷新下行数
//            function changeSpan(){
//                for (var i=0;i<$('span').length;i++) {
//
//                    $($('span')[i]).html(i);
//                }
//            }//修改行数

});