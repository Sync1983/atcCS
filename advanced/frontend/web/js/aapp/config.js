
atcCS.config(['$httpProvider', function ($httpProvider) {
    'use strict';
    
    $httpProvider.defaults.headers.common = {'Accept'                     : "application/json, text/plain"};
    $httpProvider.defaults.headers.common = {'Access-Control-Allow-Origin': 'http://rest.atc58.bit'};
    $httpProvider.defaults.headers.common = {'Content-Type'               : "application/json;charset=utf-8"};
    $httpProvider.defaults.useXDomain = true;    
    $httpProvider.interceptors.push('atcServerToken');
 }]);