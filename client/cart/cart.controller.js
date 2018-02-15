
coolApp.controller('cartCtrl', function($scope, $location, $window, $routeParams,$templateRequest,$compile, fruitService, cartService, AuthService, mySharedService, myModal) {
    cartService.getCart(function(res) {
        console.log('FRUITS', res.data);
        $scope.cartFruits = res.data;
    }, function(res) {
    });
    $scope.$on('handleFruitAdding', function() {
        $scope.cartFruits.push(mySharedService.fruit);
    });

    $scope.goToOrderStep = function () {
        $location.path('order', true);
    };
});