/* global atcCS */

atcCS.controller( 'brandsSearch', [
    '$scope','$filter', 'User' ,'$routeParams',
    function($scope,$filter,$user,$routeParams ) {
    'use strict';    
    $scope.searchText = $routeParams.searchText || false;
    
    console.log("Load");
    console.log($scope);
    console.log($routeParams);
    if( $scope.searchText ){
      $user.getBrands( $scope.searchText, serverResponse);
    }
    
    function serverResponse(data){
      console.log(data);
    }
    
}]);