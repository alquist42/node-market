
coolApp.controller('fruitCtrl', function($scope, $location, $window, $routeParams, $templateRequest, $compile, fruitService, cartService, AuthService, mySharedService, myModal) {

    AuthService.checkLoggedIn (function(res) {
        if(res.data.error){
            $window.location.href = '/';
        }
    }, function(err) {});


    $scope.showFruit = false;
    $scope.headerText = 'hi fruit';
    $scope.loaded = false;
    $scope.fruits = [];
    var categoryId = categoriesConfig[$routeParams.name];

    fruitService.getFruits(categoryId, function(res) {
        const arr = res.data;
        //   $scope.keys = Object.keys(arr[0]);
        $scope.fruits = (res.data);
        $scope.categoryId = categoryId;
        $scope.categoryName = $routeParams.name;
        $scope.loaded = true;
        // $scope.categories = (res.data);
        //  console.log('xx', $routeParams.id)
    }, function(res) {});


    var getFruit = function (id) {
        $scope.fruit = $scope.fruits.filter(function(fruit){
            return fruit.id == id;
        })[0];
        $scope.showFruit = true;
    };

    $scope.goToFruit = function (categoryName, id) {
        getFruit(id);
        $location.path('admin/category/' + categoryName + '/' + id, false);
    };

    $scope.showFruitPopup = function (categoryName, id) {
        var fruits = document.querySelectorAll('.fruit-item');
        [].forEach.call(fruits, function(fruits) {
            fruits.classList.remove('current-fruit');
        });
        document.querySelector('#fruit-'+id).classList.add('current-fruit');
        showModal();
    };


    $scope.$watch('loaded', function(newVal, oldVal, $scope) {
        if($scope.loaded && $routeParams && $routeParams.id){
            getFruit($routeParams.id);
        }
    });

    $scope.addToCart = function (id, count, price, name) {
        cartService.addToCart(id, count, price, name, function(res) {
            mySharedService.addFruit(res.data);
        }, function(res) {});
    };

    $scope.editFruit = function(){
        $scope.fruitEdited = angular.copy($scope.fruit);
        $templateRequest("fruits/admin.fruits.form.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    };

    $scope.addFruit = function(){
        // $scope.fruitAdded = angular.copy($scope.fruit);
        $templateRequest("fruits/admin.fruits.add.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    };

    $scope.saveFruit = function(){
        var callService = function(){
            return fruitService.saveFruit($scope.fruitEdited, function(res) {
                if(res.data.error ){
                    if(res.data.error == 'LOGOUT'){
                        $window.location.href = '/';
                    } else {
                        alert('SAVING ERROR');
                    }
                } else {
                    if(res.data.file){
                        $scope.fruitEdited.image = res.data.file;
                    }
                    for(let i=0; i<$scope.fruits.length; i++){
                        if($scope.fruits[i]['id'] == $scope.fruitEdited.id){
                            $scope.fruits[i] = $scope.fruit = $scope.fruitEdited;
                            break;
                        }
                    }
                    $scope.closeForm();
                }
            }, function(err) {
                alert('saving error')
            });
        }

        var f = document.getElementById('file').files[0];
        if(f){
            var r = new FileReader();
            if(f.size > 46000){
                alert('file is too big!');
                return;
            }
            r.onloadend = function(e) {
                var data = e.target.result;
                $scope.fruitEdited.file = data;
                callService();

            };
            r.readAsDataURL(f);
        } else {
            callService();
        }
    }

    $scope.saveAddFruit = function(){
        fruitService.addFruit($scope.fruitAdded, function(res) {
            if(res.data.error ){
                if(res.data.error == 'LOGOUT'){
                    $window.location.href = '/';
                } else {
                    alert('SAVING ERROR');
                }
            } else {
                for(let i=0; i<$scope.fruits.length; i++){
                    if($scope.fruits[i]['id'] == $scope.fruitAdded.id){
                        $scope.fruits[i] = $scope.fruit = $scope.fruitEdited;
                        break;
                    }
                }
                $scope.closeForm();
            }
        }, function(err) {alert('saving error')});
    }

    $scope.closeForm = function(){
        $templateRequest("fruits/admin.fruits.preview.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    }
    var showModal = myModal.activate;

    fruitService.getCategories($scope, function(res) {
        const arr = res.data;
        // $scope.fruits = (res.data);
        // $scope.categoryId = categoryId;
        // $scope.categoryName = $routeParams.name;
        // $scope.loaded = true;
        $scope.categories = (res.data);
    }, function(res) {});

    // var getCategories = function (id) {
    //     $scope.categories = $scope.fruits.filter(function(category){
    //         return category.id == id;
    //     })[0];
    //     $scope.showFruit = true;
    // };

    // $scope.getCategories = function(){
    //     fruitService.getCategories($scope.fruitEdited, function(res) {
    //         if(res.data.error ){
    //             if(res.data.error == 'LOGOUT'){
    //                 $window.location.href = '/';
    //             } else {
    //                 alert('SAVING ERROR');
    //             }
    //         } else {
    //             for(let i=0; i<$scope.fruits.length; i++){
    //                 if($scope.fruits[i]['id'] == $scope.fruitEdited.id){
    //                     $scope.fruits[i] = $scope.fruit = $scope.fruitEdited;
    //                     break;
    //                 }
    //             }
    //             $scope.closeForm();
    //         }
    //     }, function(err) {alert('saving error')});
    // }
});
