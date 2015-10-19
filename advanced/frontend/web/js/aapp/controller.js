/* global atcCS */


atcCS.controller( 'searchControl', ['$scope','$filter', 'User', function($scope,$filter,$user) {
    'use strict';

    $scope.markup = null;

    console.log($scope.user);

    $scope.searchListLodaded = function listLoaded(){
      $("body").popover({
        container: "body",
        selector: "[data-toggle=popover]"
      });
    };
    
}]);

atcCS.controller( 'headControl',['$scope', function($scope) {
    'use strict';
    
    $scope.loginShow  = true;
    $scope.login      = {
      name: null,
      password: null,
      remember: false
    };

    $scope.onLogin = function(){      
      $scope.user.login('admin','test',true);
      //$user.login($scope.login.name,$scope.login.password,$scope.login.remember);
      $scope.loginShow = false;      
    };

    $scope.showLogin = function(){      
      $scope.loginShow = ! $scope.loginShow;
    };
    
}]);