/* global atcCS */

atcCS.controller( 'catalogControl', [
  '$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify','searchNumberControl',
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $searchNumberControl ) {
    'use strict';    
    
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.basketName = $user.activeBasket.name;
    $scope.path = [
      {
        name:"Каталог",
        path:false
      }
    ];
    
    updateNodes(false)
    
    function updateNodes(path){
      $user.getCatalogNode(path,function(data){
        $scope.nodes = data;      
      });
    }
    
    
    $scope.onPathSelect = function(path){
      var item = $scope.path.pop();
      while( item.path != path ){        
        item = $scope.path.pop();      
      }
      
      $scope.path.push(item);
      updateNodes(item.path);
    };
    
    $scope.onNodeSelect = function(path, name){      
      $user.getCatalogNode(path,function(data){
        $scope.nodes = data;
        $scope.path.push({
          name: name,
          path: path
        });
    });
    };
    
    $scope.onPartSelect = function(part){
      $searchNumberControl.search(part.articul);
    };
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;
        $scope.basketName = $user.activeBasket.name;
        $scope.isAdmin    = $user.isAdmin;        
     });        
     
     
}]);

