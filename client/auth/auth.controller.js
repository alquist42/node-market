coolApp.controller('authCtrl', function($scope, $templateRequest, $location, $routeParams, $compile, $window, AuthService, fruitService, orderService, cartService) {
    const userExample= {
        email: 'email@example.com',
        password: '123',
        name: 'guest',
        role: 'client'
    };
    AuthService.checkLoggedIn (function(res) {
        if(res.data.error){
        } else{
            $scope.user = res.data;
            $templateRequest("auth/dashboard.html").then(function(html){
                var template = angular.element(html);
                angular.element(document.querySelector('#section1')).empty().append(template);
                $compile(template)($scope);
            });
        }
    }, function(err) {
    });
            $scope.user = userExample;
            $scope.login = function(user) {
              //  console.log(user)
                AuthService.login(user.email, user.password,
                    function(res) {
                        if(res.data.error){
                            alert(res.data.error)
                        } else{
                            $scope.user = res.data;
                            $templateRequest("auth/dashboard.html").then(function(html){
                                var template = angular.element(html);
                                angular.element(document.querySelector('#section1')).empty().append(template);
                                $compile(template)($scope);
                            });
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
                            $scope.user = res.data;
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

            $scope.isClient = function (role) {
                return role == 'client';
            };

            $scope.fruits = [];
            fruitService.getFruits($scope, function(res) {
                $scope.fruits = res.data;
                // $scope.categoryName = $routeParams.name;
                // $scope.loaded = true;
            }, function(res) {});

            // $scope.recalcTotalProducts = function(){
            //     $scope.sumProducts = 0;
            //     for(let i=0; i<$scope.fruits.length; i++){
            //         $scope.sumProducts += +$scope.fruits[i]['id'];
            //     }
            // }
            $scope.order = {};
            $scope.makeOrder = function(data) {
                data.cart = $scope.cartId;
                orderService.makeOrder(data,
                    function(res) {
                        const arr = res.data;
                        $scope.orders = (res.data);
                    }, function(res) {
                        alert('unknown order error');
                    }
                )
            };

            $scope.totalSum = 0;
            cartService.getCart(function(res) {
                $scope.cartFruits = res.data.fruits;
                $scope.cartId = res.data.cart;
                for(let i=0; i<$scope.cartFruits.length; i++){
                    $scope.totalSum += +$scope.cartFruits[i]['price'];
                }
            }, function(res) {
            });

});
