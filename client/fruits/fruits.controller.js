
coolApp.controller('fruitCtrl', function($scope, $location, $routeParams,$templateRequest,$compile, fruitService,cartService, myModal) {


    $scope.showFruit = false;
    $scope.headerText = 'hi fruit';
    $scope.loaded = false;
    $scope.fruits = [];
    var categoryId = categoriesConfig[$routeParams.name];

    fruitService.getFruits(categoryId, function(res) {
        const arr = res.data;
        $scope.keys = Object.keys(arr[0]);
        $scope.fruits = (res.data);
        $scope.categoryId = categoryId;
        $scope.categoryName = $routeParams.name;
        $scope.loaded = true;
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

    $scope.addToCart = function (id, count) {
        cartService.addToCart(id, count);
       console.log('fr',id, count);
    };

    $scope.editFruit = function(){
        $scope.fruitEdited = angular.copy($scope.fruit);
        $templateRequest("fruits/admin.fruits.form.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    };
// TODO
    $scope.saveFruit = function(){
        fruitService.saveFruit($scope.fruitEdited, function(res) {
            console.log(res);
        }, function(res) {});
    }

    $scope.closeForm = function(){
        $templateRequest("fruits/admin.fruits.preview.html").then(function(html){
            var template = angular.element(html);
            angular.element(document.querySelector('.container')).empty().append(template);
            $compile(template)($scope);
        });
    }
    var showModal = myModal.activate;

});
