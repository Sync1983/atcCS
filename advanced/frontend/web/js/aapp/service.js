/* global atcCS */

'use strict';
/*
 * Сервис для обслуживания модели пользователя и общения с сервером
 */
atcCS.service('User',['$http', '$cookies',function($http, $cookies){
  var URL   = "http://rest.atc58.bit/index.php";
  var model = new userModel();

  function URLto(controller,funct,local){
    return (local?"":URL) + "?r=" + controller + "/" + funct;
  }

  function loadFormCookies(){
    var name = $cookies.get('name');
    var pass = $cookies.get('pass');
    if ( name && pass ){
      model.login(name,pass,true);
    }
  };

  model.login = function login(name,password,remember){
    var addres = URLto('login','login');    
    
    console.log($http.defaults);
    $http.defaults.headers.get = {'Authorization': 'Basic ' + btoa('admin' + ':' + 'test'),
                                  'Param1': 'Basic ' + btoa('admin' + ':' + 'test')};
    //$http.defaults.headers.get['Param1'] = 'Basic ' + btoa('admin' + ':' + 'test');

    var req = {
      method: 'GET',
      url: addres,
      responseType: 'json',
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': 'http://rest.atc58.bit',
        'Authorization': "Basic " + btoa('admin' + ":" + 'test'),
        'Accept': 'application/json;odata=verbose'
      },
      params: {
        _format:'json',
        params: 'get-token' + (remember?'-hash':'')
      },
      data:{
        'Authorization': "Basic " + btoa('admin' + ":" + 'test')
      }
    };
    
    $http(req).then(
      function success(response){
        console.log("ok ", response);
      },
      function error(response){
        console.log("err ", response);
    });
    
    console.log('name',name);
    console.log('pass',password);
    console.log('pass',remember);
  };


  loadFormCookies();      //Пробуем войти через информацию в cookie
  
  return model;

}]);