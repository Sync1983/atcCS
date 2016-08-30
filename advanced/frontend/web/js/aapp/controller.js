/* global atcCS */  

atcCS.controller( 'headControl',['$scope','User','$wndMng','$templateCache', function($scope,$user,$wndMng,$templateCache) {
    'use strict';

    var menu = $(".search-bar");    
    
    var window = $wndMng.createWindow({
      title: "Авторизация",
      hPos: 0,
      vPos: menu.position().top + menu.height(),
      hSize: $(".view").position().left,
      vSize: 170,
      hAlign: 'left',
      showStatusBar: false,
      showClose: false,
      canResize: false,
      canMove: false,
      show: !$user.isLogin
    });
    $wndMng.setBodyByTemplate(window, '/parts/_login-part.html', $scope);

    $scope.show = !$user.isLogin;
    $scope.request = false;
    
    $scope.login      = {
      name: $user.name,
      password: $user.password,
      remember: true
    };

    $scope.onLogin = function(){
      $scope.request = true;
      
      $user.login($scope.login.name,$scope.login.password,$scope.login.remember).then(function(answer){
        $scope.request = false;        
      },function(reason){
        $scope.request = false;        
      });
      
      $scope.show = !$user.isLogin;
      return false;
    };

    $scope.$watch(
      function(){ return $user.isLogin; },
      function( newVal ){
        $scope.show = !newVal;
        window.show = !newVal;
      }
    );
    
}]);