/* global atcCS */

'use strict';
/*
 * Сервис для обслуживания модели пользователя и общения с сервером
 */
atcCS.service('User',['$http',function($http){
  var URL   = "rest.atc58.bit/index.php";
  var model = new userModel();

  function URLto(controller,funct,local){
    return (local?"":URL) + "?r=" + controller + "/" + funct;
  }

  model.login = function login(name,password){
    var addres = URLto('user','login');
    console.log('name',name);
    console.log('pass',password);
  };

  return model;

}]);