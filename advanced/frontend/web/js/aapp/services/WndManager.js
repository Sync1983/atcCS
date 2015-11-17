/* global atcCS */

/**
 * @syntax wndStruc(callbackFunction)
 * @param {Object} callbackFunction
 * @returns {Object}
 */
function wndStruc(callbackFunction){
  var model = {
    _id:            0,
    _manager:       null,
    title:          "",
    body:           null,
    hPos:           300,
    vPos:           200,
    hSize:          600,
    vSize:          200,
    vAlign:         null,
    hAlign:         null,
    state:          null,
    showClose:      true,
    showMin:        true,
    showStatusBar:  true,
    canMove:        true,
    canResize:      true,
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

atcCS.service("$wndMng", ["$templateCache", function($templateCache){
  'use strict';  
  return {
    _idCnt: 0,
    _stack: [],
    area: "body",
    $this: this,

    initWindow: function(wnd){
      var body = wnd.body;
      var header = $(body).find("div.header");

      function mouseDown(event){

      };

      function mouseMove(event){

      };
      
      $(header).mousedown(mouseDown,wnd);
      $(header).mousemove(mouseMove,wnd);


    },

    updateWindow: function updateWindow(wnd){
      var body = wnd.body;
      var area = $(this.area);
      
      function uTitle(text){        
        $(body).find('div.header').text(text);
      }

      function uHPos(align){
        var left  = 0;
        var width = 0;

        switch( align ){
          case 'left':
            left  = 0;
            break;
          case 'right':
            left  = area.width() - wnd.hSize;
            left  = (left < 0) ? 0 : left;
            break;
          case 'center':
            left  = (area.width() - wnd.hSize) / 2;
            left  = (left < 0) ? 0 : left;
            break;
          default :
            left  = wnd.hPos;        
        }

        width = (wnd.hSize > area.width())? area.width():wnd.hSize;

        $(body).css({left: left,width: width});
      }

      function uVPos(align){
        var top     = 0;
        var height  = 0;

        switch( align ){
          case 'top':
            top  = 0;
            break;
          case 'bottom':
            top  = area.height() - wnd.vSize;
            top  = (top < 0) ? 0 : top;
            break;
          case 'center':
            top  = (area.height() - wnd.vSize) / 2;
            top  = (top < 0) ? 0 : top;
            break;
          default :
            top  = wnd.vPos;
        }

        height = (wnd.vSize > area.height())? area.height():wnd.vSize;

        $(body).css({top: top,height: height});
      }

      uTitle(wnd.title);
      uHPos(wnd.hAlign);
      uVPos(wnd.vAlign);
    },

    watchChanges: function(wnd,paramName,newValue,oldValue){      
      wnd._manager.updateWindow(wnd);
    },

    createWindow: function createWindow(){      
      var newId         = this._idCnt++;
      var wnd           = new wndStruc(this.watchChanges);
      var area          = this.area;
      var html          = $templateCache.get('/window.html');
      
      this._stack[newId]= wnd;
      
      wnd.setId(newId);
      wnd._manager  = this;

      wnd._body     = $(html);
      wnd._body.attr('id','wndMngId' + newId);

      $(area).append(wnd.body);
      this.updateWindow(wnd);
      this.initWindow(wnd);

      return wnd;
    }
  };
}]);

