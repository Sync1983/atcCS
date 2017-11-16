"use strict";/* global ObjectHelper */

var ObjectHelper = {}; 
 
ObjectHelper.count = function(obj){
  var count = 0;  
  for(var prop in obj) {
    if( obj.hasOwnProperty(prop) )
      count++;
  }
  return count;  
};

ObjectHelper.spliceFields= function(obj,length){
  var count = 0;  
  for(var prop in obj) {    
    if( obj.hasOwnProperty(prop) )
      count++;
    if( count >= length){
      console.log(prop);
      delete obj[prop];
    }
  }
  return count;  
};

ObjectHelper.addUniq = function(array,value){
  var index = -1;
  index = array.indexOf(value);
  while( index > -1 ){
    delete array.splice(index,1);
    index = array.indexOf(value);
  }  
  array.unshift(value);
};

ObjectHelper.concat = function (a,b){
  a.push.apply(a, b);
  return a;
};

ObjectHelper.merge = function (a,b){
  var result = new Object();
  if( !a ){
    a = {};
  }
  if( !b ){
    b = {};
  }
  
  for(var keyA in a){
    result[keyA] = a[keyA];
  }
  
  for(var keyB in b){
    if( result.hasOwnProperty(keyB) ){
      result[keyB] = ObjectHelper.concat(result[keyB],b[keyB]);
    } else{
      result[keyB] = b[keyB];      
    }
  }  
  
  return result;
};

ObjectHelper.URLto = function(controller,funct,local){
  var URL   = serverURL + "/index.php";
  return (local?"":URL) + "?r=" + controller + "/" + funct;  
};

ObjectHelper.createRequest = function(controller, funct, params,isPost){
  var req = {
      method: (isPost?'POST':'GET'),
      url: ObjectHelper.URLto(controller,funct),
      responseType: 'json',
      params: params
    };
  return req;
};


var eventsNames = new eventsNamesList();    
var atcCS = angular.module('atcCS',['ngCookies','ngRoute','uiSwitch','ngSanitize']);

Error.stackTraceLimit = 25;
atcCS.config(['$httpProvider', function ($httpProvider) {
    'use strict';
    
    $httpProvider.defaults.headers.common = {'Accept'                     : "application/json, text/plain"};
    $httpProvider.defaults.headers.common = {'Access-Control-Allow-Origin': serverURL}; 
    $httpProvider.defaults.headers.common = {'Content-Type'               : "application/json;charset=utf-8"};
    $httpProvider.defaults.useXDomain = true;    
    $httpProvider.interceptors.push('atcServerToken');
 }]);
 
atcCS.config(function($logProvider){
  $logProvider.debugEnabled(false);
});
/* global atcCS */

atcCS.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider      
      .when('/brands/:searchText', {
        caseInsensitiveMatch: true,
        templateUrl: '/brands.html',
        controller: 'brands',
        controllerAs: 'atcCS' 
      }).when('/parts/:searchText/:brand/:rule', {
        caseInsensitiveMatch: true,
        templateUrl: '/parts.html',
        controller: 'parts',
        controllerAs: 'atcCS' 
      }).when('/basket', {
        caseInsensitiveMatch: true,
        templateUrl: '/basket.html',
        controller: 'basketControl', 
        controllerAs: 'atcCS' 
      }).when('/orders', {
        caseInsensitiveMatch: true,
        templateUrl: '/orders.html',
        controller: 'ordersControl',
        controllerAs: 'atcCS' 
      }).when('/catalog/:path?', {
        caseInsensitiveMatch: true,
        templateUrl: '/catalog.html',
        controller: 'catalogControl',
        controllerAs: 'atcCS' 
      }).when('/news/:page?', {
        caseInsensitiveMatch: true,
        templateUrl: '/news.html',
        controller: 'newsControl',
        controllerAs: 'atcCS' 
      }).when('/contacts', {
        caseInsensitiveMatch: true,
        templateUrl: '/contacts.html',
        controllerAs: 'atcCS' 
      });

    $locationProvider.html5Mode(true);
}]);

/* global atcCS */ 
/* global eventsNames */ 

atcCS.controller( 'main-screen',['$scope','User','$templateCache','$menu', '$events', '$windowSrv', '$location', 
  function($scope,$user,$templateCache,$menu,$events, $window, $location) {
    'use strict';
    
    var menuEvents = $events.get(eventsNames.eventsMain());
    var searchEvents = $events.get(eventsNames.eventsSearch());
    var searchInput = $("#search-input");
    
    $scope.searchText = {'text':""};    
    menuEvents.setListner('menuSelect', onMenuSelect);
    searchEvents.setListner('change', onSearchChange);
    
    $scope.onMenuLoad = function(){
      $menu.setEventsListner(menuEvents,'menuSelect');
      $menu.clear();
      $menu.addItem("main","Главная");
      if( $user.isLogin !== true ){
        $menu.addItem("login", "Войти");        
      } else {
        $menu.addItem("change-markup", "Сменить наценку", $user.activeMarkupName || undefined);
        $menu.addItem("change-basket", "Сменить корзину", $user.activeBasket && $user.activeBasket.name || undefined);
      }
      console.log($user);
      $menu.addItem("change-analog", "Показывать аналоги", $user.analogShow?"Да":"Нет" );
      
      
      $menu.show();
    };
    
    $scope.onSearch = function(){
      var clearText   = String($scope.searchText.text).replace(/\W*/gi,"");
        $scope.$evalAsync(function() {
          $location.path('brands/'+clearText);
        });       
    };
    
    function menuLogin(){
      $window.setTemplate('/login-window.html',$scope);
      $window.show().then(
        function(ok){          
          $user.login($scope.login, $scope.pass, $scope.reuse);
        },
        function(reject){
           
        }
      );
    }
    
    function onMenuSelect(name, args){
      
      if(args === "login"){
        menuLogin();
      } else if(args === "change-analog"){
        $user.analogShow = !$user.analogShow;
      }
      
    };
    
    function onSearchChange(name,args){      
      $(searchInput).val(args).trigger('change');
    };
    
    
   
    
}]);
/* global atcCS, eventsNames */

atcCS.controller( 'brands', [
    '$scope', 'User' ,'$routeParams','$events', '$location', 
    function($scope,$user,$routeParams, $events, $location ) {
    'use strict';        
    
    var searchEvents = $events.get(eventsNames.eventsSearch());
    $scope.searchText = $routeParams.searchText || false;
    $scope.count      = 0;    
    $scope.inSearch   = true;
      
    searchEvents.broadcast('change', $scope.searchText);
    
    $user.getBrands( $scope.searchText, serverResponse);
    
 
    function serverResponse(data){
      $scope.inSearch = false;      
      if( !data || !data.count ){
        return;
      }      
      var keys = Object.keys(data.rows).sort();
      var list = {};
      for(var i in keys){
        var key = keys[i];
        list[key] = data.rows[key];
      }      
      $scope.brands = list;
    }
    
}]);
/* global atcCS, ObjectHelper, eventsNames */

atcCS.controller( 'parts', [
    '$scope', '$filter', 'User' ,'$routeParams','$rootScope', '$events', '$q', '$log',
    function($scope,$filter,$user,$routeParams,$rootScope, $events, $q, $log ) {
    'use strict';    
    var brands = false;
    var searchEvents = $events.get(eventsNames.eventsSearch());
    
    $scope.loading    = {};    
    $scope.data       = [];    
    $scope.searchText = $routeParams.searchText || false;
    $scope.brand      = $routeParams.brand      || false;
    $scope.rule       = JSON.parse($routeParams.rule)       || false;
    $scope.analogShow = $user.analogShow;
    $scope.markup     = $user.activeMarkup || 0;
    $scope.markupName = $user.activeMarkupName || '';
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.articulCmp = $scope.searchText.toUpperCase();
    $scope.expand     = "ATE";//undefined;
        
    for(var i in $scope.rule){
        var clsid = $scope.rule[i].id;
        var ident = $scope.rule[i].uid;
       
        $user.getParts(clsid,ident,$scope.searchText,
          function(data){
            serverResponse(clsid, ident, data);
        });
        $scope.loading[clsid] = clsid;        
    }  
    
    function serverResponse(clsid,ident,data){
      delete($scope.loading[clsid]);
      if( !data || !data.rows){
        return;
      }

      $scope.data = ObjectHelper.merge($scope.data, data.rows);
    }
    
    $scope.selectMaker=function(maker){
      console.log(maker);
      $scope.expand = maker;
    };
    
    $scope.$watch("data",
      function(newVal, oldVal){
        console.log(newVal);
      }, true);
      
    /*$snCtrl.change($scope.searchText); 
    
    $scope.table = new tableViewData({
      $columns: {
        maker:    {name: "Производитель", width:"10"},
        articul:  {name: "Артикул",       width:"15"},
        name:     {name: "Наименование",  width:"40", align: "left"},
        price:    {name: "Цена",          width:"8"},
        shiping:  {name: "Срок",          width:"8"},
        count:    {name: "Наличие",       width:"8"},
        basket:   {name: "В корзину",     width:"8"}        
      },
      template: {
        articul: ["<span style='float:none'>{{row.articul}}",
                  "  <div class='articul-search-div'>",
                  "    <button ng-click='onArticulSearch(row.articul)'>",
                  "      <span class='glyphicon glyphicon-search'>",
                  "      </span>",
                  "    </button>",
                  "  </div>",
                  "</span>"].join(""),
        basket:  ["<span>",
                  "  <button ng-click='onAdd(row)' class='basket-add-button'",
                  "           ng-show='isLogin&&!row.adding&&!row.error'>",
                  "     <span class='glyphicon glyphicon-plus'></span>",
                  "     Добавить",
                  "  </button>",
                  "  <span class='load-info' ng-show='row.adding'></span>", 
                  "</span>"].join(""),
        name:     "<span title='{{row.name}}'><span ng-if='isAdmin'>{{row.prvd}} : {{row.stock}} </span>{{row.name}}</span>",
        price:    "<span title='{{(isAdmin && (row.price) || showWithMarkup(row.price) ) | number:2}}'>{{showWithMarkup(row.price) | number:2}}</span>",
        count:   ["<span>{{row.count}}",
                  " <div class='lot-quantity' title='Минимальное количество для заказа' ng-show='(row.lot_quantity>1)'>",
                  "   <span class='glyphicon glyphicon-th-large'></span> {{row.lot_quantity}}",
                  " </div>",
                  "</span>"].join("")
      },
      hlight: {
        articul: $scope.articulCmp
      },
      sortRows: sortFunction,
      sortGroups: sortHeader,
      sort: {
        maker: 1,
        price: 1,
        shiping: 1
      },
      filter: function(row){
        return $scope.analogShow || (row.isOriginal===1);
      }
    });
    
    $scope.self = $scope; 
    
    function getRequsetParams(){
      var requestParams;
      brands = $storage.get($scope.timestamp);
    
      if( !$scope.timestamp || !brands ) {       
        return {};
      }
      
      for(var brand in brands.rows){        
        if( brand !== $scope.brand ){
          continue;
        }
        requestParams = brands.rows[brand];
      }            
      
      return requestParams;
    }
    
    function loadingData(requestParams){
      for(var i in requestParams){
        var clsid = requestParams[i].id;
        var ident = requestParams[i].uid;
        var storage = $storage.get($scope.timestamp+'@'+clsid+'@'+ident+'@'+$scope.searchText);
        if( storage ){                
          serverResponse(clsid,ident,storage);                
        } else{
          $user.getParts(clsid,ident,$scope.searchText,serverResponseCall(clsid, ident));
          $scope.loading[clsid] = clsid;        
        }
      }      
    }    
    
    function serverResponseCall($clsid, $ident){
      return function(data){
        serverResponse($clsid,$ident,data);
      };
    }
    
    function serverResponse(clsid,ident,data){
      delete($scope.loading[clsid]);
      
      if( !data ){
        return;
      }
      
      $storage.set($scope.timestamp+'@'+clsid+'@'+ident+'@'+$scope.searchText,data);      
      $scope.table.addData(data.rows);
    }
    
    function load(){
      loadingData( getRequsetParams() );
    }
    
    function sortFunction(sort){
      
      function isNumeric(obj) {
        return !isNaN(obj - parseFloat(obj));
      }
      
      function calcWeight(rowA, rowB, sort){
        var weightA = 0;
        var weightB = 0;        
        var A,B;
        if( String(rowA.articul).toUpperCase() === $scope.articulCmp ){
          weightA -= 100;
        }
        if( String(rowB.articul).toUpperCase() === $scope.articulCmp ){
          weightB -= 100;
        }
          
        for(var cKey in sort){
          
          if( isNumeric(rowA[cKey]) && isNumeric(rowB[cKey]) ){
            A = parseFloat(rowA[cKey]);
            B = parseFloat(rowB[cKey]);
          } else {
            A = String(rowA[cKey]).toUpperCase();
            B = String(rowB[cKey]).toUpperCase();            
          }
          
          if( A > B ){
            weightA += sort[cKey];
          } else if( A < B){
            weightB += sort[cKey];            
          }
          
        }
        
        
        if( weightA > weightB ){
          return 1;
        } else if( weightA < weightB ){
          return -1;
        }
        
        return 0;
        
      }
      
      return function(rowA, rowB){
        return calcWeight(rowA, rowB, sort);
      };
    }   
    
    function sortHeader(sort) {
      
      return function(headA, headB){
        var res = 0, brandOffset = 0;
        
        if( headA.name === $scope.brand ){
          brandOffset -= 10;
        }
        if( headB.name === $scope.brand ){
          brandOffset += 10;
        }
        
        if( sort.maker === undefined ){
          return brandOffset;
        }
        
        if( headA.name > headB.name ){
          res = 1;
        } else if( headA.name < headB.name ){
          res = -1;
        }
        return brandOffset + res * sort.maker;
      };
    }
    
    $scope.showWithMarkup = function(price){
      if( $scope.markup === 0){
        return price;
      }
      return price*(1 + $scope.markup/100);
    };
    
    $scope.showMarkupName = function(){
      if( $scope.markup === 0){
        return "";
      }
      return " [" + $scope.markupName + "]";
    };
    
    $scope.table.$columns.price.name = "Цена" + $scope.showMarkupName();
    
    $scope.onArticulSearch = function(articul){
      searchEvents.broadcast("StartSearchText",articul);      
    };
    
    $scope.onAdd  = function(item){      
      /*if( item === undefined ){
        return;
      }*/      
    /*  
      var onAnswer = function(aitem){
        return function(answer){
          item.adding = false;
          if( answer.error ){
            for(var i in answer.error){
              aitem.error = true;
              $notify.error("Ошибка корзины",answer.error[i]);
            }
            return;
          }
          if( answer.save ){
            $notify.info("Деталь добавлена","Деталь " + aitem.name + "добавлена в корзину");
            return;
          }          
        };
      };
      
      item.sell_count = item.lot_quantity;
      item.adding = true;      
      $user.toBasket(item, onAnswer(item));
      return false;
    };
    
    $scope.onCollapse = function(){      
      var data = $scope.table.$rowGroups;
      for(var i in data){
        data[i].show = false;
      }
      return false;
    };
    
    $scope.onExpand = function(){
      var data = $scope.table.$rowGroups;
      for(var i in data){
        data[i].show = true;
      }      
      return false;
    };
    
    $rootScope.$on('analogStateChange', function(event,data){
      $scope.analogShow  = data.value;    
      $scope.tableParams.reload();
    });
    
    $rootScope.$on('markupValueChange', function(event, data){
      $scope.markup     = data.value;
      $scope.markupName = data.value?data.name:'';
      $scope.table.$columns.price.name = "Цена" + $scope.showMarkupName();      
    });
    
    $rootScope.$on('userDataUpdate', function(event){        
        $scope.isLogin = $user.isLogin;         
        $scope.isAdmin = $user.isAdmin;         
     });   
    */
    //load();
}]);
/* global atcCS */   

atcCS.factory('atcServerToken', ['$q', '$rootScope', '$injector',
  function ($q, $rootScope, $injector) {
    var interceptor = {
      request: function(config){
        if( config.params ){
          config.params._format = 'json';
          config.responseType   = 'json';
        }        
        if( $rootScope.user.isLogin ){
          config.headers.Authorization = 'Bearer ' + $rootScope.user.accessToken;
        }
        
        return config;
      },
      response: function (response){
        var accessToken = response && response.data && response.data["access-token"] || null;

        if( accessToken ){
          $rootScope.user.accessToken = accessToken;
          $rootScope.user.isLogin = true;
        }

        return response;
      },
      responseError: function(response){
        if( response.status === 401 ){
          $rootScope.user.accessToken = null;
          $rootScope.user.isLogin = false;
        }
      }
        
    };

    return interceptor;

}]);


/* global atcCS, cqEvents, eventsNames, ObjectHelper */

atcCS.filter('ObjectLength', function() {
  return function(object) {
    return Object.keys(object).length;
  };
});


/*
 * Модель пользователя системы
 */
function userModel(){
  'use strict';
  
  return {
    name: undefined,
    surname: undefined,
    company: undefined,
    
    markup: [],    
    activeMarkup: null,
    activeMarkupName: null,
    
    baskets: [],
    activeBasket: {id:null,name:null,active:false},

    alerts: [
      {head: "Добро пожаловать", text: "АвтоТехСнаб приветствует Вас", style:"btn-info"}
    ],

    analogShow  : true,      //Отображать аналоги
    isLogin     : false,     //Вход выполнен
    isAdmin     : false,     //Администратор
    accessToken : false      //access-token для запросов 
    
    
  };
  
}
/* global atcCS, cqEvents, eventsNames, ObjectHelper */

/*
 * Сервис для обслуживания модели пользователя и общения с сервером
 */

var catalogBack = function($http, $events){
  'use strict';
  var self = this;
  self.events = null;
  const EVENT_GETDATA = 'getData';
  const EVENT_UPDATE  = 'update';
  
  function init(){
    self.events = $events.get(eventsNames.eventsCatalog());    
    self.events.setListner(EVENT_GETDATA, getData);
  };
  
  function getData(event, node){
    var request = ObjectHelper.createRequest('catalog','get-data',{ params: { path: String(node) }});    
    
    function serverResponse(data){      
      var answer = data && data.data;
      self.events.broadcast(EVENT_UPDATE,answer);
    };
    
    function serverError( error ){
      console.log('getCatalogNode Server error:', error );      
    }
    
    $http(request).then(serverResponse,serverError);
  };
  
  init();  
    
};

var newsBack = function($http, $events){
  'use strict';
  var self = this;
  self.events = null;
  const EVENT_UPDATE  = 'update';  
  const EVENT_GETDATA = 'getData';  
  
  function init(){
    self.events = $events.get(eventsNames.eventsNews());    
    self.events.setListner(EVENT_GETDATA, getData);
  };
  
  function getData(event, page){    
    var request = ObjectHelper.createRequest('news','get-data',{ params: { path: String(page) }});    
    
    function serverResponse(data){      
      var answer = data && data.data;      
      self.events.broadcast(EVENT_UPDATE,answer);
    };
    
    function serverError( error ){
      console.log('getNews Server error:', error );      
    }
    
    $http(request).then(serverResponse,serverError);
  };
  
  init();  
    
};

atcCS.service('User',['$http', '$cookies', '$rootScope', '$q', '$events',
  function($http, $cookies, $rootScope, $q, $events){
  'use strict';
  
  var URL   = serverURL + "/index.php";
  var model = new userModel();
  var events = $events.get(eventsNames.eventsUser());

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
    //for(var index in model.alerts){
    //  $notify.addObj(model.alerts[index]);
    //}
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
        //$notify.addItem("Ошибка авторизации","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля.");
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
        model.isAdmin = (model.role === 1)?true:false;
        
        setActiveBasket();
        
        $rootScope.$broadcast('userDataUpdate', {});        
        events.broadcast('userDataUpdate',model);
      }, 
      function (reason){        
        //$notify.addItem("Ошибка","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля.");
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
  
  model.getParts = function getParts(CLSID, ident, searchText,callback){
    var req = {
      method: 'GET',
      url: URLto('search','get-parts'),
      responseType: 'json',
      params: {
        params: {
          clsid: String(CLSID),
          ident: String(ident),
          search: String(searchText)
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
          //$notify.error('Ошибка заказ','Ошибка добавления деталей в заказ');
        }
        defer.resolve(data);
      },
      function(reason){
        //$notify.error('Ошибка заказ','Ошибка добавления деталей в заказ');        
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
  
  model.catalog = new catalogBack($http,$events);
  
  model.news    = new newsBack($http,$events);
  
  init();
  return model; 

}]);

/* global atcCS, eventsName */

function event($name){
  
  var name;  
  var listners = [];
  var self = this;
  
  function init(){
    name  = $name;    
    listners = []; 
  };
  
  this.broadcast = function broadcast(eventName, args){
    //console.log("Broadcast event scope '" + name +"'["+ eventName+"]");
    
    var list = listners[eventName] || [];
    
    for(var i in list){
      //console.log("Listen event scope '" + name + "'["+eventName + "]");
      list[i](eventName,args);
    }
    
  };
  
  this.setListner = function setListner(eventName, callback){    
    
    if( listners.indexOf(eventName) === -1 ){
      listners[eventName] = [];
    }
    
    if ( (listners[eventName].indexOf(callback) !== -1 ) || 
        !(callback instanceof Function) ){
      return;
    };
    
    listners[eventName].push(callback);    
  };
  
  init();  
  return this;
};

function events($rootScope){
  'use strict';
  var events = [];
  
  function init(){        
    events = [];
  }
  
  this.get = function get(name){    
    if ( !(name in  events) ){
      events[name] = new event(name);
    }    
    
    return events[name];
  };  
  
  init();
  return this;
};

atcCS.service('$events',[
  '$rootScope', '$q',
  function($rootScope,$q){
    return new events($rootScope,$q);
}]);

function eventsNamesList(){
  this.eventsMain = function(){
    return 'eventMainScope';
  };
  
  this.eventsUser = function(){
    return 'eventUserScope';
  };
  
  this.eventsCatalog = function(){
    return 'eventCatalogScope';
  };
  
  this.eventsSearch= function(){
    return 'eventSearchScope';
  };
  
  this.eventsNews= function(){
    return 'eventNewsScope';
  };
};
/* global atcCS */

function menuControl($root, $q, $templateCache, $compile, $events){
  var self = this;
  var body = $.find("#menu-block");
  var template = $templateCache.get('/menu-view.html');
  var scope = $root.$new(true);
  var html = $(template);
  var compile = $compile(html)(scope);
  self.listner    = undefined;
  self.eventName  = undefined;
          
  scope.items = [  ];
  
  $(body).html( compile );
  $(body).find(".menu-close").click(function(){ self.hide(); });
  
  scope.onClick = function(id){
    if(self.listner && self.eventName ){
      self.listner.broadcast(self.eventName, id);
    }    
    self.hide();
  };
  
  self.show = function(){
    $(body).fadeIn("slow").css("display","inline-block");
  };
  
  self.hide = function(){    
    $(body).fadeOut("slow");
  };
  
  self.clear = function(){
    scope.items = new Array();
  };
  
  self.setEventsListner = function(listner, eventName){
    self.listner = listner;
    self.eventName = eventName;
  };
  
  self.addItem = function(id, name,bubble){    
    scope.items.push({key:id, name:name, bubble});
  };
  
  return self;  
}


atcCS.service('$menu',[
  '$rootScope', '$q', '$templateCache','$compile', '$events',
  function($rootScope,$q,$templateCache,$compile, $events){
    return new menuControl($rootScope, $q, $templateCache, $compile, $events);
}]);


/* global atcCS */

function windowControl($root, $q, $templateCache, $compile, $events){
  var self = this;
  var body = $.find("#window");
  var defer = $q.defer();
  
  self.setTemplate = function(templateAddr, scope){
    var template = $templateCache.get(templateAddr);
    var html = $(template);
    var compile = $compile(html)(scope);
    $(body).find(".window-body").html( compile );
  };
  
  $(body).find(".window-close").click(onClose);
  $(body).find("#cancel").click(onClose);
  $(body).find("#ok").click(onOk);
  
  function onClose(){
    $(body).fadeOut();
    defer.reject();
  };
  
  function onOk(){
    $(body).fadeOut();    
    defer.resolve(true);
  };
  
  self.show = function(){
    $(body).fadeIn();
    return defer.promise;
  };
  
  return self;  
}


atcCS.service('$windowSrv',[
  '$rootScope', '$q', '$templateCache','$compile', '$events',
  function($rootScope,$q,$templateCache,$compile, $events){
    return new windowControl($rootScope, $q, $templateCache, $compile, $events);
}]);


