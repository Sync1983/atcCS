/* global atcCS */


atcCS.controller( 'searchControl', ['$scope','$filter', 'User', function($scope,$filter,$user) {
    'use strict';
    $scope.markup = null;
    $scope.query  = "asd";

    $scope.searchListLodaded = function listLoaded(){
      $("body").popover({
        container: "body",
        selector: "[data-toggle=popover]"
      });
    };
    
}]);



atcCS.controller( 'articulListController',['$scope','User','$wndMng', function($scope,$user,$wndMng) {
    
  $scope.onLoadArticulInfo = function onLoadArticulInfo(articulData){
    var $scope = this;
    console.log('articulInfo',articulData);
    $user.getArticulInfo(articulData.id).then(
      function(answer){
        var data = answer && answer.data;
        if( !data ){
          return;
        }

        var window = $wndMng.createWindow({
              title:  "\"" + articulData.number + "\"",
              hPos:   $scope.wnd.hPos,
              vPos:   $scope.wnd.vPos + $scope.wnd.vSize * 0.05,
              vSize:  $scope.wnd.vSize,
              hSize:  $scope.wnd.hSize,
              showStatusBar: false,
            });

        var newScope          = $scope.$new(true);
        newScope.id           = data.id;
        newScope.number       = data.number;
        newScope.supplier     = data.supplier;
        newScope.description  = data.description;
        newScope.cross        = data.cross;
        newScope.wnd          = window;

        $wndMng.setBodyByTemplate(window, '/parts/_articul-info-part.html', newScope);        
    });
  };
  
}]);

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