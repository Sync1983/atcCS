/* global atcCS, cqEvents */

/*
 * Сервис для обслуживания модели пользователя и общения с сервером
 */
atcCS.service('User',['$http', '$cookies', '$rootScope', '$notify', '$q',
  function($http, $cookies, $rootScope, $notify, $q){
  'use strict';
  
  var URL   = serverURL + "/index.php";
  var model = new userModel();

  function URLto(controller,funct,local){
    return (local?"":URL) + "?r=" + controller + "/" + funct;
  }

  function loadFormCookies(){
    var name = $cookies.get('name');
    var pass = $cookies.get('pass');

    if ( name && pass ){      
      model.login(name,pass,true);
      return true;
    }
    
    return false;
  };
  
  function setActiveBasket(){
    model.activeBasket = {id:null,name:null,active:false};
    if( !model.baskets || !(model.baskets instanceof Array)){
      return;
    }
    
    for(var i in model.baskets){
      var item = model.baskets[i];
      if( item.active ){
          model.activeBasket = item;
          return;
      }      
    }
    return;
  };
  
  function init(){    
    $rootScope.user = model;
    for(var index in model.alerts){
      $notify.addObj(model.alerts[index]);
    }
    loadFormCookies();      //Пробуем войти через информацию в cookie
  };
  
  $rootScope.$on('analogStateChange', function(event,data){
    model.analogShow  = data.value;    
  });
  
  $rootScope.$on('markupValueChange', function(event,data){    
    model.activeMarkup      = data.value; 
    model.activeMarkupName  = data.name;
  });
  
  $rootScope.$on('basketValueChange', function(event,data){    
    model.changeBasket(data.value).then(
      function(response){
        var data = response && response.data;
        model.baskets = data || [];
        setActiveBasket();
        $rootScope.$broadcast('userDataUpdate', {});
    });
  });

  model.getUrl = function getUrl(controller, funct){
    return URLto(controller, funct);
  };

  model.login = function login(name,password,remember){
    var req = {
      method: 'GET',
      url: URLto('login','login'),
      responseType: 'json',      
      headers: {        
        'Authorization': "Basic " + btoa(name + ":" + password)
      },
      params: {        
        params: 'get-token' + (remember?'-hash':'')
      }
    };
    var defer = $q.defer();
    
    $http(req).then(
      function success(response){        
        var hash        = response && response.data && response.data['hash'] || null;

        // Если вернулся хэш, значит запомним для следующей авторизации
        if( hash && remember ){
          var now     = new Date();
          var expires = new Date( now.getTime() + 30*24*3600*1000 );          
          
          $cookies.put('name',name,{expires:expires});
          $cookies.put('pass',hash,{expires:expires});
          defer.resolve(true);
        } else{
          defer.reject();          
        }
        
        model.update();
        
      },
      function error(response){
        $notify.addItem("Ошибка авторизации","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля.");
        defer.reject();          
    });
    
    return defer.promise;    
  };

  model.update = function update(){    
    var req = {
      method: 'GET',
      url: URLto('login','get-data'),      
      params: {        
        params: 'get-data'
      }
    };

    if( model.isLogin === false ){
      return false;
    }
    
    $http(req).then(
      function (response){        
        var data = (response && response.data) || {};
        model.markup  = data.markup || [];
        model.baskets = data.baskets;
        model.info    = data.info;
        model.role    = data.role * 1;
        model.isAdmin = (model.role==1)?true:false;
        
        setActiveBasket();
        
        $rootScope.$broadcast('userDataUpdate', {});
      }, 
      function (reason){        
        $notify.addItem("Ошибка","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля.");
      });    
  };

  model.getArticulInfo = function getArticulInfo(articul_id){
    var req = {
      method: 'GET',
      url: URLto('helper','articul-info'),
      responseType: 'json',
      params: {
        params: {
          articul_id:  articul_id
        }
      }
    };

    return $http(req);
  };
  
  model.findTypeDescr = function findTypeDescr(data, response){
     var req = {
      method: 'GET',
      url: URLto('helper','get-type-description'),
      responseType: 'json',
      params: {
        params: {
          type:  data
        }
      }
    };
    
    function serverResponse(answer){      
      var data = answer && answer.data;
      var responseData = new Array();
      
      if( !data ){
        return false;
      }
      
      if( data instanceof Array ){
        for(var i in data){
          var item = data[i];
          responseData.push({            
            name  : item.name,
            power : item.power,
            volume: item.volume,
            cyl   : item.cylinder,
            val   : item.valves,
            fuel  : item.fuel,
            drive : item.drive,
            start : new Date(item.start),
            end   : new Date(item.end)
          });
        }
      } else {
        responseData.push({            
            name  : data.name,
            power : data.power,
            volume: data.volume,
            cyl   : data.cylinder,
            val   : data.valves,
            fuel  : data.fuel,
            drive : data.drive,
            start : new Date(data.start),
            end   : new Date(data.end)
          });
      }
      response(responseData);      
    }

    $http(req).then(serverResponse);
  };
  
  model.getTypingHelper = function getTypingHelper(typedText, callback){
    var req = {
      method: 'GET',
      url: URLto('helper','get-typed-helper'),
      responseType: 'json',
      params: {
        params: String(typedText)
      }
    };
    
    function serverResponse(answer){
      var data = answer && answer.data;
      if( data && (callback instanceof Function) ){
        callback(data);
      }      
    }

    $http(req).then(serverResponse);
  };
  
  model.getBrands = function getBrands(searchText, callback){
    var req = {
      method: 'GET',
      url: URLto('search','get-brands'),
      responseType: 'json',
      params: {
        params: {
          text: String(searchText),
          use_analog: model.analogShow 
        }
      }
    };
    
    function serverResponse(answer){
      var data = answer && answer.data;
      if( callback instanceof Function ){
        callback(data);
      }      
    }

    $http(req).then(serverResponse);
  };
  
  model.getParts = function getParts(CLSID, ident, callback){
    var req = {
      method: 'GET',
      url: URLto('search','get-parts'),
      responseType: 'json',
      params: {
        params: {
          clsid: String(CLSID),
          ident: String(ident)          
        }
      }
    };
    
    function serverResponse(answer){      
      var data = answer && answer.data;
      if ( callback instanceof Function ){
        callback(data);
      }
    }
    
    function serverError(error){
      console.log('getParts Server error:', error );
      if ( callback instanceof Function ){
        callback({});
      }
    }
    
    $http(req).then(serverResponse,serverError);
  };
  
  model.toBasket  = function toBasket(data,callback){
    var req = {
      method: 'GET',
      url: URLto('basket','add'),
      responseType: 'json',
      params: {
        params: data
      }
    };
    
    function serverResponse(answer){      
      var data = answer && answer.data;      
      if ( callback instanceof Function ){
        callback(data);
      }
    }
    
    function serverError(error){      
      if ( callback instanceof Function ){
        callback(false);
      }
    }
    
    $http(req).then(serverResponse,serverError);
  };
  
  model.getBasket = function getBasket(){
    var req = {
      method: 'GET',
      url: URLto('basket','get-data'),      
      params: {        
        params: 'get-data'
      }
    };
    
    return $http(req);
  };
  
  model.changeBasket = function changeBasket(newId){
    var req = {
      method: 'GET',
      url: URLto('basket','change'),      
      params: {        
        params: newId
      }
    };
    
    return $http(req);
  };
  
  model.updatePartInfo = function updatePartInfo(partInfo){
    var req = {
      method: 'GET',
      url: URLto('basket','update'),      
      params: {        
        params: {
          count: partInfo.sell_count,
          comment: partInfo.comment,
          id: partInfo.id
        }
      }
    };
    
    return $http(req);
  };
  
  model.deletePart = function updatePartInfo(partId){
    var req = {
      method: 'GET',
      url: URLto('basket','delete'),      
      params: {        
        params: partId
      }
    };
    
    return $http(req);
  };
  
  model.orderParts = function orderParts(parts){
    var defer = $q.defer();
    var data = {};
    
    for(var i in parts){
      var part = parts[i];
      data[part.id] = part.price_change;
    }
    
    var req = {
      method: 'GET',
      url: URLto('orders','add'),      
      params: {        
        params: data
      }
    };
    
    $http(req).then(
      function(answer){
        data = answer && answer.data;
        if( !data ){
          defer.reject();
          $notify.error('Ошибка заказ','Ошибка добавления деталей в заказ');
        }
        defer.resolve(data);
      },
      function(reason){
        $notify.error('Ошибка заказ','Ошибка добавления деталей в заказ');        
        defer.reject();
      }
    );
    
    return defer.promise;
  };
  
  model.getOrders = function getBasket(){
    var req = {
      method: 'GET',
      url: URLto('orders','get-data'),      
      params: {        
        params: 'get-data'
      }
    };
    
    return $http(req);
  };
  
  model.getCatalogNode = function getParts(node, callback){
    var req = {
      method: 'GET',
      url: URLto('helper','get-catalog-node'),
      responseType: 'json',
      params: {
        params: {
          path: String(node)          
        }
      }
    };
    
    function serverResponse(answer){      
      var data = answer && answer.data;
      if ( callback instanceof Function ){
        callback(data); 
      }
    }
    
    function serverError(error){
      console.log('getCatalogNode Server error:', error );
      if ( callback instanceof Function ){
        callback({});
      }
    }
    
    $http(req).then(serverResponse,serverError);
  };
  
  init();
  return model; 

}]);
