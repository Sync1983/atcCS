/* global atcCS */

'use strict';

atcCS.controller( 'searchControl', 
                  ['$scope','$filter', 'User',
  function($scope,$filter,$user) {

    $scope.markup = null;
    
    $scope.analogShow = false;

    console.log($scope.user);
    
    
    $scope.selected = '';    
    $scope.items = [
            'CodePen',
            'Dribbble',
            'AppSumo',
            'GitHub'
    ];
    $scope.state = closed;
  
    $scope.change = function () {
      var filtered;
      filtered = $filter('filter')($scope.items, $scope.query);
      //return $scope.state = filtered.length > 0 ? opened : 'closed';
    };
  
    $scope.select = function (item) {
      $scope.selected = item;
      return $scope.state = closed;
    };
  
    
    /*$scope.refreshAddresses = function(address) {
      var params = {address: address, sensor: false};
      return $http.get(
        'http://maps.googleapis.com/maps/api/geocode/json',
        {params: params}
      ).then(function(response) {
        $scope.addresses = response.data.results
      });
    };*/  
}]);

atcCS.controller( 'headControl',['$scope', function($scope) {    
    $scope.loginShow  = true;
    $scope.login      = {
      name: null,
      password: null,
      remember: false
    };

    $scope.onLogin = function(){      
      $scope.user.login('admin','test',true);
      //$user.login($scope.login.name,$scope.login.password,$scope.login.remember);
      $scope.loginShow = false;      
    };

    $scope.showLogin = function(){      
      $scope.loginShow = ! $scope.loginShow;
    };
    
}]);