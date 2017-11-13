/* global atcCS */ 

atcCS.controller( 'main-screen',['$scope','User','$templateCache','$menu', function($scope,$user,$templateCache,$menu) {
    'use strict';
    
    $scope.searchText = "text1";

    $scope.onMenuLoad = function(){
      console.log("menu load");
      $scope.searchText = "text1";
      $menu.show();
    };
    
    $scope.onSearch = function(){
      console.log("search load");
    };
    
    
   
    
}]);