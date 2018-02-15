
coolApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "auth/index.html",
         //   controller: 'AuthLoginController'
            })

        .when("/admin/category/:name", {
            templateUrl : "fruits/admin.fruits.view.html",
            controller: 'fruitCtrl'
        })
        .when("/admin/category/:name/:id", {
            templateUrl : "fruits/admin.fruits.view.html",
            controller: 'fruitCtrl'
        })
        .when("/category/:name", {
            templateUrl : "fruits/fruits.view.html",
            controller: 'fruitCtrl'
        })
        .when("/category/:name/:id", {
            templateUrl : "fruits/fruits.view.html",
            controller: 'fruitCtrl'
        })

        .when("/order", {
            templateUrl : "cart/order.view.html",
            controller: 'orderCtrl'
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
}])

var categoriesConfig = {
    'eggs':1,
    'fruits':2,
    'fishes':3,
    'drinks':4
}
