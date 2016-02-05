/* global atcCS */

/*
 * Сервис для обслуживания модели пользователя и общения с сервером
 */
atcCS.service('User',['$http', '$cookies', '$rootScope', 'Notification', function($http, $cookies, $rootScope, $notify){
  'use strict';
  
  var URL   = serverURL + "/index.php";
  var model = new userModel();

  function URLto(controller,funct,local){
    return (local?"":URL) + "?r=" + controller + "/" + funct;
  }

  function loadFormCookies(){
    var name = $cookies.get('name');
    var pass = $cookies.get('pass');

    console.log("Login from Cookies", name, pass);

    if ( name && pass ){
      console.log("Name:",name,"Pass:",pass);
      model.login(name,pass,true).then(function(){
        model.update();
      });
      return true;
    }
    
    return false;
  };

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
    
    return $http(req).then(
      function success(response){        
        var hash        = response && response.data && response.data['hash'] || null;

        // Если вернулся хэш, значит запомним для следующей авторизации
        if( hash && remember ){
          var now     = new Date();
          var expires = new Date( now.getTime() + 30*24*3600 );
          
          $cookies.put('name',name,{expires:expires});
          $cookies.put('pass',hash,{expires:expires});
        }
        
      },
      function error(response){
        $notify.addItem("Ошибка","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля.");
    });
    
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

    console.log("User data update");
    return $http(req).then(function succes(response){
      
      }, function error(response){
      
      });
    
  };

  model.findParts = function findDescr(tags){
    var req = {
      method: 'POST',
      url: URLto('helper','parts-search'),
      responseType: 'json',
      params:{
        params:{

        }
      },
      data: {        
          descr:  tags.getTagsOneField('type', 'descr', 'id'),
          mfc:    tags.getTagsOneField('type', 'mfc',   'id'),
          model:  tags.getTagsOneField('type', 'model', 'id')        
      }
    };

    return $http(req);
  };

  model.findDescr = function findDescr(text, tags){
    var req = {
      method: 'POST',
      url: URLto('helper','description-search'),
      responseType: 'json',
      params: {
        params: {
          descr:  text,
          mfc:    tags.getTagsOneField('type', 'mfc',   'id'),
          model:  tags.getTagsOneField('type', 'model', 'id')
        }
      }
    };

    return $http(req);
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

  model.findMModel = function findMModel(text, tags){
    var req = {
      method: 'POST',
      url: URLto('helper','mmodel-search'),
      responseType: 'json',      
      params: {
        params: {
          mmodel: text,
          mfc:    tags.getTagsOneField('type', 'mfc',   'id'),
          model:  tags.getTagsOneField('type', 'model', 'id')
        }
      }
    };

    return $http(req);
  };

  model.findMFCs = function findMFCs(tags){
    var req = {
      method: 'POST',
      url: URLto('helper','mfcs-search'),
      responseType: 'json',
      params: {
        params: {
          model:  tags.getTagsOneField('type', 'model', 'id')
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

  $rootScope.user = model;
  for(var index in model.alerts){
    $notify.addObj(model.alerts[index]);
  }
  loadFormCookies();      //Пробуем войти через информацию в cookie
  
  return model; 

}]);
