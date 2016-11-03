/* global atcCS */

function event($name,$rootScope){
  
  var model = {
    name:$name,
    scope: $rootScope.$new(true)
  };
  
  function init(){
    
  };
  
  model.broadcast = function broadcast(name, args){
    console.log("Broadcast event scope '" + $name +"'["+name+"]");
    model.scope.$broadcast(name, args);
  };
  
  model.setListner = function setListner(eventName, callback){
    console.log("Register event scope '" + $name + "'["+eventName + "]");
    model.scope.$on(eventName, function(event,args){
      console.log("Listen event scope '" + $name + "'["+eventName + "]");
      if( callback instanceof Function ){
        callback(event,args);
      }
    });    
  };
  
  init();  
  return model;
};

function events($rootScope,$q){
  'use strict';
  var model = {
    events:[]
  };  
  
  function init(){        
  }
  
  model.get = function get(name){    
    if ( !model.events[name] ){
      model.events[name] = new event(name, $rootScope);
    }    
    
    return model.events[name];
  };  
  
  init();
  return model;
};

atcCS.service('$events',[
  '$rootScope', '$q',
  function($rootScope,$q){
    return events($rootScope,$q);
}]);
