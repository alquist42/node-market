
coolApp.controller('orderCtrl', function($scope, $location, $window, $routeParams, $templateRequest, $compile, fruitService, cartService, AuthService, orderService, myModal) {

    AuthService.checkLoggedIn (function(res) {
        if(res.data.error){
            $window.location.href = '/';
        }
    }, function(err) {});

    $scope.order = {};
    cartService.getCart(function(res) {
        $scope.cartFruits = res.data.fruits;
        $scope.cartId = res.data.cart;
    }, function(res) {
    });

    $scope.goToShopPage = function () {
        $location.path('category/fruits', true);
    };


    // $scope.makeOrder = function (data) {
    //     console.log(data)
    // };

    // orderService.makeOrder($scope, function(res) {
    //     const arr = res.data;
    //     $scope.order = (res.data);
    //      console.log($scope.order);
    // }, function(res) {});

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

    // $scope.order = function (id, count, price, name) {
    //     cartService.order(id, count, price, name, function(res) {
    //         mySharedService.addFruit(res.data);
    //     }, function(res) {});
    // };

    $scope.getCity = function(data) {
        alert(345)
        console.log(data);
        // data.cart = $scope.cartId;
        orderService.getCity(data,
            function(res) {
                const arr = res.data;
                // $scope.cities = (city.res.data);
                $scope.city = (res.data);
            }, function(res) {
                alert('unknown order error');
            }
        )
    };

    $scope.getStreet = function() {
       $scope.order.delivery_street = $scope.user.street;
    };

});
