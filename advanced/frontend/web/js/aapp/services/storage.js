/* global atcCS */

function storage($rootScope){
  'use strict';
  var model = {
    storage: {}
  };
  
  function clearLocalStorage(){
    if( !isLocalStorageAvailable() ){
      return;
    }
    
    var time = Math.round( (new Date()).getTime() / 1000);
    
    for (var i  in localStorage){       
      if( i === String(i*1) && ((time-i*1) > 60*60*30) ){
        localStorage.removeItem(i);
        continue;
      }
      if( String(i).indexOf('@') !== -1 ){
        var keyTime = String(i).substr(0,i.indexOf('@')) * 1;        
        if( (time-keyTime) > 60*60*30 ) {
          localStorage.removeItem(i);
        }        
      }       
    }
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
