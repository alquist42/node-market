
coolApp.service('fruitService', function($http) {
    this.getFruits = function(categoryId, onSuccess, onError ) {
        $http({
            url: 'http://localhost:8081/category',
            method: 'GET',
            params: {category: categoryId}
        }).then(onSuccess, onError);
    }

    this.saveFruit = function(fruit, onSuccess, onError ) {
        $http({
            url: 'http://localhost:8081/fruit/edit',
            method: 'POST',
            params: {
                id: fruit.id,
                name: fruit.name,
                price: fruit.price
            }
        }).then(onSuccess, onError);
    }
});
/* SHARE DATA BETWEEN CONTROLLERS */
coolApp.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.fruit = {};
    sharedService.addFruit = function(fruit) {
        this.fruit = fruit;
        this.addingFruitItem();
    };
    sharedService.addingFruitItem = function() {
        $rootScope.$broadcast('handleFruitAdding');
    };
    return sharedService;
});



coolApp.service('AuthService',  function($http) {
    this.checkLoggedIn = function (onSuccess, onError){
        $http({
            url: 'http://localhost:8081/logged_in',
            method: 'GET',
        }).then(onSuccess, onError);
    };

        this.login = function (email, password, onSuccess, onError) {
            $http({
                url: 'http://localhost:8081/login',
                method: 'POST',
                params: {email: email, password:password}
            }).then(onSuccess, onError);
        };
    this.logout = function (onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/logout',
            method: 'POST',
            params: {}
        }).then(onSuccess, onError);
    };

    this.register = function (user,onSuccess, onError) {
        $http({
            url: 'http://localhost:8081/register',
            method: 'POST',
            params: {
                    teudat_zehut: user.teudat_zehut,
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    password: user.password,
                    city: user.city,
                    street: user.street,
                    role: user.role
            }
        }).then(onSuccess, onError);
    };


    });

coolApp.service('cartService', function($http) {
    this.addToCart = function(fruitId, fruitCount, onSuccess, onError ) {
        $http({
            url: 'http://localhost:8081/cart/add',
            method: 'POST',
            params: {
                product: fruitId,
                quantity: fruitCount
            }
        }).then(onSuccess, onError);
    }

    this.getCart = function(onSuccess, onError ) {
        $http({
            url: 'http://localhost:8081/cart/get',
            method: 'GET',
            params: {}
        }).then(onSuccess, onError);
    }

    // this.getCartItems = function(onSuccess, onError ) {
    //     $http({
    //         url: 'http://localhost:8081/cart/get',
    //         method: 'GET',
    //         params: {}
    //     }).then(onSuccess, onError);
    // }

    // this.addCartItem = function(onSuccess, onError ) {
    //     $http({
    //         url: 'http://localhost:8081/cart/add',
    //         method: 'POST',
    //         params: {
    //             id: id,
    //             product: product,
    //             quantity: quantity,
    //             price: price,
    //             cart: cart
    //         }
    //     }).then(onSuccess, onError);
    // }
});

coolApp.factory('myModal', function (btfModal) {
    return btfModal({
        controller: 'MyModalCtrl',
        controllerAs: 'modal',
        templateUrl: 'modal.html'
    });
});

coolApp.controller('MyModalCtrl', function (myModal) {
    let fruit = document.querySelector('.current-fruit');
    this.fruitId = fruit.dataset.fid;
    this.fruitName = fruit.dataset.name;
    this.fruitPrice = fruit.dataset.price;
    this.count=1;
    this.closeMe = myModal.deactivate;
});