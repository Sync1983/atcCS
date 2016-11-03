/* global atcCS */

/*
 * Сервис для обслуживания модели уведомлений
 */
function Notification($rootScope){
  'use strict';

  var model = {
    body: undefined,
    list: []
  };
  
  function clickItem(item){
    return function(event){
      for(var i in model.list){
        var cmp = model.list[i];
        if( cmp === item ){
          cmp.body.remove();
          delete model.list[i];          
        }
      }
    };
  }
  
  
  function init(){
    model.body = $('div.notifications');
  }
  
  function update(){
    var body    = $('<div class="notification-item"></div>');
    var header  = $('<div class="header"></div>');    
    var title   = $('<div class="header-title"></div>');    
    
    for(var i in model.list){
      var item = model.list[i];
      
      if( !item.body ){
        header.text(item.head);
        header.attr('title',item.text);
        title.text(item.text);
        body.append(header);      
        body.append(title);      
        
        body.addClass(item.style);
        
        model.body.prepend(body);
        item.body = body;
        item.body.click(clickItem(item));
        item.timer = window.setTimeout(function(){
          var self = item;
          var index = model.list.indexOf(self);
          angular.element(self.body).addClass('remove');
          window.setTimeout(function(){
            angular.element(self.body).remove();          
            if( index > -1 ){
              model.list.splice(index, 1);
            }  
          },500);
          
        },5000);
      }
    }
  }

  model.addObj = function(obj){
    model.list.push(obj);
    update();
  };

  model.addItem = function(head,text,style_id){
    var style = "btn-info";
    
    switch(style_id){
      case 1:
        style = "btn-danger";
        break;
    };
    
    model.list.push({head:head,text:text,style:style, new:1, view:0});
    
    update();
  };
  
  model.error = function(head,text){
    model.addItem(head,text,1);
  };
  
  model.info = function(head,text){
    model.addItem(head,text,0);
  };
  
  init();
  return model;

};


atcCS.service('$notify',['$rootScope',
  function($rootScope){
    return Notification($rootScope);
  }
]);