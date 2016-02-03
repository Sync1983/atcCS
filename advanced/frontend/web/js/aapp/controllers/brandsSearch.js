/* global atcCS */

atcCS.controller( 'brandsSearch', [
    '$scope','$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage',
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage ) {
    'use strict';    
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.count      = 0;
    
    if( !$scope.timestamp ){
      $scope.timestamp = Math.round( (new Date()).getTime() / 1000 );
    }
    
    if( $storage.get($scope.timestamp) ){
      //Было закешировано      
      serverResponse($storage.get($scope.timestamp));
    } else if( $scope.searchText ){      
      //Надо загрузить
      $snCtrl.change($scope.searchText);
      $scope.inSearch = true;
      $user.getBrands( $scope.searchText, serverResponse);
    }
    
    function serverResponse(data){
      $scope.inSearch = false;
      if( !data || !data.count ){
        return;
      }      
      
      $scope.brands = data.rows || [];      
      $scope.count  = data.count;      
      $storage.set($scope.timestamp,data);      
    }
    
}]);