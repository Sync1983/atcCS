/* global atcCS */



var cqEvents = {
  login   : "CQEVENT_LOGIN",
  userData: "CQEVENT_USER_DATA",
  articulInfo : "CQEVENT_ARTICUL_INFO",
  findTypeDescr : "CQEVENT_FIND_TYPE_DESCR",
  typingHelper: "CQEVENT_TYPING_HELPER",
  getBrands: "CQEVENT_GET_BRANDS",  
  getParts: "CQEVENT_GET_PARTS",  
  toBasket: "CQEVENT_TO_BASKET",  
};

/*
 * Сервис для обслуживания модели очереди запросов
 */

function connectionQueueModel($rootScope,$user,$wndMng){
  'use strict';
  var model = {
    Queue:    new Object(),
    Finished: new Object(),
    After:    new OBject()
  }; 
  
  model.sendRequest = function(name, request, after){
    
  };
  

  return model;
};

atcCS.service('$connectionQueue',['$rootScope',
  function($rootScope){
    return connectionQueueModel($rootScope);
  }
]);