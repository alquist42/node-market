
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

    $scope.order = function(user) {
        cartService.order(user,
            function(res) {
                if(res.data.error){
                    $scope.serverError = res.data.error;
                    alert(res.data.error);
                } else{
                    $scope.user = res.data;
                    $window.location.href = '/';
                }
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