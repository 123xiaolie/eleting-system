//路由配置
var loc = document.location;
var hash = loc.hash;
var path = hash.substring(1);
var stateUrl = path.substring(1).replace("index/content/", "index.content.");
var url = path.substring(path.indexOf("index/content") + 14);
var controllerName = path.substring(path.lastIndexOf("/") + 1);
var myapp = angular.module("myapp", ["ui.router", "oc.lazyLoad"]);
//封装请求
// 定义一个 Service ，稍等将会把它作为 Interceptors 的处理函数
myapp.factory('HttpInterceptor', ['$q', "$rootScope", HttpInterceptor]);

function HttpInterceptor($q, $rootScope) {
    return {
        request: function (config) {
            return config;
        },
        requestError: function (err) {
            return $q.reject(err);
        },
        response: function (res) {
            if (res.data.code == 444) {
                $('#myModal').modal('hide'); //隐藏新增模态框
                $('#myUpdateModal').modal('hide'); //隐藏修改模态框
                swal({
                    title: '登录失效，请重新登录',
                    type: 'warning',
                    timer: '2000',
                    showCancelButton: false,
                    showConfirmButton: false,
                });
                setTimeout(function () {
                    $rootScope.$emit('eventName', "login/loginCheck");
                    window.localStorage.setItem("isLoginStatus", 0)
                }, 1000);
                return false;
            }
            return res;
        },
        responseError: function (err) {
            if (-1 === err.status) {
                // 远程服务器无响应
            } else if (500 === err.status) {
                // 处理各类自定义错误
            } else if (501 === err.status) {
                // ...
            } else if (404 === err.status) {}
            return $q.reject(err);
        }
    };
}

//datatable公共部分
$.extend(true, $.fn.dataTable.defaults, {
    processing: true, // 加载时提示
    serverSide: true, // 分页，是否服务器端处理
    ordering: false,
    searching: false,
    bProcessing: true,
    bAutoWidth: true,
    ajax: {
        dataSrc: function (json) {
            json.recordsTotal = json.datum.total; //总个数
            json.recordsFiltered = json.datum.total;
            json.start = json.datum.pageNum * json.datum.pageSize - 10; //起始位置
            json.length = json.datum.pageSize;
            return json.datum.list;
        },
    },
    dom: '<"top">rt<"bottom"pli><"clear">',
    autoWidth: false,
    language: {
        "sProcessing": '<div class="gui-loader"><div class="ball-beat"><div></div><div></div><div></div></div><p>加载中...</p></div>',
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    },
    sPaginationType: "full_numbers"
});

myapp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push(HttpInterceptor);
        // 默认地址
        $urlRouterProvider.when("", '/loginCheck');
        //判定路径方式执行指定默认登录界面
        //设置登录界面
        interceptUrl = "Check";
        $stateProvider
            .state("loginCheck", {
                url: '/loginCheck',
                views: {
                    'login': {
                        templateUrl: "webapp/login/login" + interceptUrl + ".html",
                        controller: "login" + interceptUrl,
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load("webapp/login/login" + interceptUrl + ".js");
                            }]
                        }
                    },
                    'header': {
                        template: ''
                    },
                    'footer': {
                        template: ''
                    },
                    'mid': {
                        template: ''
                    }
                }
            })
            .state("index", {
                url: '/index',
                views: {
                    'login': {
                        template: ''
                    },
                    'header': {
                        templateUrl: 'include/header.html',
                        controller: "header"
                    },
                    'footer': {
                        templateUrl: 'include/footer.html',
                        controller: "footer"
                    },
                    'mid': {
                        templateUrl: 'include/mid.html',
                        controller: "mid"
                    }
                }
            }).state("index.content", {
                url: '/content',
                views: {
                    'content': {
                        templateUrl: 'include/content.html',
                        controller: function ($state) {}
                    },
                    'menu': {
                        templateUrl: 'include/menu.html',
                        controller: "menu"
                    }
                }
            })
        if (stateUrl.indexOf("index.content.") >= 0) {
            $stateProvider.state(stateUrl, {
                url: "/" + url,
                views: {
                    '': {
                        templateUrl: 'webapp/' + url + ".html",
                        controller: controllerName,
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load("webapp/" + url + ".js");
                            }]
                        }
                    }
                }
            })
        } else if (stateUrl != "" && stateUrl != null && stateUrl != undefined && stateUrl != "loginCheck") {
            var thisUrl = stateUrl.split("/");
            thisUrl = thisUrl[thisUrl.length - 1];
            $stateProvider.state(stateUrl, {
                url: '/' + stateUrl,
                views: {
                    'login': {
                        templateUrl: "webapp/" + stateUrl + ".html",
                        controller: thisUrl,
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load("webapp/" + stateUrl + ".js");
                            }]
                        }
                    },
                    'header': {
                        template: ''
                    },
                    'mid': {
                        template: ''
                    }
                }
            })
        };
    }]).controller('index', function ($scope, $state) {}).controller("header", function ($scope, $http, $state) {
        $scope.account = window.localStorage.getItem("account");
        if ($scope.account == null || $scope.account == undefined || $scope.account == "") {
            $scope.account = "未登录";
        }
        var oUl = document.getElementById("oUl");
        oUl.onclick = function (ev) {
            var interceptUr3 = window.location.href;
            var interceptUrl = (interceptUr3.split("index/content/"))[1].split("/")[0];
            var stateUrl = window.location.href;
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLowerCase() == "a") {
                switch (target.name) {
                    case "个人中心":
                        switch (interceptUrl) {
                            case "asms":
                                $state.go("account/accountInformation");
                                break;
                        }
                        break;
                    case "修改密码":
                        window.localStorage.setItem('urlName', target.name)
                        window.localStorage.setItem('urlNameOne', 1)
                        $state.go('index.content.login/loginPassword');
                        break;
                    case "注销登录":
                        window.localStorage.setItem("account", "");
                        $http({
                            url: "/eleting-web/sys/logout",
                            method: "post",
                            dataType: "json",
                        }).success(function (data) {
                            $state.go("login/loginCheck");
                            $.cookie('menuSelectId', "")
                            window.localStorage.setItem("isLoginStatus", 0)
                        }).error(function () {});

                        break;
                }
            }
        }
    }).controller("footer", function ($scope, $http) {}).controller("mid", function ($scope, $http, $state) {})
    .controller("menu", function ($scope, $http, $state) {
        //判定页面
        var tbUrlName = window.localStorage.getItem('urlName')
        $scope.urlName = tbUrlName;
        //判定是否显示
        if (tbUrlName == "" || tbUrlName == null || tbUrlName == undefined) {
            $(".urlName").css('optionopacity', '0')
        } else {
            $(".urlName").css('opacity', '1')
        }
        $scope.account = window.localStorage.getItem("account");
        if ($scope.account == null || $scope.account == undefined || $scope.account == "") {
            $scope.account = "未登录";
        }
        //        easyui
        //    菜单配置
        //请求静态目录
        if (window.localStorage.getItem("loginStuts") == "1") {
            $http({
                url: "/eleting-web/sys/menu/user",
                method: "get",
                dataType: "json",
            }).success(function (data) {
                if (data.datum[0].children.length > 0) {
                    for (var ab = 0; ab < data.datum[0].children.length; ab++) {
                        data.datum[0].children[ab].id = data.datum[0].children[ab].menuId
                        if (data.datum[0].children[ab].children.length > 0) {
                            for (var bc = 0; bc < data.datum[0].children[ab].children.length; bc++) {
                                data.datum[0].children[ab].children[bc].id = data.datum[0].children[ab].children[bc].menuId
                                if (data.datum[0].children[ab].children[bc].children && data.datum[0].children[ab].children[bc].children.length > 0) {
                                    for (cd = 0; cd < data.datum[0].children[ab].children[bc].children.length; cd++) {
                                        data.datum[0].children[ab].children[bc].children[cd].id = data.datum[0].children[ab].children[bc].children[cd].menuId
                                    }
                                }
                            }
                        }
                    }
                }
                getTree(data.datum)
            }).error(function () {

            });
        }

        function getTree(data) {
            $("#tt").tree({
                //lines:true,
                //url:"include/navData/asms_data.json",
                data: data,
                onClick: function (node) {
                    $.cookie('menuSelectId', node.id)
                    window.localStorage.setItem("menuObj", JSON.stringify(node));
                    // toggle
                    $("#tt").tree("toggle", node.target);
                    if (node.type == 0) {

                    } else {
                        $scope.urlName = node.text;
                        $(".urlName").css('opacity', '1')
                        window.localStorage.setItem('urlName', node.text)
                    };
                    $(node.target).closest('li').siblings().children('.tree-node').each(function () {
                        $("#tt").tree("collapse", this);
                    });
                    //node.menuUrl!=null && $state.go(node.menuUrl);
                    node.url != null && $state.go(node.url);
                    if (node.url == null) {
                        return;
                    }~node.url.indexOf('index.content') ? $state.go(node.url) : window.location.href = node.url;
                },
                onLoadSuccess: function (node, data) {
                    //隐藏根节点
                    $("#" + $('#tt').tree('getRoot').domId).hide();
                    // $("#tt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
                    var n = $("#tt").tree("getSelected");

                    if (n != null) {
                        $("#tt").tree("select", n.target); //相当于默认点击了一下第一个节点，执行onSelect方法
                        $("#tt").tree("toggle", n.target);
                    }
                    //    自定打开页面
                    var node01 = $('#tt').tree('find', $.cookie('menuSelectId'));
                    if(node01){
                        if (node01.type == 0 && $.cookie('menuSelectId')) {
                            $('#tt').tree('expand', node01.target.parentNode.parentNode.parentNode.firstChild);
                            $('#tt').tree('expand', node01.target);
                            $('#tt').tree('select', node01.target);
                        } else {
                            $('#tt').tree('expand', node01.target.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild);
                            $('#tt').tree('expand', node01.target.parentNode.parentNode.parentNode.firstChild);
                            $('#tt').tree('select', node01.target.parentNode.firstChild);
                        }
                    }
                   

                }
            });
        }

        //    $("#tt").tree({
        //        //lines:true,
        //        url:"include/navData/asms_data.json",
        //        //data:JSON.stringify(data),
        //        onClick: function(node) {
        //            window.localStorage.setItem("menuObj", JSON.stringify(node));
        //            // toggle
        //            $("#tt").tree("toggle", node.target);
        //
        //            $(node.target).closest('li').siblings().children('.tree-node').each(function(){
        //                $("#tt").tree("collapse", this);
        //            });
        //            node.menuUrl!=null && $state.go(node.menuUrl);
        //            //node.url!=null && $state.go(node.url);
        //            if (node.url == null) {
        //                return;
        //            }
        //            ~node.url.indexOf('index.content') ? $state.go(node.url) : window.location.href = node.url;
        //        },
        //        onLoadSuccess:function(node,data){
        //            //隐藏根节点
        //            $("#"+$('#tt').tree('getRoot').domId).hide();
        //            $("#tt li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
        //            var n = $("#tt").tree("getSelected");
        //            if(n!=null){
        //                $("#tt").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
        //                $("#tt").tree("toggle",n.target);
        //            }
        //        }
        //    });
    })
    .controller('fatherCon', function ($rootScope, $scope, $http, $state) {
        $rootScope.$on('eventName', function (event, args) {
            //$state.go("login/loginCheck");
            $state.go(args);
        });
    });
myapp.run(['$rootScope', '$window', '$location', '$log', function ($rootScope, $window, $location, $log, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);