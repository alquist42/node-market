
coolApp.controller('orderCtrl', function($scope, $location, $window, $routeParams, $templateRequest, $compile, fruitService, cartService, AuthService, orderService, myModal) {

    AuthService.checkLoggedIn (function(res) {
        if(res.data.error){
            $window.location.href = '/';
        }
    }, function(err) {});
    $scope.totalSum = 0;
    $scope.order = {};
    cartService.getCart(function(res) {
        $scope.cartFruits = res.data.fruits;
        $scope.cartId = res.data.cart;
        for(let i=0; i<$scope.cartFruits.length; i++){
            $scope.totalSum += +$scope.cartFruits[i]['price'];
        }
    }, function(res) {
    });

    $scope.goToShopPage = function () {
        $location.path('category/fruits', true);
    };

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

    $scope.getCity = function(data) {
        $scope.order.delivery_city = $scope.user.city;
    };

    $scope.getStreet = function() {
       $scope.order.delivery_street = $scope.user.street;
    };

    $scope.goToMessage = function () {
        $location.path('message', true);
    };

    $scope.goToMain = function () {
        $location.path('/', true);
    };

});