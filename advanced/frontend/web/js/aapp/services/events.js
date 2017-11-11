/* global atcCS, eventsName */

function event($name){
  
  var name;  
  var listners = [];
  var self = this;
  
  function init(){
    name  = $name;    
    listners = [];
  };
  
  this.broadcast = function broadcast(eventName, args){
    //console.log("Broadcast event scope '" + name +"'["+ eventName+"]");
    
    var list = listners[eventName] || [];
    
    for(var i in list){
      //console.log("Listen event scope '" + name + "'["+eventName + "]");
      list[i](eventName,args);
    }
    
  };
  
  this.setListner = function setListner(eventName, callback){    
    
    if( listners.indexOf(eventName) === -1 ){
      listners[eventName] = [];
    }
    
    if ( (listners[eventName].indexOf(callback) !== -1 ) || 
        !(callback instanceof Function) ){
      return;
    };
    
    listners[eventName].push(callback);    
  };
  
  init();  
  return this;
};

function events($rootScope){
  'use strict';
  var events = [];
  
  function init(){        
    events = [];
  }
  
  this.get = function get(name){    
    if ( !(name in  events) ){
      events[name] = new event(name);
    }    
    
    return events[name];
  };  
  
  init();
  return this;
};

atcCS.service('$events',[
  '$rootScope', '$q',
  function($rootScope,$q){
    return new events($rootScope,$q);
}]);

function eventsNamesList(){
  this.eventsUser = function(){
    return 'eventUserScope';
  };
  
  this.eventsCatalog = function(){
    return 'eventCatalogScope';
  };
  
  this.eventsSearch= function(){
    return 'eventSearchScope';
  };
  
  this.eventsNews= function(){
    return 'eventNewsScope';
  };
};