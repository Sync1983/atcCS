'use strict';

atcCS.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common = {Accept: "application/json, text/plain, */*"};
    $httpProvider.defaults.headers.common = {'Access-Control-Allow-Origin': '*'};
    $httpProvider.defaults.headers.common = {"Content-Type": "application/json;charset=utf-8"};

    $httpProvider.defaults.useXDomain = true;    
 }]);