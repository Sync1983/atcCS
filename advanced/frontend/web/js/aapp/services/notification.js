/* global atcCS */

/*
 * Сервис для обслуживания модели уведомлений
 */
atcCS.service('Notification',['$rootScope', function($rootScope){
  'use strict';

  var model = {};

  model.list = [];

  model.addObj = function(obj){
    model.list.push(obj);
  };

  model.addItem = function(head,text,style_id){
    if( !style_id ){
      style = "btn-info";
    }
    if( style_id === 1){
      style = "btn-danger";
    }
    model.list.push({head:head,text:text,style:style, new:1});
  };

  return model;

}]);