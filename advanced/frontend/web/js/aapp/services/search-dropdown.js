/* global atcCS */

/*
 * Сервис для обслуживания выпадающего меню поиска
 */

function searchDropdown($rootScope,$user,$wndMng){
  'use strict';
  var model = {    
    parent: null,
  };
  
  model.setParent   = function setParent(parent){
    model.parent = parent;
  };
    
  model.requestList = function request(articulText){
    var text = String(articulText);
    var clearText = text.replace(new RegExp("\W*", "ig"),"");
    console.log(clearText);
  };

  return model;
};

atcCS.service('$searchDropdown',['$rootScope','User', 
  function($rootScope,$user){
    return searchDropdown($rootScope,$user);
  }
]);