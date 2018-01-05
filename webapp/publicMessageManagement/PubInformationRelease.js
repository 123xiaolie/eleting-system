var myapp=angular.module("myapp",[]);
myapp.controller("PubInformationRelease",function($scope,$http,$state){
    $scope.PubInformationRelease={};
    $scope.submitContain=function(){
        console.log($scope.PubInformationRelease);
        $http({
            url:"/eleting-web/drMsgIf/add",
            method:"post",
            dataType: "json",
            data:$scope.PubInformationRelease,
        }).success(function(data){
        }).error(function(){

        });
    }
});
