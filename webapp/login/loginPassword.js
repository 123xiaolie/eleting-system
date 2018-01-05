var myapp=angular.module("myapp",[]);
myapp.controller("loginPassword",function($scope,$http,$state){
    $(".urlName").scope().urlName = '修改密码'
    $('#myform').bootstrapValidator();
    /* 修改密码<br>
     * @param $scope.loginPs：修改内容集合<br>
     * 创建者：肖烈 创建时间: 2017-04-18<br>
     *  @author 肖烈
     * @version 1.0.0.0
     */
    $scope.loginPs={};
    $scope.loginUpdate=function(){
        if (!$("#myform").data('bootstrapValidator').validate().isValid()) {
            return false;
        }
        $scope.loginPs.userId=window.localStorage.getItem("userId")
        $http({
            url:"/eleting-web/sys/user/password",
            method:"post",
            dataType: "json",
            data:$scope.loginPs,
        }).success(function(data){
            switch (data.code){
                case 501:
                    jBox.tip(data.message, 'info');
                    break;
                case 502:
                    jBox.tip(data.message, 'info');
                    break;
                case 200:
                    jBox.tip("修改成功", 'info');
                    setTimeout(function(){
                        $state.go("index.content.sysManage/sysUserManage")
                    },500);
                    break;
            }
        }).error(function(){

        });
    }
});
