coolApp.config(
    function($middlewareProvider) {
        $middlewareProvider.map({
            'auth-middleware': ['AuthService', function asyncAuth(AuthService) {
                var request = this;
                AuthService.checkLoggedIn (function(res) {
                    if(res.data.error){
                        alert(res.data.error);
                        request.redirectTo('/');
                    } else {
                        return request.next();
                    }
                }, function(err) {
                    alert('Auth error');
                    request.redirectTo('/');
                });
            }],
            'admin-middleware': ['AuthService', function asyncAuth(AuthService) {
                var request = this;
                AuthService.checkIsAdmin (function(res) {
                    if(res.data.error){
                        alert(res.data.error);
                        request.redirectTo('/');
                    } else {
                        return request.next();
                    }
                }, function(err) {
                    alert('Auth error');
                    request.redirectTo('/');
                });
            }]
        });
    });


coolApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "auth/index.html",
         //   controller: 'AuthLoginController'
            })

        .when("/admin/category/:name", {
            templateUrl : "fruits/admin.fruits.view.html",
            controller: 'fruitCtrl',
            middleware: 'admin-middleware'
        })
        .when("/admin/category/:name/:id", {
            templateUrl : "fruits/admin.fruits.view.html",
            controller: 'fruitCtrl',
            middleware: 'admin-middleware'
        })
        .when("/category/:name", {
            templateUrl : "fruits/fruits.view.html",
            controller: 'fruitCtrl',
            middleware: 'auth-middleware'
        })
        .when("/category/:name/:id", {
            templateUrl : "fruits/fruits.view.html",
            controller: 'fruitCtrl',
            middleware: 'auth-middleware'
        })

        .when("/order", {
            templateUrl : "order/order.view.html",
            controller: 'orderCtrl',
            middleware: 'auth-middleware'
        })

        .when("/message", {
            templateUrl : "order/order.message.view.html",
            controller: 'orderCtrl',
            middleware: 'auth-middleware'
        })

        .when("/register", {
            templateUrl : "auth/registerForm.html",
            controller: 'authCtrl'
        })
});

coolApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);

var apiUrl = "http://localhost:8081/shopping/api/";

var configCities = ['Jerusalem', 'Tel Aviv', 'Haifa', 'Ashdod', 'Rishon LeZiyyon', 'Petah Tikva', 'Beersheba', 'Netanya', 'Holon', 'Bnei Brak'];
