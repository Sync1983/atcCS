/* global atcCS */

atcCS.controller( 'brandsSearch', [
    '$scope','$filter', 'User' ,'$routeParams',
    function($scope,$filter,$user,$routeParams ) {
    'use strict';    
    $scope.searchText = $routeParams.searchText || false;
    
    if( $scope.searchText ){
      $scope.inSearch = true;
      $user.getBrands( $scope.searchText, serverResponse);
    }
    
    function serverResponse(data){
      $scope.inSearch = false;
      console.log(data);
    }
    
}]);