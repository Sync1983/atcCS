/* global atcCS, eventsNames */

atcCS.controller( 'brands', [
    '$scope', 'User' ,'$routeParams','$events', '$location', 
    function($scope,$user,$routeParams, $events, $location ) {
    'use strict';        
    
    var searchEvents = $events.get(eventsNames.eventsSearch());
    $scope.searchText = $routeParams.searchText || false;
    $scope.count      = 0;    
    $scope.inSearch   = true;
      
    searchEvents.broadcast('change', $scope.searchText);
    
    $user.getBrands( $scope.searchText, serverResponse);
    
 
    function serverResponse(data){
      $scope.inSearch = false;      
      if( !data || !data.count ){
        return;
      }      
      var keys = Object.keys(data.rows).sort();
      var list = {};
      for(var i in keys){
        var key = keys[i];
        list[key] = data.rows[key];
      }      
      $scope.brands = list;
    }
    
}]);