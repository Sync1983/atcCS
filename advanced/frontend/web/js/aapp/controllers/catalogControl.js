/* global atcCS */

atcCS.controller( 'catalogControl', [
  '$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify','searchNumberControl', '$events',
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $searchNumberControl, $events ) {
    'use strict';    
    
    var searchEvents = $events.get("searchScope");
    
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.basketName = $user.activeBasket.name;
    $scope.searchEvents = $events.get("searchScope");
    $scope.editMode   = false;
    $scope.nodes      = [];
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
      $scope.event.broadcast("update",row);
    };    
    
    $scope.event.broadcast("update",false); 
    
    $scope.onClick = function(row){
      if(row.is_group){
        $scope.event.broadcast("update",{path:row.path, name:row.name});          
      } else {
        searchEvents.broadcast("StartSearchText",row.articul);
      };      
    };
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;
        $scope.basketName = $user.activeBasket.name;
        $scope.isAdmin    = $user.isAdmin;        
     });   
     
    var changeNodes = function(newVal, oldVal, scope){
      if(angular.equals(newVal, oldVal) || (oldVal.length === 0)) {
        return; // simply skip that
      }
      
      console.log(oldVal,newVal,scope);
    };
     
     
    $scope.$watch(function(scope){return scope.nodes;}, changeNodes,true);          
     
     
}]);

