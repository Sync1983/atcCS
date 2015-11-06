/* global atcCS */


atcCS.controller( 'searchControl', ['$scope','$filter', 'User', function($scope,$filter,$user) {
    'use strict';

    console.log("searchController"); 
    $scope.markup = null;

    console.log($scope.user);

    $scope.searchListLodaded = function listLoaded(){
      $("body").popover({
        container: "body",
        selector: "[data-toggle=popover]"
      });
    };
    
}]);

atcCS.controller( 'headControl',['$scope','User', function($scope,$user) {
    'use strict';
    $scope.show = $user.isLogin;

    $scope.login      = {
      name: $user.name,
      password: $user.password,
      remember: true
    };

    $scope.onLogin = function(){      
      //$scope.user.login('admin','test',true);
      $user.login($scope.login.name,$scope.login.password,$scope.login.remember);
      return false;
    };
    
}]);