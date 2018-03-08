
coolApp.controller('orderCtrl', function($scope, $location, $window, $routeParams, $templateRequest, $compile, fruitService, cartService, AuthService, orderService, myModal) {

    $scope.totalSum = 0;
    $scope.order = {};
    cartService.getCart(function(res) {
        $scope.cartFruits = res.data.fruits;
        $scope.cartId = res.data.cart;
        $scope.totalSum = res.data.totalSum;
    }, function(res) {
    });

    $scope.goToShopPage = function () {
        $location.path('category/fruits', true);
    };

    $scope.makeOrder = function(data) {
        data.cart = $scope.cartId;
        orderService.makeOrder(data,
            function(res) {
                $scope.orders = res.data;
                $scope.goToMessage();
            }, function(res) {
                alert('unknown order error');
            }
        )
    };

    $scope.getCity = function(data) {
        $scope.order.delivery_city = $scope.user.city;
    };

    $scope.getStreet = function() {
       $scope.order.delivery_street = $scope.user.street;
    };

    $scope.goToMessage = function () {
        $location.path('message', true);
    };

    $scope.goToMain = function () {
        $location.path('/', true);
    };

    orderService.getDates($scope, function(res) {
        $scope.dates = res.data;
        // $scope.categoryName = $routeParams.name;
        // $scope.loaded = true;
    }, function(res) {});

   $scope.initDatepicker = function(){
       $("#datepicker").datepicker({
           beforeShowDay: function (date) {
               // var disableddates = ["3-5-2018", "12-11-2014", "12-25-2014", "12-20-2014"];
               var disableddates = [$scope.dates];
               var m = date.getMonth();
               var d = date.getDate();
               var y = date.getFullYear();
               var currentdate = (m + 1) + '-' + d + '-' + y;
               if (jQuery.inArray(currentdate, disableddates) != -1) {
                   return [false];
               }
               return [true];
           }
       });
   }

});