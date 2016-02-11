/* global atcCS */

/*
 * Сервис для обслуживания выпадающего меню поиска
 */

function searchDropdown($rootScope,$user,$templateCache,$compile){
  'use strict';
  var model = {    
    parent: null,
    body: null,
    showBody: null
  };
  
  function init(){
    model.body = $('<div></div>');
    model.body.addClass('dropdown-helper');    
    
    $(model.body).click(function(event){
      event.stopPropagation();
    });
    
    $rootScope.$on('onBgClick',function(even,data){      
      if( model.showBody){
        model.hide();        
      }
    });    
  }
  
  model.setParent   = function setParent(parent){
    if( model.parent && $(model.parent).parent() ){
      $(model.parent).remove('div.dropdown-helper');      
    }
    
    model.parent = $(parent);
    $(model.parent).append(model.body);    
  };
  
  model.setTemplate = function setTemplate(templateUrl, scope){
    var template = $templateCache.get(templateUrl);
    var compileTemplate = template;
    if( scope ){
      var linkFn = $compile(template);
      compileTemplate = linkFn(scope);
    }
    $(model.body).html(compileTemplate);
  };
  
  model.show  = function show(){
    if( model.showBody ){
      return;
    }
    var x     = $(model.parent).position().left;
    var y     = $(model.parent).position().top;
    var width = $(model.parent).width();
    var height= $(model.parent).height();
    
    model.body.width(width-12); 
    model.body.position('left',x-2);
    model.body.position('top',y+height);
    
    $(model.body).fadeIn(300);
    model.showBody = true;
  };
  
  model.hide = function hide(){
    if( !model.showBody ){
      return;
    }
    
    $(model.body).fadeOut(100);
    
    model.showBody = false;
  };
  
  model.toggle = function toggle(event){
    event.stopPropagation();
    if( model.showBody ){
      model.hide();
      return;
    }
    model.show();
  };
    
  model.requestList = function request(articulText){
    var text = String(articulText);
    var clearText = text.replace(new RegExp("\W*", "ig"),"");
    console.log(clearText);
  };
  
  init();
  return model;
};

atcCS.service('$searchDropdown',['$rootScope','User', '$templateCache', '$compile', 
  function($rootScope,$user,$templateCache, $compile){
    return searchDropdown($rootScope,$user,$templateCache,$compile);
  }
]);