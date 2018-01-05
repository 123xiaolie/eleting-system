var myapp=angular.module("myapp",[]);
myapp.controller("loginCheck",function($scope,$http,$state){
    window.localStorage.setItem("isLoginStatus",0);
	/* 登录页面<br>
	 * 账户登录：<br>
	 * <p>
	 * 登录
	 * </p>
	 * @param $scope.codeImageSrc：验证码图片<br>
	 * @param $scope.LoginMain：登录内容集合<br>
	 * @param $scope.nameiSshow：用户名错误提示信息<br>
	 * @param $scope.CodeiSshow：验证码错误提示信息<br>
	 * @param $scope.passiSshow：密码错误提示信息<br>
	 * @param account：本地储存用户名<br>
	 * @param loginStuts：登录状态<br>
	 * @param $scope.areaRatioArr.areaRatioName：停车场名字集合<br>
	 * 创建者：肖烈 创建时间: 2017-04-20<br>
	 *  @author 肖烈
	 * @version 1.0.0.0
	 */
	$scope.codeImageSrc="eleting-web/captcha.jpg";
	$scope.flushValidateCode=function (){
		//点击切换验证码
		//点击切换验证码
		var now= Math.random();
		$scope.codeImageSrc="eleting-web/captcha.jpg?time="+now;
	};
    //登录
	$scope.LoginMain={};
    $scope.login=function(){
        window.localStorage.setItem("account","");
		$scope.nameiSshow=false;
		$scope.CodeiSshow=false;
		$scope.passiSshow=false;
		$http({
			url:"/eleting-web/sys/login",
			method:"post",
			dataType: "json",
			data:$scope.LoginMain
		}).success(function(data){
            $.cookie('menuSelectId',"")
            //从新刷新验证码
			$scope.flushValidateCode()
			switch (data.code){
				case 200:
					$state.go("index.content.login/loginWel");
					window.localStorage.setItem("account",$scope.LoginMain.username);
					window.localStorage.setItem("areaCode",data.datum.areaCode);//储存区域
					window.localStorage.setItem("cityCode",data.datum.cityCode);//储存高德码
					window.localStorage.setItem("areaName",data.datum.areaName);//储存区域名字userId
					window.localStorage.setItem("userId",data.datum.userId);//用户ID
					window.localStorage.setItem("userName",data.datum.username);//用户名
					window.localStorage.setItem("loginStuts","1");
                    window.localStorage.setItem("isLoginStatus",1);
                    break;
				case 400000:
					//$scope.msgNews="用户名错误";
					//$scope.nameiSshow=true;
					swal({
						title: '用户名错误',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					break;
				case 400001:
					//$scope.msgNews="不知名账号";
					//$scope.nameiSshow=true;
					swal({
						title: '不知名账号',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					break;
				case 400002:
					//$scope.msgNews="账号被锁定异常";
					//$scope.nameiSshow=true;
					swal({
						title: '账号被锁定异常',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					break;
				case 400003:
					//$scope.msgNews="账号权限问题";
					//$scope.nameiSshow=true;
					swal({
						title: '账号权限问题',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					break;
				case 400004:
					//$scope.msgNews="验证码错误";
					//$scope.CodeiSshow=true;
					swal({
						title: '验证码错误',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					break;
				case 400005:
					swal({
						title: '密码错误',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					//$scope.passiSshow=true;
					break;
				case 300002:
					swal({
						title: '用户名、密码、验证码均不能为空',
						type: 'warning',
						timer:'1000',
						showCancelButton: false,
						showConfirmButton:false,
					});
					break
			}

		}).error(function(){
		});
    };
	//消除错误提示
	$scope.hideValite=function(){
		$scope.nameiSshow=false;
		$scope.CodeiSshow=false;
		$scope.passiSshow=false;
	};
//	背景图设置
	$(".gui-loginBg").css("width",$("body").width()).css("height","100%");
//	清楚页面导航
	window.localStorage.setItem('urlName','')
    $(document).keypress(function(e) {
        // 回车键事件
        if(e.which == 13) {
            if(window.localStorage.getItem('isLoginStatus')==1){
            	return false
			}
            $scope.login();
        }
    });
});
