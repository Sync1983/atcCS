/* global atcCS */ 

atcCS.controller( 'main-screen',['$scope','User','$templateCache', function($scope,$user,$templateCache) {
    'use strict';
    
    $scope.searchText = "text1";

    $scope.onMenuLoad = function(){
      console.log("menu load");
      $scope.searchText = "text1";
    };
    
    $scope.onSearch = function(){
      console.log("search load");
    };
    
    
   
    
}]);