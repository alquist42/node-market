
coolApp.controller('orderCtrl', function($scope, $location, $window, $routeParams, $templateRequest, $compile, fruitService, cartService, AuthService, orderService, myModal) {

    AuthService.checkLoggedIn (function(res) {
        if(res.data.error){
            $window.location.href = '/';
        }
    }, function(err) {});


    cartService.getCart(function(res) {
        $scope.cartFruits = (res.data);
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
        console.log(234);
        orderService.makeOrder($scope,
            function(res) {
                // if(res.data.error){
                //     $scope.serverError = res.data.error;
                //     alert(res.data.error);
                // } else{
                const arr = res.data;
                $scope.orders = (res.data);
                    // $window.location.href = '/';
                // }
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
});
