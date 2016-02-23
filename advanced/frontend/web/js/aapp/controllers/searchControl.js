/* global atcCS */

atcCS.controller( 'searchControl', [
  '$scope','$filter', 'User' ,'$routeParams','$rootScope',
  function($scope,$filter,$user,$routeParams,$rootScope ) {
    'use strict';    
    $scope.query  = "";
    $scope.analog = {
      analogShow: $user.analogShow,
    };    
    $scope.markup = {
      values: $user.markup,
      selected: "0"
    }; 
    
    $scope.basket = {
      values: $user.baskets,
      selected: null
    }; 
    
    $scope.markup.values.unshift({n:'Без наценки',v:0});
    $user.baskets.every(function(item){      
      if( item.active ){
        $scope.basket.selected = item.id + "";
      }
      return true;
    });    
    
    $('body').on('click',function(){
      $rootScope.$broadcast('onBgClick',{});
    });
    
    $scope.$watch('analog.analogShow',
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
    
    $scope.$watch('basket.selected',
      function(newVal,oldVal){
        if( oldVal === newVal ){
          return newVal;
        }
        $rootScope.$broadcast('basketValueChange', {
          value: newVal
        });
    });      
}]);

