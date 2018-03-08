/******************** PRODUCT SERVICE ******************************/
coolApp.service('fruitService', function($http) {
    this.getFruits = function(categoryId, onSuccess, onError) {
        $http({
            url: apiUrl + 'product/findByCategory',
            method: 'GET',
            params: {category: categoryId}
        }).then(onSuccess, onError);
    }

    this.getFruitsCount = function(onSuccess, onError) {
        $http({
            url: apiUrl + 'product/count',
            method: 'GET'
        }).then(onSuccess, onError);
    }

    this.saveFruit = function(fruit, onSuccess, onError) {
        $http({
            url: apiUrl + 'product',
            method: 'PUT',
            data: fruit
        }).then(onSuccess, onError);
    }

    this.uploadImage = function(fd, onSuccess, onError){
        $http({
            url: apiUrl + 'product/image',
            method: 'PUT',
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity

        }).then(onSuccess, onError);
    };
    this.addFruit = function(fruit, onSuccess, onError) {
        $http({
            url: apiUrl + 'product',
            method: 'POST',
            data: {
                id: fruit.id,
                name: fruit.name,
                category: fruit.category,
                price: fruit.price,
                image: fruit.image
            }
        }).then(onSuccess, onError);
    }

    this.getCategories = function(category, onSuccess, onError) {
        $http({
            url: apiUrl + 'category',
            method: 'GET'
        }).then(onSuccess, onError);
    }
});

/******************** AUTH SERVICE ******************************/

coolApp.service('AuthService', function($http) {
    this.checkLoggedIn = function (onSuccess, onError){
        $http({
            url: apiUrl + 'logged_in',
            method: 'GET'
        }).then(onSuccess, onError);
    };

    this.checkIsAdmin = function (onSuccess, onError){
        $http({
            url: apiUrl + 'is_admin',
            method: 'GET'
        }).then(onSuccess, onError);
    };

    this.login = function (email, password, onSuccess, onError) {
        $http({
            url: apiUrl + 'login',
            method: 'POST',
            data: {email: email, password:password}
        }).then(onSuccess, onError);
    };

    this.logout = function (onSuccess, onError) {
        $http({
            url: apiUrl + 'logout',
            method: 'GET',
        }).then(onSuccess, onError);
    };

    this.register = function (user, onSuccess, onError) {
        $http({
            url: apiUrl + 'register',
            method: 'POST',
            data: {
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

/******************** CART SERVICE ******************************/
coolApp.service('cartService', function($http) {
    this.addToCart = function(fruitId, fruitCount, fruitPrice, fruitName, onSuccess, onError) {
        $http({
            url: apiUrl + 'cart',
            method: 'POST',
            data: {
                product: fruitId,
                quantity: fruitCount,
                price: fruitPrice,
                name: fruitName
            }
        }).then(onSuccess, onError);
    }

    this.deleteFromCart = function(itemId, onSuccess, onError) {
        $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
        $http({
            url: apiUrl + 'cart',
            method: 'DELETE',
            data: {
                id: itemId
            }
        }).then(onSuccess, onError);
    }

    this.deleteAllFromCart = function(onSuccess, onError) {
        $http({
            url: apiUrl + 'cart',
            method: 'DELETE',
        }).then(onSuccess, onError);
    }

    this.getCart = function(onSuccess, onError) {
        $http({
            url: apiUrl + 'cart',
            method: 'GET',
        }).then(onSuccess, onError);
    }

    this.getHistory = function(onSuccess, onError) {
        $http({
            url: apiUrl + 'history',
            method: 'GET',
        }).then(onSuccess, onError);
    }

});

/******************** ORDER SERVICE ******************************/

coolApp.service('orderService', function($http) {
    this.makeOrder = function(order, onSuccess, onError) {
        $http({
            url: apiUrl + 'order',
            method: 'POST',
            data: order
        }).then(onSuccess, onError);
    }

    this.getOrdersCount = function(onSuccess, onError) {
        $http({
            url: apiUrl + 'order/count',
            method: 'GET'
        }).then(onSuccess, onError);
    }

    this.getDates = function(onSuccess, onError) {
        $http({
            url: apiUrl + 'order/dates',
            method: 'GET'
        }).then(onSuccess, onError);
    }

});

/******************** OTHER SERVICES ******************************/

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

/* SHARE DATA BETWEEN CONTROLLERS */
coolApp.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.fruit = {};
    sharedService.addFruit = function(fruit) {
        this.fruit = fruit;
        this.cartId = fruit.cart;
        this.addingFruitItem();
    };
    sharedService.addingFruitItem = function() {
        $rootScope.$broadcast('handleFruitAdding');
    };
    return sharedService;
});