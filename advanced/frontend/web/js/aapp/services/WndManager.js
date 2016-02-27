/* global atcCS */

/**
 * @syntax wndStruc(callbackFunction)
 * @param {Object} callbackFunction
 * @returns {Object}
 */
function wndStruc(callbackFunction){
  'use strict'; 
  var model = {
    _id:            0,
    _manager:       null,
    _wnd_data:      {},
    title:          "",
    body:           null,
    hPos:           300,
    vPos:           200,
    hSize:          600,
    vSize:          200,
    vAlign:         "none",
    hAlign:         "none",
    showClose:      true,
    showMin:        true,
    showStatusBar:  true,
    canMove:        true,
    canResize:      true,
    show:           true,
    hideIfClose:    false,
    modal:          false,
    setId:  function(id){
              if( this._id === 0 ){
                this._id = id;
                return id;
              }
              throw new Error("Попытка изменить ID существующего окна");
            },
    getId:   function(){
              return this._id;
            }
  };
  var struct = new Object();

  if( (callbackFunction === undefined) ||
      !(callbackFunction instanceof Function) ){
        throw new Error("Создание дескриптора без оконной функции");
  }

  // Геттер-сеттер оборачиваем в функции для создания локальной переменной name
  function createGetter(name){
    return function getter(){
        return this['_' + name];
      };
  }

  function createSetter(name,struct){
    return function setter(newVal){
        var oldVal = this['_' + name];
        this['_' + name] = newVal;
        callbackFunction(struct, name, newVal, oldVal);
        return newVal;
      };
  }

  for(var name in model){
    var value         = model[name];

    if( (String(name).substr(0,1) === "_") ||
        (value instanceof Function) ){
          Object.defineProperty(struct,name,{
            enumerable: (value instanceof Function)?true:false,
            writable: true,
            value: value
          });
          continue;
    }
    
    Object.defineProperty(struct,'_' + name,{
      enumerable: false,
      writable: true,
      value: value
    });

    Object.defineProperty(struct,name,{
      get: createGetter(name),
      set: createSetter(name, struct)
    });    
  }

  return struct;
};

function wndManagerClass($templateCache, $compile, $scope){
  'use strict';
  var $this = this;
  var model = {
    _idCnt: 0,
    _stack: [],
    _inTray: [],
    area: "body",
    tray: "div.tray-bar"
  };
  
  function init(){    
  };

  function initDrag(wnd, area, header, resize){
    $(area).on({
      "mouseup"   : function(event){
                      delete(wnd._wnd_data.drag);
                      delete(wnd._wnd_data.resize);
                    },
      "mousemove" : function (event){        
                      if( ( event.buttons === 1 ) &&
                          ( wnd._wnd_data.drag  ) &&
                          ( wnd.canMove         ) &&
                          ( !wnd._wnd_data._minimize ) ){
                            
                            var dx = event.pageX - wnd._wnd_data.drag.posX;
                            var dy = event.pageY - wnd._wnd_data.drag.posY;

                            wnd._wnd_data.drag = {
                              posX: event.pageX,
                              posY: event.pageY
                            };

                            wnd.hPos += dx;
                            wnd.vPos += dy;
                            
                            event.stopPropagation();
                            return false;
                      }
                      if( ( event.buttons === 1 ) &&
                          ( wnd._wnd_data.resize) &&
                          ( wnd.canResize       ) &&
                          ( !wnd._wnd_data._minimize ) ){

                            var dx = event.pageX - wnd._wnd_data.resize.posX;
                            var dy = event.pageY - wnd._wnd_data.resize.posY;
                            
                            if( wnd.hAlign == 'right'){
                              dx = -dx;
                            }
                            
                            wnd._wnd_data.resize = {
                              posX: event.pageX,
                              posY: event.pageY
                            };

                            wnd.hSize += dx;
                            wnd.vSize += dy;                            

                            event.stopPropagation();
                            return false;
                      }

                      return true;
                    }
      });

      $(header).on({
        "mousedown" : function(event){
                        wnd._wnd_data.drag = {
                          posX: event.pageX,
                          posY: event.pageY
                        };
                      },
        "dblclick"  : function(event){
                        if( !wnd._wnd_data._minimize ){
                          return true;
                        }
                        popFromTray(wnd, wnd._manager);
                      }
      });

      $(resize).on({
        "mousedown" : function(event){
                        wnd._wnd_data.resize = {
                          posX: event.pageX,
                          posY: event.pageY
                        };
                      }
      });
    }

  function getTopOfTray($this){
    var items = $this._inTray;
    var height = $($this.tray).height() + $($this.tray).position().top;

    for(var i in items){
      var body = items[i].body;
      height -= $(body).height();
    }
    
    return height;
  }

  function trayRefresh($this){
    var items = $this._inTray;
    var height = $($this.tray).height() + $($this.tray).position().top;

    for(var i in items){
      var bodyHeight = $(items[i].body).height();
      height -= bodyHeight;
      items[i].body.animate({
        top: height
      },300);
    }
  }

  function pushToTray(wnd, $this){
    var body    = wnd.body;
    var header  = $(body).find("div.header");
    var sysicons= $(body).find("div.sysicons");
    var tray    = $($this.tray);
    var left    = $(tray).position().left;
    var bottom  = getTopOfTray(wnd._manager);

    $(body).children().not('div.header').not(sysicons).fadeOut(200);
    $(body).animate({
      height  : $(header).height() + 6,
      width   : $(tray).width(),
      left    : left,
      top     : bottom - $(header).height() - 6
    },300);

    wnd._wnd_data._minimize = true;
    $this._inTray[wnd.getId()] = wnd;
  }

  function popFromTray(wnd, $this){
    $this._inTray[wnd.getId()] = null;
    delete $this._inTray[wnd.getId()];
    delete wnd._wnd_data._minimize;
    $(wnd.body).children().fadeIn(200);
    $this.updateWindow(wnd);
    trayRefresh($this);
  }

  function trayToggle(wnd, $this){
    return function(event){
      if( !wnd._wnd_data._minimize ){
          pushToTray(wnd, $this);
          return;
      }
      popFromTray(wnd, $this);
    };
  }

  function closeWindow(wnd, $this){
    return function(event){
      wnd.show = false;
      if( wnd.hideIfClose ){
        return ;
      }
      
      $this._stack[wnd.getId()] = null;
      $this._inTray[wnd.getId()] = null;
      delete $this._stack[wnd.getId()];
      delete $this._inTray[wnd.getId()];
      wnd = null;
      
      trayRefresh($this);
    };
  }

  function uTitle(text, body){
    $(body).find('div.header').text(text);
  }

  function convertPercentToSize(value,areaValue){    
    if( typeof  value === "string" ){
      var stopPos = value.indexOf('%');
      if( stopPos < 2){
        throw new Error("Неверный формат данных");
      }
      var subStr  = value.substr(0,stopPos);
      var percent = subStr * 1;
      var newValue= Math.round(areaValue * percent / 100);
      
      return newValue;
    }
    return value;
  }

  function uHPos(align, wnd, body, area){
    var left  = 0;
    var width = 0;

    wnd._hPos   = convertPercentToSize(wnd._hPos,  $(area).width() );
    wnd._hSize  = convertPercentToSize(wnd._hSize, $(area).width() );
    
    switch( align.toLowerCase() ){
      case 'left':
        left  = wnd._hPos;
        break;
      case 'right':
        var resize  = $(body).find("div.resize");
        resize.addClass('left-angle');
        left  = wnd._hPos -  wnd.hSize - 5;
        break;
      case 'center':
        left  = (area.width() - wnd.hSize) / 2;
        break;
      default :
        left  = wnd.hPos;
    }
    
    width = wnd.hSize;

    $(body).css({left: left,width: width});
  }

  function uVPos(align, wnd, body, area){
    var top     = 0;
    var height  = 0;

    wnd._vPos   = convertPercentToSize(wnd._vPos,  $(area).height());
    wnd._vSize  = convertPercentToSize(wnd._vSize, $(area).height());

    switch( align ){
      case 'top':
        top  = wnd._vPos;        
        break;
      case 'bottom':
        top  = wnd._vPos - wnd.vSize;
        top  = (top < 0) ? 0 : top;
        break;
      case 'center':
        top  = (area.height() - wnd.vSize) / 2;
        top  = (top < 0) ? 0 : top;
        break;
      default :
        top  = wnd.vPos;
    }

    height = wnd.vSize;

    $(body).css({top: top,height: height});
  }

  function uVisible(wnd, body){
    var close = body.find('button.destroy');
    var min   = body.find('button.minimize');
    var resize= body.find('div.resize');
    var status= body.find('div.statusbar');
    var content = body.find('div.content');
    
    if( wnd.show !== body.is(':visible') ){
      if( wnd.show ){
        body.fadeIn(200);
        content.fadeIn(200);
      } else {
        body.fadeOut(200);
      }
    }

    
    function changeState(item, key){
      if( key ){
        item.show();
      } else {
        item.hide();
      }
    }
    
    changeState(close, wnd.showClose);
    changeState(min,   wnd.showMin);
    changeState(status,wnd.showStatusBar);
    changeState(resize,wnd.canResize);

    if( wnd.showStatusBar ){
      content.css('bottom','26');
    } else {
      content.css('bottom','0');
    }
  }

  function watchChanges(wnd,paramName,newValue,oldValue){
    
    if( (paramName === 'vPos') && ( (wnd.vAlign === 'top') || (wnd.vAlign === 'bottom')) ){      
      wnd['_' + paramName] = oldValue;
      return ;
    }

    if( (paramName === 'hPos') && ( (wnd.hAlign === 'left') || (wnd.hAlign === 'right')) ){
      wnd['_' + paramName] = oldValue;
      return ;
    }
    
    wnd._manager.updateWindow(wnd);
  };
  
  function toForvard(window){
    return function(){      
      if( window.modal ){
        return;
      }
      var body = window.body;            
      $scope.$broadcast('toBack',{});
      $(body).css('z-index',1001);      
    };
  };
  
  function toBack(window){
    return function(even,data){      
      if( window.modal ){
        return;
      }      
      var body = window.body;      
      $(body).css('z-index',1000);
    };
  }

  model.initWindow = function initWindow(wnd){
    var body    = wnd.body;
    var header  = $(body).find("div.header");
    var sysicons= $(body).find("div.sysicons");
    var resize  = $(body).find("div.resize");
    var area    = this.area;
    var $this   = this;

    if( !wnd.show ){
      $(body).hide();
    }

    initDrag(wnd, area, header, resize);
    $(sysicons).find("button.minimize").click(trayToggle(wnd, $this));
    $(sysicons).find("button.destroy").click(closeWindow(wnd, $this));
    
    $(body).on('click',toForvard(wnd));
    $scope.$on('toBack',toBack(wnd));
  };

  model.updateWindow = function updateWindow(wnd){
    var body = wnd.body;
    var area = $(this.area);

    uTitle(wnd.title, body);
    uHPos(wnd.hAlign, wnd, body, area);
    uVPos(wnd.vAlign, wnd, body, area);
    uVisible(wnd, body);
  };

  model.createWindow = function createWindow(config){
    var newId         = this._idCnt++;
    var wnd           = new wndStruc(watchChanges);
    var area          = this.area;
    var html          = $templateCache.get('/window.html');

    this._stack[newId]= wnd;

    wnd.setId(newId);
    wnd._manager  = this;

    if( (typeof config === 'object') && (config !== null) ){
      for(var field in config){        
        if( wnd.hasOwnProperty(field) ){    
          wnd['_' + field] = config[field];
        }
      }
    }

    wnd._body     = $(html);
    wnd._body.attr('id','wndMngId' + newId);

    $(area).append(wnd.body);
    this.updateWindow(wnd);
    this.initWindow(wnd);

    return wnd;
  };

  model.getBody = function getBody(wnd){    
    if( !wnd ){
      throw new Error("Запрос тела отсутствующего окна");
      return false;
    }
    
    var content = wnd.body.find('div.content');
    return content;
  };
  
  model.getStatusBar = function getBody(wnd){    
    if( !wnd ){
      throw new Error("Запрос тела отсутствующего окна");
      return false;
    }
    
    var statusBar = wnd.body.find('div.statusbar');
    return statusBar;
  };

  model.setBody = function setBody(wnd, html, scope){
    this.getBody(wnd).html( $compile(html)(scope) );
  };

  model.setBodyByTemplate = function setBodyByTemplate(wnd, template, scope){
    var html = $templateCache.get(template);
    this.getBody(wnd).html( $compile(html)(scope) );    
  };
  
  model.setStatusBar = function setBody(wnd, html, scope){
    this.getStatusBar(wnd).html( $compile(html)(scope) );
  };
  
  model.setStyle  = function setStyle(wnd,style,value){
    if( value ){
      return $(wnd.body).css(style,value);
    }
    
    return $(wnd.body).css(style);
  };

  model.toggle = function toggle(wnd){
    if( wnd._wnd_data._minimize ){
      popFromTray(wnd,this);
      return;
    }
    wnd.show = !wnd.show;
    $scope.$broadcast('visibleChange',{value:wnd.show});
    if( wnd.show ){
      toForvard(wnd)();      
    }
  };
  
  model.show = function show(wnd){
    if( wnd._wnd_data._minimize ){
      popFromTray(wnd,this);
      return;
    }
    wnd.show = true;
    $scope.$broadcast('visibleChange',{value:true});
    toForvard(wnd)();
  };
  
  model.hide = function hide(wnd){
    wnd.show = false;
    $scope.$broadcast('visibleChange',{value:false});
  };
  
  init();
  
  return model;
}

atcCS.service("$wndMng", ["$templateCache",'$compile','$rootScope',
  function($templateCache, $compile, $scope) {
    return wndManagerClass($templateCache, $compile, $scope);
} ] );

