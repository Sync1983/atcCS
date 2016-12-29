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
      var itemTime = parseInt(i);
      if( isNaN(itemTime) ){
        continue;
      }
      
      if( (time-itemTime) > 60*60*12 ) {
        localStorage.removeItem(i);      
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
    if( (typeof value === 'object') ||
        (typeof value === 'array') ){
      value = angular.toJson(value);
    }    
    if ( isLocalStorageAvailable() ){
      try{
        localStorage.setItem(name,value);        
      } catch(e){
        if( (e.code === 22) || (e.code === 1014) ){
          localStorage.clear(); 
          localStorage.setItem(name,value);
        }
      }
    } else {
      model.storage[name] = value;
    }
    return;
  };
  
  model.get = function get(name){
    var result = null;
    var firstSymbol = null;
    if ( model.storage[name] ){
      result = model.storage[name];
    } else if( isLocalStorageAvailable() ) {
      result = localStorage.getItem(name);
    }
    firstSymbol = String(result).substr(0,1);
    if ( (firstSymbol === '{') || (firstSymbol === '[') ){      
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
