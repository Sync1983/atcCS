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

atcCS.controller( 'headControl',['$scope','User','$wndMng','$templateCache', function($scope,$user,$wndMng,$templateCache) {
    'use strict';

    var menu = $(".search-bar");
    
    var loginHtml = $templateCache.get('/parts/_login-part.html');
    var window = $wndMng.createWindow({
      title: "Авторизация",
      vPos: menu.position().top + menu.height(),
      hSize: $(".view").position().left,
      vSize: 170,
      hAlign: 'left',
      showStatusBar: false,
      canResize: false,
      canMove: false,
      show: !$user.isLogin
    });
    $wndMng.setBody(window, loginHtml, $scope);    
    

    var window1 = $wndMng.createWindow();
    window1.title = "1 Тестовое окно 1";
    window1.hAlign = 'right';
    window1.vAlign = 'top';    

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
        window.show = !newVal;
      }
    );
    
}]);