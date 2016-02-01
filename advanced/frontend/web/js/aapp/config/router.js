/* global atcCS */

atcCS.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider      
      .when('/brands/:searchText', {
        caseInsensitiveMatch: true,
        templateUrl: '/search-brands.html',
        controller: 'brandsSearch',
        controllerAs: 'atcCS' 
      });

    $locationProvider.html5Mode(true);
}]);
