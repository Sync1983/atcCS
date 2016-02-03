/* global atcCS */

function storage($rootScope){
  'use strict';
  var model = {
    storage: {}
  };
  
  function clearLocalStorage(){
    
  };
  
  function isLocalStorageAvailable() {
    try {      
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  model.set = function set(name,value){
    if( typeof value === 'object' ){
      value = angular.toJson(value);
    }
    if ( isLocalStorageAvailable() ){
      localStorage.setItem(name,value);
    } else {
      model.storage[name] = value;
    }
    return;
  };
  
  model.get = function get(name){
    var result = null;
    if ( model.storage[name] ){
      result = model.storage[name];
    } else if( isLocalStorageAvailable() ) {
      result = localStorage.getItem(name);
    }
    if ( String(result).substr(0,1) === '{' ){
      result = angular.fromJson(result);
    }
    return result;
  };
  
  clearLocalStorage();

  return model;
};

atcCS.service('storage',[
  '$rootScope', 
  function($rootScope){
    return storage($rootScope);
}]);
