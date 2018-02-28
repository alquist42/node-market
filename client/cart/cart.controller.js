
coolApp.controller('cartCtrl', function($scope, $location, $window, $routeParams,$templateRequest,$compile, fruitService, cartService, AuthService, mySharedService, myModal) {
    $scope.totalSum = 0;
    cartService.getCart(function(res) {
        $scope.cartFruits = [];
        if(res.data.fruits){
            $scope.cartFruits = res.data.fruits;
        }
        $scope.cartId = res.data.cart;
        $scope.recalcTotal();
    }, function(res) {
    });

    $scope.$on('handleFruitAdding', function() {
        $scope.cartFruits.push(mySharedService.fruit);
        $scope.cartId = mySharedService.cartId;
        $scope.recalcTotal();
    });

    $scope.deleteFruit = function(id) {
        cartService.deleteFromCart(id,function(res) {
            if(res.data.error ){
                if(res.data.errorCode == 1){
                    alert(res.data.error);
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
                $scope.recalcTotal();
            }
        }, function(err) {alert('DELETING ERROR')});
    };

    $scope.deleteAllFruits = function() {
        cartService.deleteAllFromCart(function(res) {
            if(res.data.error ){
                if(res.data.errorCode == 1){
                    alert(res.data.error);
                    $window.location.href = '/';
                } else {
                    alert('DELETING ERROR');
                }
            } else {
                    $scope.cartFruits = [];
                    $scope.recalcTotal();
            }
        }, function(err) {alert('DELETING ERROR')});
    }

    $scope.goToOrderStep = function () {
        $location.path('order', true);
    };

    $scope.recalcTotal = function(){
        $scope.totalSum = 0;
        for(let i=0; i<$scope.cartFruits.length; i++){
            $scope.totalSum += +$scope.cartFruits[i]['price'];
        }
    }

});