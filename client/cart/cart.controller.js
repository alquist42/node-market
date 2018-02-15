
coolApp.controller('cartCtrl', function($scope, $location, $window, $routeParams,$templateRequest,$compile, fruitService, cartService, AuthService, mySharedService, myModal) {
    cartService.getCart(function(res) {
        $scope.cartFruits = res.data;
    }, function(res) {
    });
    $scope.$on('handleFruitAdding', function() {
        $scope.cartFruits.push(mySharedService.fruit);
    });
    $scope.deleteFruit = function(id) {
        cartService.deleteFromCart(id,function(res) {
           console.log('resdelete',res.data);
            if(res.data.error && res.data.error == 'LOGOUT'){
                $window.location.href = '/';
            }
        }, function(err) {});
    }
    $scope.goToOrderStep = function () {
        $location.path('order', true);
    };
});