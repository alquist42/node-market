coolApp.controller('authCtrl', function($scope, $templateRequest, $location, $routeParams, $compile, $window, AuthService, fruitService, orderService, cartService) {
    const userExample= {
        email: 'email@example.com',
        // password: '123',
        name: 'guest',
        role: 'client'
    };
    $scope.user = userExample;
    $scope.isLoggedIn = false;
    $scope.totalSum = 0;
    $scope.fruitsCount = 0;
    $scope.ordersCount = 0;
    AuthService.checkLoggedIn (function(res) {
        if(res.data.error){
        } else{
            $scope.isLoggedIn = true;
            $scope.user = res.data;
            $scope.setCartData();
            // $templateRequest("auth/dashboard.html").then(function(html){
            //     var template = angular.element(html);
            //     angular.element(document.querySelector('#section1')).empty().append(template);
            //     $compile(template)($scope);
            // });
        }
    }, function(err) {
    });

    $scope.$on('$routeChangeSuccess', function () {
        if($location.path() == "/"){
            $scope.init();
        }
    });

    $scope.init = function(){
        fruitService.getFruitsCount(function(res) {
            if(res.data.error){
                alert(res.data.error)
            } else {
                $scope.fruitsCount = res.data;
            }

        }, function(res) {});

        orderService.getOrdersCount(function(res) {
            if(res.data.error){
                alert(res.data.error)
            } else {
                $scope.ordersCount = res.data;
            }

        }, function(res) {});

        if($scope.isLoggedIn){
            $scope.setCartData();
        }
    }

    $scope.setCartData = function(){
        cartService.getHistory(function(res) {
            $scope.cartDate = res.data.cart_date;
            $scope.orderDate = res.data.order_date;
            $scope.totalSum = res.data.total_price;
        }, function(res) {
        });
    };

    $scope.login = function(user) {
      //  console.log(user)
        AuthService.login(user.email, user.password,
            function(res) {
                if(res.data.error){
                    alert(res.data.error)
                } else{
                    $scope.isLoggedIn = true;
                    $scope.user = res.data;
                    $scope.setCartData();
                    // $templateRequest("auth/dashboard.html").then(function(html){
                    //     var template = angular.element(html);
                    //     angular.element(document.querySelector('#section1')).empty().append(template);
                    //     $compile(template)($scope);
                    // });
                }
            }, function(res) {
                alert('unknown login error');
            }
        )
            // .then(function() {
            //     $state.go('add-review');
            // });
    };

    $scope.logout = function(user) {
        AuthService.logout(
            function(res) {
                $scope.isLoggedIn = false;
                $scope.user = userExample;
                console.log('logout success');
            }, function(res) {
                console.log('logout error');
            }
        )
    };

    $scope.showRegisterFormStep1 = function(force) {
        if(force){
            document.querySelector('#step2').classList.add("hidden");
            document.querySelector('#step1').classList.remove("hidden");
        } else {
            $location.path('register', false);
        }
    };

    $scope.showRegisterFormStep2 = function() {
        document.querySelector('#step1').classList.add("hidden");
        document.querySelector('#step2').classList.remove("hidden");
    };

    $scope.register = function(user) {
        AuthService.register(user,
            function(res) {
                if(res.data.error){
                    $scope.serverError = res.data.error;
                    alert(res.data.error);
                } else{
                    $scope.isLoggedIn = true;
                    $scope.user = res.data;
                    $scope.setCartData();
                    $window.location.href = '/';
                }
            }, function(res) {
                alert('unknown registration error');
            }
        )
    };

    $scope.isAdmin = function (role) {
        return role == 'admin';
    };


});
