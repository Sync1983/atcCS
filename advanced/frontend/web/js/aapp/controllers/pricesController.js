/* global atcCS */

atcCS.controller( 'pricesController', [
  '$scope','$filter', 'User' ,'$routeParams','$rootScope','$wndMng',
  function($scope,$filter,$user,$routeParams,$rootScope,$wndMng ) {
    'use strict';
    var init = false;
    $scope.providers = {};
    
    function initData(){
      console.log('FirstInit');
    }
    
    $scope.$on('visibleChange',function(event, data){
      if( (data.value === true) && (!init) ){
        init = true;
        initData();
      }
    });
}]);

