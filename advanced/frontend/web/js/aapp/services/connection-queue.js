/* global atcCS */



var cqEvents = {
  login         : "CQEVENT_LOGIN",
  userData      : "CQEVENT_USER_DATA",
  articulInfo   : "CQEVENT_ARTICUL_INFO",
  findTypeDescr : "CQEVENT_FIND_TYPE_DESCR",
  typingHelper  : "CQEVENT_TYPING_HELPER",
  getBrands     : "CQEVENT_GET_BRANDS",  
  getParts      : "CQEVENT_GET_PARTS",  
  toBasket      : "CQEVENT_TO_BASKET"
};

function cqmEvent(name){
  if( (!name) || !( name instanceof String) ){
    throw new Error("Значение name для события должно быть установлено и быть строкой");
  }
  
  this.name         = name;
  this.url          = null;
  this.method       = null;
  this.responseType = "json";
  this.headers      = null
  this.require      = null
  this.wait         = false;
  this.multiple     = false;
  this.params       = null
  this.data         = null;
  this.promises     = null;
}


/*
 * Сервис для обслуживания модели очереди запросов
 */

function connectionQueueModel($rootScope,$user,$wndMng){
  'use strict';
  var model = {
    Queue       : new Object(),
    Finished    : new Object(),
    After       : new OBject(),
    Registered  : new Array()
  };
  
  model.createEvent = function(name, multiple){
    var event       = new cqmEvent(name);
    event.multiple  = multiple;    
  };
  /**
   * Заполняет структуру события данными
   * @param cqmEvent  event  Объект события
   * @param Object    data   Поля данных
   * @param boolean   append Копировать отсутствующие в структуре события поля
   * @returns {undefined}
   */
  model.fillEvent   = function(event,data,append){
    if( !(data instanceof Object) ){
      throw new Error("Параметр data должне быть объектом значений");
    }
    for(var id in data){
      var value = data[id];
      if( event.hasOwnProperty(id) || append ){
        event.id = value;
      }
    }
  };
  /**
   * Проверяет наличи события в стеке регистрации
   * @param cqmEvent event
   * @returns boolean
   */  
  model.hasEvent      = function( event ){
    var find = false;
    model.Registered.every(function(item){
      if( event.name === item.name ){
        find = true;
        return false;
      }
      return true;
    });
    return find;
  };
  /**
   * Регистрация события в стеке
   * @param cqmEvent event
   * @returns boolean
   * @throws Error Ошибка повторного внесения в список уникального события
   */  
  model.registerEvent = function(event){
    if( !event.multiple || model.hasEvent(event) ){
      throw new Error('Регистрация уже зарегистрированного события');
    }
    model.Registered.push(event);
  };
  
  model.sendRequest = function(name, params, data, fields){
    
  };
  

  return model;
};

atcCS.service('$connectionQueue',['$rootScope',
  function($rootScope){
    return connectionQueueModel($rootScope);
  }
]);