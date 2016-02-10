/* global atcCS */

atcCS.controller( 'searchControl', [
  '$scope','$filter', 'User' ,'$routeParams','$rootScope',
  function($scope,$filter,$user,$routeParams,$rootScope ) {
    'use strict';
    $scope.markup = null;
    $scope.query  = "";
    $scope.analog = $user.analogShow; 
    $scope.markup = {
      values: $user.markup,
      selected: "0"
    }; 
    
    $scope.markup.values.unshift({n:'Без наценки',v:0});
    
    $scope.$watch('analog',
      function(newVal,oldVal){
        if( oldVal === newVal ){
          return newVal;
        }
        $rootScope.$broadcast('analogStateChange', {
          value: newVal
        });        
    });      
    
    $scope.$watch('markup.selected',
      function(newVal,oldVal){
        if( oldVal === newVal ){
          return newVal;
        }
        $rootScope.$broadcast('markupValueChange', {
          value: newVal
        });
    });      
}]);

