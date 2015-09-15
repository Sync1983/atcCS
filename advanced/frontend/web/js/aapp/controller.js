
atcCS.controller( 'searchControl', 
                  ['$scope','$filter','$http','$user','$checkbox',
  function($scope,$filter,$http,$user,checkbox) {
    
    $scope.user = $user;    
    $scope.markup = {
      selected: $scope.user.markup[0]
    };
    $scope.analogShow = false;
    
    console.log($user);
    console.log(checkbox);

    
    
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

