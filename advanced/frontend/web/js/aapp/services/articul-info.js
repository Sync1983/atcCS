/* global atcCS */

/*
 * Сервис для обслуживания модели данных артикула
 */

function articulInfoModel($rootScope,$user,$wndMng){
  'use strict';
  var model = {
    windows: new Array()
  };
  
  function response(scope,wnd){
    return function(answer){
      var data = answer && answer.data;
      if( !data ){
        return;
      }
      
      scope.id           = data.id;
      scope.number       = data.number;
      scope.supplier     = data.supplier;
      scope.description  = data.description;
      scope.cross        = data.cross;
      
    };
  }
  
  model.requestInfo = function request(articulId,$parentWnd, $title){
    var length = model.windows.length;
    var newScope = $rootScope.$new(true);
    
    var window = $wndMng.createWindow({
      title:  "\"" + $title + "\"",
      hPos:   $parentWnd.hPos,
      vPos:   $parentWnd.vPos + $parentWnd.vSize * 0.05,
      vSize:  $parentWnd.vSize,
      hSize:  $parentWnd.hSize
    });
    model.windows[length] = window;
    
    newScope.id           = false;
    newScope.number       = "Загрузка...";
    newScope.supplier     = "Загрузка...";
    newScope.description  = "Загрузка...";
    newScope.cross        = "Загрузка...";
    newScope.wnd          = window;

    $wndMng.setBodyByTemplate(window, '/parts/_articul-info-part.html', newScope);
    
    $user.getArticulInfo(articulId).then( response(newScope,window) );
  };

  return model;
};

atcCS.service('$articulWnd',['$rootScope','User','$wndMng', 
  function($rootScope,$user,$wndMng){
    return articulInfoModel($rootScope,$user,$wndMng);
  }
]);