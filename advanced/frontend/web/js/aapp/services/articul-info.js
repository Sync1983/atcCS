/* global atcCS */

/*
 * Сервис для обслуживания модели уведомлений
 */

function articulInfoModel($scope,$user,$wndMng){
  'use strict';
  
  model.length = function length(){
    return this.tags.length;
  };

  return model;
};

atcCS.service('articulInfo',['$scope','User','$wndMng', function($scope,$user,$wndMng){
  return articulInfoModel($scope,$user,$wndMng);
}] );