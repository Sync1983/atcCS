/* global atcCS, ObjectHelper, eventsNames */

atcCS.controller( 'catalog', [
    '$scope', 'User' ,'$routeParams','$events', '$location','$rootScope',
    function($scope,$user,$routeParams, $events, $location, $rootScope ) {
    'use strict';
    
    var searchEvents = $events.get(eventsNames.eventsSearch());
    var events       = $events.get(eventsNames.eventsCatalog());
    var path         = $routeParams.path || false; 
    $scope.nodes     = [];
    $scope.ret_path  = [];
    
    $scope.isLogin = $user.isLogin;         
    $scope.isAdmin = $user.isAdmin;
    
    function update(event, data){      
      $scope.nodes = data.nodes;
      $scope.ret_path = data.path;
    }
    
    $scope.onArticulSearch = function(articul){
      searchEvents.broadcast("StartSearchText",articul);
    };
    
    $scope.goTo = function(node){
      $scope.$evalAsync(function() {
          $location.path('catalog/'+node.path);
      });
    };
    
    events.setListner("update",update);
    events.broadcast("getData",path);  
        
    $rootScope.$on('userDataUpdate', function(event){
      if( $scope.isLogin !== $user.isLogin ){
        $scope.isLogin = $user.isLogin;        
      }
      $scope.isAdmin = $user.isAdmin;         
    }); 
    
    
}]);