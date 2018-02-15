
coolApp.controller('cartCtrl', function($scope, $location, $window, $routeParams,$templateRequest,$compile, fruitService,cartService, AuthService, myModal) {
    cartService.getCart(function(res) {
        $scope.cartFruits = (res.data);
    }, function(res) {
    });

    $scope.goToOrderStep = function () {
        $location.path('order', true);
    };
});
