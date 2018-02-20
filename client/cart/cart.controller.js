
coolApp.controller('cartCtrl', function($scope, $location, $window, $routeParams,$templateRequest,$compile, fruitService, cartService, AuthService, mySharedService, myModal) {
    cartService.getCart(function(res) {
        $scope.cartFruits = [];
        if(res.data.fruits){
            $scope.cartFruits = res.data.fruits;
        }

        $scope.cartId = res.data.cart;
    }, function(res) {
    });
    $scope.$on('handleFruitAdding', function() {
        $scope.cartFruits.push(mySharedService.fruit);
        $scope.cartId = mySharedService.cartId;
    });
    $scope.deleteFruit = function(id) {
        cartService.deleteFromCart(id,function(res) {
            if(res.data.error ){
                if(res.data.error == 'LOGOUT'){
                    $window.location.href = '/';
                } else {
                    alert('DELETING ERROR');
                }
            } else {
                for(let i=0; i<$scope.cartFruits.length; i++){
                    if($scope.cartFruits[i]['id'] == id){
                        $scope.cartFruits.splice(i, 1);
                        break;
                    }
                }
            }
        }, function(err) {alert('DELETING ERROR')});
    }
    $scope.goToOrderStep = function () {
        $location.path('order', true);
    };

});