/* global atcCS */

function confirm($rootScope,$wndMng,$q){
  'use strict';
  var model = {
    promise: null,
    cover: null,
    wnd:null,
    scope:null,
    defaultButtons:[
        {name:"ДА",  style: "btn-default", status: 1  },
        {name:"НЕТ", style: "btn-danger", status: 0 }
    ]
  };
  
  function close(){
    model.cover.hide();
    $wndMng.hide(model.wnd);    
  }
  
  function onEscape(event){
    if( !event || !event.keyCode || !(event.keyCode === 27) ){
      return true;
    }
    if( $(model.cover).is(':visible') ){
      close();
      if( model.promise ){
        model.promise.reject(-1);        
      }
    }
    return false;
  }
  
  function onSelect(status){
    close();
    if( !status ){
      model.promise.reject(status);
      return;
    }
    model.promise.resolve(status);
  };
  
  function init(){
    var cover = $("<div class=\"cover\"></div>");
    var wnd   = "<div class=\"confirm-container\"> <span class=\"confirm-text\">{{text}}</span> </div>";
    var status= "<div class=\"status-buttons\"><ul><li ng-repeat=\"btn in buttons\"><button class=\"btn\" ng-class=\" btn.style\" ng-click=\"onSelect(btn.status);\">{{btn.name}}</button></li></ul></div>";
    $('body').append(cover);    
    model.cover = cover;    
    model.scope = $rootScope.$new();
    
    model.wnd = $wndMng.createWindow({
        title: "Подтвердите действие",        
        hSize: '40%',
        vSize: '20%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    false,
        showMin:      false,
        modal:        true,
        show:         false
      });
    
    $wndMng.setBody(model.wnd, wnd, model.scope);
    $wndMng.setStatusBar(model.wnd, status, model.scope);    
    $wndMng.setStyle(model.wnd,{
      'z-index':'10020'      
    });
    
    $('body').keyup(onEscape);
    model.scope.onSelect = onSelect;
  }
  
  model.request = function request(text,buttons){        
    model.scope.buttons = buttons || model.defaultButtons;    
    model.scope.text = text;
    
    model.cover.show();
    $wndMng.show(model.wnd);
    model.promise = $q.defer();
    
    return model.promise.promise;
  };
  
  init();
  return model;
};

atcCS.service('$confirm',[
  '$rootScope', '$wndMng','$q',
  function($rootScope,$wndMng,$q){
    return confirm($rootScope,$wndMng,$q);
}]);
