/* global ObjectHelper */

var ObjectHelper = {};

ObjectHelper.count = function(obj){
  var count = 0;  
  for(var prop in obj) {
    if( obj.hasOwnProperty(prop) )
      count++;
  }
  return count;  
};

ObjectHelper.spliceFields= function(obj,length){
  var count = 0;  
  for(var prop in obj) {    
    if( obj.hasOwnProperty(prop) )
      count++;
    if( count >= length){
      console.log(prop);
      delete obj[prop];
    }
  }
  return count;  
};

ObjectHelper.addUniq = function(array,value){
  var index = -1;
  index = array.indexOf(value);
  while( index > -1 ){
    delete array.splice(index,1);
    index = array.indexOf(value);
  }  
  array.unshift(value);
};

ObjectHelper.concat = function (a,b){
  a.push.apply(a, b);
  return a;
};

ObjectHelper.merge = function (a,b){
  var result = new Object();
  if( !a ){
    a = {};
  }
  if( !b ){
    b = {};
  }
  
  for(var keyA in a){
    result[keyA] = a[keyA];
  }
  
  for(var keyB in b){
    if( result.hasOwnProperty(keyB) ){
      result[keyB] = ObjectHelper.concat(result[keyB],b[keyB]);
    } else{
      result[keyB] = b[keyB];      
    }
  }  
  
  return result;
};

ObjectHelper.URLto = function(controller,funct,local){
  var URL   = serverURL + "/index.php";
  return (local?"":URL) + "?r=" + controller + "/" + funct;  
};

ObjectHelper.createRequest = function(controller, funct, params,isPost){
  var req = {
      method: (isPost?'POST':'GET'),
      url: ObjectHelper.URLto(controller,funct),
      responseType: 'json',
      params: params
    };
  return req;
};


var eventsNames = new eventsNamesList();
var atcCS = angular.module('atcCS',['ngCookies','ngRoute', 'ngTable','uiSwitch']);
