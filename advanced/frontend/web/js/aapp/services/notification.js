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
    var header  = $('<span class="header"></span>');    
    
    for(var i in model.list){
      var item = model.list[i];
      
      if( !item.body ){
        header.text(item.head);
        header.attr('title',item.text);
        body.append(header);      
        
        body.addClass(item.style);
        
        model.body.prepend(body);
        item.body = body;
        item.body.click(clickItem(item));
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
  
  init();
  return model;

};


atcCS.service('$notify',['$rootScope',
  function($rootScope){
    return Notification($rootScope);
  }
]);