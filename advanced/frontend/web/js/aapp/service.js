/* global atcCS */

'use strict';
/*
 * Сервис для обслуживания модели пользователя и общения с сервером
 */
atcCS.service('User',['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope){
  var URL   = "http://rest.atc58.bit/index.php";
  var model = new userModel();


  function URLto(controller,funct,local){
    return (local?"":URL) + "?r=" + controller + "/" + funct;
  }

  function loadFormCookies(){
    var name = $cookies.get('name');
    var pass = $cookies.get('pass');

    console.log("Login from Cookies");

    if ( name && pass ){
      model.login(name,pass,true).then(function(){
        model.update();
      });
      return true;
    }
    
    return false;
  };

  model.addAlert = function addAlert(head,text){
    model.alerts.push({head:head,text:text});
  };

  model.login = function login(name,password,remember){
    var req = {
      method: 'GET',
      url: URLto('login','login'),
      responseType: 'json',      
      headers: {        
        'Authorization': "Basic " + btoa(name + ":" + password)
      },
      params: {        
        params: 'get-token' + (remember?'-hash':'')
      }
    };
    
    return $http(req).then(
      function success(response){        
        var hash        = response.data['hash'] || null;

        // Если вернулся хэш, значит запомним для следующей авторизации
        if( hash ){
          var now     = new Date();
          var expires = new Date( now.getTime() + 30*24*3600 );
          
          $cookies.put('name',name,{expires:expires});
          $cookies.put('pass',hash,{expires:expires});
        }
        
      },
      function error(response){
        model.addAlert("Ошибка","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля.")
    });
    
  };

  model.update = function update(){    
    var req = {
      method: 'GET',
      url: URLto('login','get-data'),      
      params: {        
        params: 'get-data'
      }
    };

    if( model.isLogin === false ){
      return false;
    }

    console.log("User data update");
    return $http(req).then(function succes(response){
      
      }, function error(response){
      
      });
    
  };

  $rootScope.user = model;
  loadFormCookies();      //Пробуем войти через информацию в cookie
  
  return model;

}]);