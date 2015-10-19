/* global atcCS */   

atcCS.factory('atcServerToken', ['$q', '$rootScope', '$injector',
  function ($q, $rootScope, $injector) {
    var interceptor = {
      request: function(config){
        if( config.params ){
          config.params._format = 'json';
          config.responseType   = 'json';
        }
        if( $rootScope.user.isLogin ){
          config.headers.Authorization = 'Bearer ' + $rootScope.user.accessToken;
        }
        return config;
      },
      response: function (response){
        var accessToken = response && response.data && response.data["access-token"] || null;

        if( accessToken ){
          $rootScope.user.accessToken = accessToken;
          $rootScope.user.isLogin = true;
        }

        return response;
      },
      responseError: function(response){
        if( response.status === 401){
          $rootScope.user.accessToken = null;
          $rootScope.user.isLogin = false;
        }
      }
        
    };

    return interceptor;

}]);

