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
      console.log(rows);
      $scope.parts = ObjectHelper.merge($scope.parts, rows);
    }
 
    
    
}]);