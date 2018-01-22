/* global atcCS, ObjectHelper, eventsNames */

atcCS.controller( 'basket', [
    '$scope', 'User' ,'$routeParams','$events', '$location','$rootScope',
    function($scope,$user,$routeParams, $events, $location, $rootScope ) {
    'use strict';
    
    var searchEvents = $events.get(eventsNames.eventsSearch());
    $scope.isLogin = $user.isLogin;         
    $scope.isAdmin = $user.isAdmin;
    $scope.parts = [];
    
    $user.getBasket().then(update);   
    
    $rootScope.$on('userDataUpdate', function(event){
      if( $scope.isLogin !== $user.isLogin ){
        $scope.isLogin = $user.isLogin;
        $user.getBasket().then(update);
      }
      $scope.isAdmin = $user.isAdmin;         
    }); 
    
      
    function update(data){
      var rows = data && data.data;        
      $scope.parts = Object.values(ObjectHelper.merge($scope.parts, rows));
    }
    
    $scope.onChange = function(row){
      row.change = 1;
      $user.updatePartInfo(row).then(function(success){
        row.change = 2;        
      }, function(error){
        row.change = 3;
      });
    };
    
    $scope.onDelete = function(row, index){
      row.delete = 1;
      $user.deletePart(row.id).then(function(success){
        row.delete = 2;
        var id = $scope.parts.indexOf(row);
        $scope.parts.splice(id,1);
      }, function(error){
        row.delete = 3;
      });
    };
    
    $scope.onAdd = function(row){
      row.add = 1;
      $user.orderParts([row]).then(function(success){
        row.add = 2;        
      }, function(error){
        row.add = 3;
      });
    };
 
    
    
}]);