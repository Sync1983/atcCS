/* global atcCS, eventsNames */

atcCS.controller( 'brandsSearch', [
    '$scope', 'User' ,'$routeParams','$events', '$anchorScroll', '$location', 
    function($scope,$user,$routeParams, $events, $anchorScroll, $location ) {
    'use strict';        
    
    var searchEvents = $events.get(eventsNames.eventsSearch());
    $scope.searchText = $routeParams.searchText || false;
    $scope.count      = 0;
    $scope.titleShow  = {};
    $scope.isScroll   = false;
      
    searchEvents.broadcast('change', $scope.searchText);
    
    $user.getBrands( $scope.searchText, serverResponse);
    
    /*
    function createMultiList(data){ 
      var list      = {};
      var sortData  = {};
      var keys      = Object.keys(data);
      
      keys.sort();
      
      for(var i in keys){
        var key = keys[i];
        var letter = String(key).substring(0,1);
        sortData[key] = data[key];        
        $scope.titleShow[letter] = true;
      }
      
      
      for(var key in sortData){
        var letter = String(key).substring(0,1);
        if( !list.hasOwnProperty(letter) ){
          list[letter] = {};
        }
        
        list[letter][key] = sortData[key];
      }
      
      return list;
    }
    */
    function serverResponse(data){
      $scope.inSearch = false;
      console.log(data);
      if( !data || !data.count ){
        return;
      }      
      
      $scope.brands = createMultiList(data.rows || []);
      $scope.count  = data.count;      
      
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