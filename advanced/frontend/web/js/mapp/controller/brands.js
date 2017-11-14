/* global atcCS, eventsNames */

atcCS.controller( 'brands', [
    '$scope', 'User' ,'$routeParams','$events', '$anchorScroll', '$location', 
    function($scope,$user,$routeParams, $events, $anchorScroll, $location ) {
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
      $scope.brands = keys;
    }
    
    $scope.goToTarget = function(letter){
      var newHash = 'tag' + letter;                  
      $anchorScroll(newHash);
    };
    
    
    angular.element("div.view").bind("scroll", function(event) {            
      if (event.currentTarget.scrollTop >= 100) {
        $scope.isScroll = true;
      } else {
        $scope.isScroll = false;
      }
      $scope.$apply();
     });
    
}]);