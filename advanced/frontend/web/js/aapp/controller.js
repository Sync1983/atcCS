/* global atcCS */


atcCS.controller( 'searchControl', ['$scope','$filter', 'User', function($scope,$filter,$user) {
    'use strict';
    $scope.markup = null;

    $scope.searchListLodaded = function listLoaded(){
      $("body").popover({
        container: "body",
        selector: "[data-toggle=popover]"
      });
    };
    
}]);

atcCS.controller( 'headControl',['$scope','User','$wndMng', function($scope,$user,$wndMng) {
    'use strict';

    var window = $wndMng.createWindow();
    window.title = "Тестовое окно";
    window.hAlign = 'center';
    window.vAlign = 'center';
    console.log("Window",window);

    $scope.show = !$user.isLogin;
    
    $scope.login      = {
      name: $user.name,
      password: $user.password,
      remember: true
    };

    $scope.onLogin = function(){      
      //$scope.user.login('admin','test',true);
      $user.login($scope.login.name,$scope.login.password,$scope.login.remember);
      $scope.show = !$user.isLogin;
      return false;
    };

    $scope.$watch(
      function(){ return $user.isLogin },
      function( newVal ){
        $scope.show = !newVal;
      }
    );
    
}]);