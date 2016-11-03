/* global atcCS */

atcCS.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider      
      .when('/brands/:searchText/:timestamp?', {
        caseInsensitiveMatch: true,
        templateUrl: '/search-brands.html',
        controller: 'brandsSearch',
        controllerAs: 'atcCS' 
      }).when('/parts/:searchText/:timestamp/:brand', {
        caseInsensitiveMatch: true,
        templateUrl: '/parts-list.html',
        controller: 'partsSearch',
        controllerAs: 'atcCS' 
      }).when('/basket', {
        caseInsensitiveMatch: true,
        templateUrl: '/basket.html',
        controller: 'basketControl',
        controllerAs: 'atcCS' 
      }).when('/orders', {
        caseInsensitiveMatch: true,
        templateUrl: '/orders.html',
        controller: 'ordersControl',
        controllerAs: 'atcCS' 
      }).when('/catalog', {
        caseInsensitiveMatch: true,
        templateUrl: '/catalog.html',
        controller: 'catalogControl',
        controllerAs: 'atcCS' 
      });

    $locationProvider.html5Mode(true);
}]);
