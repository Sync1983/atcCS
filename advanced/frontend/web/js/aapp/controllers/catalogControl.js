/* global atcCS */

atcCS.controller( 'catalogControl', [
  '$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify','searchNumberControl', '$events',
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $searchNumberControl, $events ) {
    'use strict';    
    
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.basketName = $user.activeBasket.name;
    $scope.searchEvents = $events.get("searchScope");
    $scope.path = [
      {
        name:"Каталог",
        path:false
      }
    ];
    
    $scope.event = $events.get("catalogScope");
    
    $scope.event.setListner("update",function(event, data){
      var path = data && data.path || false;
      var name = data && data.name || "";
      
      $user.getCatalogNode(path,function(data){
        $scope.nodes = data;      
      });
      
      if( name && path ) {
        $scope.path.push({
          name:name,
          path:path
        });
      }
      
    });
    
    $scope.onPathSelect = function(row){
      
      for(var i in $scope.path){
        var item = $scope.path.pop();
        if( row.path === item.path ){          
          break;
        }
      }
      //$scope.path.push(item);
      $scope.event.broadcast("update",row);
    };    
    
    $scope.event.broadcast("update",false);           
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;
        $scope.basketName = $user.activeBasket.name;
        $scope.isAdmin    = $user.isAdmin;        
     });        
     
     
}]);

