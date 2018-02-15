
coolApp.controller('orderCtrl', function($scope, $location, $window, $routeParams,$templateRequest,$compile, fruitService,cartService, AuthService, myModal) {

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


    $scope.makeOrder = function (data) {
        console.log(data)
    };

});
