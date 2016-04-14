/* global atcCS */

atcCS.controller( 'searchControl', [
  '$scope','$filter', 'User' ,'$routeParams','$rootScope',
  function($scope,$filter,$user,$routeParams,$rootScope ) {
    'use strict';    
    $scope.query  = "";
    var defaultMarkup = {n:'Без наценки',v:0};
    
    $scope.analog = {
      analogShow: $user.analogShow,
    };    
    $scope.markup = {
      values:   $user.markup,
      selected: JSON.stringify(defaultMarkup)
    }; 
    
    $scope.basket = {
      values: $user.baskets,
      selected: null
    }; 
    
    $scope.markup.values.unshift(defaultMarkup);
    setActiveBasket();
    
    function setActiveBasket(){      
      $user.baskets.every( function(item){      
        if( item.active ){
          $scope.basket.selected  = item.id + "";
          return false;
        }
        return true;
      });    
    }
    
    $('body').on('click',function(){
      $rootScope.$broadcast('onBgClick',{});
    });
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.basket.values = $user.baskets;
        $scope.markup.values = $user.markup;
        setActiveBasket();
        $scope.markup.values.unshift(defaultMarkup);
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
        var value = JSON.parse(newVal);        
        $rootScope.$broadcast('markupValueChange', {
          value: value.v,
          name: value.n
        });
    });
    
    $scope.$watch('basket.selected',
      function(newVal,oldVal){        
        if( !oldVal || (oldVal === newVal) ){
          return newVal;
        }
        $rootScope.$broadcast('basketValueChange', {
          value: newVal
        });
    });
        
}]);

