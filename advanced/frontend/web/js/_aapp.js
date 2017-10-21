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
var atcCS = angular.module('atcCS',['ngCookies','ngRoute', 'ngTable','uiSwitch','ngSanitize']);

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
      .when('/brands/:searchText/:timestamp?', {
        caseInsensitiveMatch: true,
        templateUrl: '/search-brands.html',
        controller: 'brandsSearch',
        controllerAs: 'atcCS' 
      }).when('/parts/:searchText/:timestamp/:brand', {
        caseInsensitiveMatch: true,
        templateUrl: '/parts-list.html',
        controller: 'partsSearch',
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

atcCS.controller( 'headControl',['$scope','User','$wndMng','$templateCache', function($scope,$user,$wndMng,$templateCache) {
    'use strict';

    var menu = $(".search-bar");    
    
    var window = $wndMng.createWindow({
      title: "Авторизация",
      hPos: 0,
      vPos: menu.position().top + menu.height(),
      hSize: $(".view").position().left,
      vSize: 170,
      hAlign: 'left',
      showStatusBar: false,
      showClose: false,
      canResize: false,
      canMove: false,
      show: !$user.isLogin
    });
    $wndMng.setBodyByTemplate(window, '/parts/_login-part.html', $scope);

    $scope.show = !$user.isLogin;
    $scope.request = false;
    
    $scope.login      = {
      name: $user.name,
      password: $user.password,
      remember: true
    };

    $scope.onLogin = function(){
      $scope.request = true;
      
      $user.login($scope.login.name,$scope.login.password,$scope.login.remember).then(function(answer){
        $scope.request = false;        
      },function(reason){
        $scope.request = false;        
      });
      
      $scope.show = !$user.isLogin;
      return false;
    };

    $scope.$watch(
      function(){ return $user.isLogin; },
      function( newVal ){
        $scope.show = !newVal;
        window.show = !newVal;
      }
    );
    
}]);
/* global atcCS */

atcCS.controller( 'basketControl', [
  '$scope', 'User' ,'$rootScope', 'NgTableParams', '$confirm','$wndMng','$notify',
  function($scope,$user,$rootScope,NgTableParams,$confirm,$wndMng,$notify ) {
    'use strict';    
    
    var confirmButton = $('<button class="btn btn-default" ng-class="{disable: confirmDisable===true}" ng-click="update()">Обновить</button>');
    var orderButton = $('<button class="btn btn-info" ng-click="sendOrders()">Заказать</button>');
    
    $scope.isLogin    = $user.isLogin;
    $scope.basketName = $user.activeBasket.name;
    $scope.tableData  = undefined;
    $scope.error      = undefined;
    $scope.editPart   = undefined;
    $scope.items      = {};
    $scope.selected   = false;
    $scope.confirmDisable = false;
    
    $scope.tableParams = new NgTableParams(
      {  },
      {        
        counts: [],
        total: 0,        
        getData: function(params){
          var sorting = params.sorting();
          
          return $user.getBasket().then(
            function answer(response){
              var data = (response && response.data) || [];
              for(var index in data){
                var item = data[index];                
                item.date *=  1000;
                item.price = (item.price * 1).toFixed(2);
                item.price_change = true;
              }
              data.sort(function(itemA,itemB){                
                var rWeight = 0;
                for(var field in sorting){                  
                  var sortSide  = sorting[field]==="desc"?-1:1;
                  var weight    = sortSide;
                  var valueA    = itemA[field] || null;
                  var valueB    = itemB[field] || null;                  
                  rWeight += (valueA===valueB)?0:((valueA>valueB)?weight:-weight);                  
                }                
                return rWeight;
              });
              
              return data;
            }      
          );
        }
      }                
    );  
    
    $scope.editWnd = $wndMng.createWindow({
        title: "Редактировать позицию",        
        hSize: '20%',
        vSize: '50%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    true,
        showMin:      false,
        modal:        true,
        show:         false
      });
      
    $scope.orderWnd = $wndMng.createWindow({
        title: "Заказать детали",        
        hSize: '20%',
        vSize: '50%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    true,
        showMin:      false,
        modal:        true,
        show:         false
      });
      
    $wndMng.setBodyByTemplate($scope.editWnd,  '/parts/_basket-edit.html',   $scope);  
    $wndMng.setBodyByTemplate($scope.orderWnd, '/parts/_basket-order.html',  $scope);  
    $wndMng.setStatusBar($scope.editWnd, confirmButton,   $scope);  
    $wndMng.setStatusBar($scope.orderWnd, orderButton,   $scope);  
        
    $scope.delete = function(row){
      if( row === undefined ){
        return;
      }
      var text = "Действительно удалить позицию в корзние " + row.articul + " - " + row.maker + " - " + row.name + "?";
      
      $confirm.request(text).then(
        function(status){
          if( status !== 1 ){
            return;
          }
          row.hide = true;
          $user.deletePart(row.id).then(
            function(response){
              var answer = response && response.data;
              if( !answer ){                
                $notify.error('Ошибка удаления','Удалить позицию из корзины не удалось');
                row.hide = false;
                return;
              }
              $notify.info('Позиция удалена','Позиция ' + row.name + ' удалена из корзины');
          });
      });  
    };
    
    $scope.edit = function(row){      
      $scope.editPart = row;
      $scope.error    = undefined;
      $scope.confirmDisable = false;
      $wndMng.show($scope.editWnd);
    };
    
    $scope.update = function(){      
      if( !$scope.editPart || $scope.confirmDisable ){
        return;
      }
      
      $scope.confirmDisable = true;
      $user.updatePartInfo($scope.editPart).then(
        function(response){
          var answer = response && response.data;
          if( !answer || !answer['save'] ){
            $scope.error = 'Ошибка записи данных';
            return;            
          }
          $scope.confirmDisable = false;          
        },
        function(reason){          
          $scope.error = reason;
      });
    };
    
    $scope.order  = function(row){
      var id = row.id;
      if( $scope.items[id] ){
        $scope.items[id].selected = false;
        delete $scope.items[id];        
        return;
      }
      $scope.items[id]  = row;
      row.selected      = true;      
    };
    
    $scope.makeOrder = function(rows){      
      $wndMng.show($scope.orderWnd);
    };
    
    $scope.sendOrders = function(){
      var count = 0;
      $wndMng.hide($scope.orderWnd);
      
      $user.orderParts($scope.items).then(
        function(answer){
          var status = answer.status;
          var errors = answer.error;
          
          for(var i in status){
            for(var r in $scope.items){
              var item = $scope.items[r];
              if( item.id === i ){
                item.hide = true;
                $scope.items[r] = undefined;
                delete $scope.items[r];
                count ++;
              }
            }
          }
          
          for(var e in errors){
            $notify.error('Ошибка заказа','Деталь не была добалвена в заказ');
          }          
          
          $notify.info('В заказе', count + ' позиций были добавлены в заказ');
        }
      );
    };
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;
        $scope.basketName = $user.activeBasket.name;        
        if( $user.isLogin && $scope.tableParams ){
          $scope.tableParams.reload();          
        }
     });   
     
     $scope.$watch('items',
      function(newVal){
        var cnt = 0;
        for(var i in newVal){
          if( newVal.hasOwnProperty(i)){
            cnt++;            
          }
        };
        $scope.selected = cnt;        
        return newVal;
      },true
     );
     
}]);


/* global atcCS */

atcCS.controller( 'brandsSearch', [
    '$scope','$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', '$anchorScroll', '$location', '$window', 
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, $anchorScroll, $location, $window ) {
    'use strict';    
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.count      = 0;
    $scope.titleShow  = {};
    $scope.isScroll   = false;
    
            
    if( !$scope.timestamp ){
      $scope.timestamp = Math.round( (new Date()).getTime() / 1000 );
    }
    
    $snCtrl.change($scope.searchText);
    
    if( $storage.get($scope.timestamp) ){
      //Было закешировано      
      serverResponse($storage.get($scope.timestamp));
    } else if( $scope.searchText ){      
      //Надо загрузить      
      $scope.inSearch = true;
      $user.getBrands( $scope.searchText, serverResponse);
    }
    
    function createMultiList(data){ 
      var list      = {};
      var sortData  = {};
      var keys      = Object.keys(data);
      
      keys.sort();
      
      for(var i in keys){
        var key = keys[i];
        var letter = String(key).substring(0,1);
        sortData[key] = data[key];        
        $scope.titleShow[letter] = true;
      }
      
      
      for(var key in sortData){
        var letter = String(key).substring(0,1);
        if( !list.hasOwnProperty(letter) ){
          list[letter] = {};
        }
        
        list[letter][key] = sortData[key];
      }
      
      return list;
    }
    
    function serverResponse(data){
      $scope.inSearch = false;
      if( !data || !data.count ){
        return;
      }      
      
      $scope.brands = createMultiList(data.rows || []);
      $scope.count  = data.count;      
      $storage.set($scope.timestamp,data);      
    }
    
    $scope.goToTarget = function(letter){
      var newHash = 'tag' + letter;                  
      $anchorScroll(newHash);
    };
    
    
    angular.element("div.view").bind("scroll", function(event) {            
      if (event.currentTarget.scrollTop >= 100) {
        $scope.isScroll = true;
      } else {
        $scope.isScroll = false;
      }
      $scope.$apply();
     });
    
}]);
/* global atcCS, eventsNames */

function catalogActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route){  
  'use strict';
  var searchEvents;
  var events;
  var userEvents;
  var path;
  var self = this;
  
  function init(){
    searchEvents = $events.get(eventsNames.eventsSearch());
    events       = $events.get(eventsNames.eventsCatalog());
    userEvents   = $events.get(eventsNames.eventsUser());    
    path         = $routeParams.path || false;    
    //***************************************
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.editMode   = false;
    $scope.nodes      = [];
    $scope.path       = [];
    $scope.onClick    = self.onClick; 
    $scope.search     = "";
    //***************************************    
  };
  
  this.updateListner = function(event, data){      
      $scope.nodes  = data.nodes;
      $scope.path   = data.path;  
  };
  
  this.onClick = function(row){
    if(row.is_group){        
        $route.updateParams({path:row.path});
        return;
     }
     searchEvents.broadcast("StartSearchText",row.articul);     
  };
  
  this.changeNodes = function(newVal, oldVal){    
    if(angular.equals(newVal, oldVal) || (oldVal.length === 0)) {
      return; // simply skip that
    }
      
    console.log(oldVal,newVal);
  };
  
  this.userDataUpdate = function(event,data){    
    $scope.isLogin    = data.isLogin;        
    $scope.isAdmin    = data.isAdmin;    
  };
  
  //******************************************
  init();
  
  events.setListner("update",self.updateListner);
  events.broadcast("getData",path);
  
  userEvents.setListner("userDataUpdate",self.userDataUpdate);
  $scope.$watch("nodes", self.changeNodes, true);
  
};

atcCS.controller( 'catalogControl', [
  '$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify', '$events', '$routeParams', '$route', 
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route ) {
        return new catalogActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route);
}]);


/* global atcCS, eventsNames */

function newsActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route){  
  'use strict';
  var searchEvents;  
  var newsEvents;
  var userEvents;
  var page;
  var self = this;
  
  function init(){
    searchEvents = $events.get(eventsNames.eventsSearch());    
    newsEvents   = $events.get(eventsNames.eventsNews());    
    userEvents   = $events.get(eventsNames.eventsUser());    
    page         = $routeParams.page || false;    
    //***************************************
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin; 
    $scope.news       = [];
    //*************************************** 
    newsEvents.broadcast("getData", page);
  };
  
  this.userDataUpdate = function(event,data){    
    $scope.isLogin    = data.isLogin;        
    $scope.isAdmin    = data.isAdmin;    
  };
  
  this.newsUpdate = function(event, data){
    $scope.news = data.data || [];
    for(var item in data.data){
        data.data[item].date = Date.parse(data.data[item].date);  
        //data.data[item].full_text = htmlString(data.data[item].full_text);
    }
    console.log("News:",data);
  };
  
  this.onClick = function(row){
    if(row.is_group){        
        $route.updateParams({path:row.path});
        return;
     }
     searchEvents.broadcast("StartSearchText",row.articul);     
  };
  
  //******************************************
  init();  
  
  userEvents.setListner("userDataUpdate",self.userDataUpdate);
  newsEvents.setListner("update",self.newsUpdate);
};

atcCS.controller( 'newsControl', ['$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify', '$events', '$routeParams', '$route', 
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route ) {
        return new newsActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route);
}]);


/* global atcCS */

atcCS.controller( 'ordersControl', [
  '$scope', 'User' ,'$rootScope', 'NgTableParams', '$confirm','$wndMng','$notify',
  function($scope,$user,$rootScope,NgTableParams,$confirm,$wndMng,$notify ) {
    'use strict';    
    
    var confirmButton = $('<button class="btn btn-default" ng-class="{disable: confirmDisable===true}" ng-click="update()">Обновить</button>');
    var orderButton = $('<button class="btn btn-info" ng-click="sendOrders()">Заказать</button>');
    
    $scope.isLogin    = $user.isLogin;
    $scope.basketName = $user.activeBasket.name;
    $scope.tableData  = undefined;
    $scope.error      = undefined;
    $scope.editPart   = undefined;
    $scope.items      = {};
    $scope.selected   = false;
    $scope.confirmDisable = false;
    
    $scope.tableParams = new NgTableParams(
      {
        group: {
          part_status: "asc"
        }
      },
      {        
        counts: [],                
        getData: function(params){
          var sorting = params.sorting();
      
          return $user.getOrders().then(
            function answer(response){
              var data = (response && response.data) || [];
              for(var index in data){
                var item = data[index];                
                item.date *=  1000;
                item.price = (item.price * 1).toFixed(2);
                item.price_change = true;
              }
              data.sort(function(itemA,itemB){                
                var rWeight = 0;
                for(var field in sorting){                  
                  var sortSide  = sorting[field]==="desc"?-1:1;
                  var weight    = sortSide;
                  var valueA    = itemA[field] || null;
                  var valueB    = itemB[field] || null;                  
                  rWeight += (valueA===valueB)?0:((valueA>valueB)?weight:-weight);                  
                }                
                return rWeight;
              });
              return data;          
            }      
          );
        }
      }                
    );  
    
    /*$scope.editWnd = $wndMng.createWindow({
        title: "Редактировать позицию",        
        hSize: '20%',
        vSize: '50%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    true,
        showMin:      false,
        modal:        true,
        show:         false
      });
      
    $scope.orderWnd = $wndMng.createWindow({
        title: "Заказать детали",        
        hSize: '20%',
        vSize: '50%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    true,
        showMin:      false,
        modal:        true,
        show:         false
      });
      
    $wndMng.setBodyByTemplate($scope.editWnd, '/parts/_basket-edit.html',   $scope);  
    $wndMng.setBodyByTemplate($scope.orderWnd, '/parts/_basket-order.html',   $scope);  
    $wndMng.setStatusBar($scope.editWnd, confirmButton,   $scope);  
    $wndMng.setStatusBar($scope.orderWnd, orderButton,   $scope);  
        
    $scope.delete = function(row){
      if( row === undefined ){
        return;
      }
      var text = "Действительно удалить позицию в корзние " + row.articul + " - " + row.maker + " - " + row.name + "?";
      
      $confirm.request(text).then(
        function(status){
          if( status !== 1 ){
            return;
          }
          row.hide = true;
          $user.deletePart(row.id).then(
            function(response){
              var answer = response && response.data;
              if( !answer ){                
                $notify.error('Ошибка удаления','Удалить позицию из корзины не удалось');
                row.hide = false;
                return;
              }
              $notify.info('Позиция удалена','Позиция ' + row.name + ' удалена из корзины');
          });
      });  
    };
    
    $scope.edit = function(row){      
      $scope.editPart = row;
      $scope.error    = undefined;
      $scope.confirmDisable = false;
      $wndMng.show($scope.editWnd);
    };
    
    $scope.update = function(){      
      if( !$scope.editPart || $scope.confirmDisable ){
        return;
      }
      
      $scope.confirmDisable = true;
      $user.updatePartInfo($scope.editPart).then(
        function(response){
          var answer = response && response.data;
          if( !answer || !answer['save'] ){
            $scope.error = 'Ошибка записи данных';
            return;            
          }
          $scope.confirmDisable = false;          
        },
        function(reason){          
          $scope.error = reason;
      });
    };
    
    $scope.order  = function(row){
      var id = row.id;
      if( $scope.items[id] ){
        $scope.items[id].selected = false;
        delete $scope.items[id];        
        return;
      }
      $scope.items[id]  = row;
      row.selected      = true;      
    };
    
    $scope.makeOrder = function(rows){      
      $wndMng.show($scope.orderWnd);
    };
    
    $scope.sendOrders = function(){
      var count = 0;
      $wndMng.hide($scope.orderWnd);
      
      $user.orderParts($scope.items).then(
        function(answer){
          var status = answer.status;
          var errors = answer.error;
          
          for(var i in status){
            for(var r in $scope.items){
              var item = $scope.items[r];
              if( item.id === i ){
                item.hide = true;
                $scope.items[r] = undefined;
                delete $scope.items[r];
                count ++;
              }
            }
          }
          
          for(var e in errors){
            $notify.error('Ошибка заказа','Деталь не была добалвена в заказ');
          }          
          
          $notify.info('В заказе', count + ' позиций были добавлены в заказ');
        }
      );
    };*/
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;        
        if( $user.isLogin && $scope.tableParams ){
          $scope.tableParams.reload();          
        }
     });   
     
     /*$scope.$watch('items',
      function(newVal){
        var cnt = 0;
        for(var i in newVal){
          if( newVal.hasOwnProperty(i)){
            cnt++;            
          }
        };
        $scope.selected = cnt;        
        return newVal;
      },true
     );*/
     
}]);


/* global atcCS, ObjectHelper, eventsNames */

atcCS.controller( 'partsSearch', [
    '$scope', '$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', '$events', 'partOutFilter', '$notify', '$q', '$log', 'tableViewData',
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, $events, $partOut, $notify, $q, $log, tableViewData ) {
    'use strict';    
    var brands = false;
    var searchEvents = $events.get(eventsNames.eventsSearch());
    $scope.loading    = {};    
    $scope.data       = [];
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.brand      = $routeParams.brand      || false;
    $scope.analogShow = $user.analogShow;
    $scope.markup     = $user.activeMarkup || 0;
    $scope.markupName = $user.activeMarkupName || '';
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.articulCmp = $scope.searchText.toUpperCase();
    
    $snCtrl.change($scope.searchText); 
    
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
    
    load();
}]);
/* global atcCS */

atcCS.controller( 'searchControl', [
  '$scope','$filter', 'User' ,'$routeParams','$rootScope',
  function($scope,$filter,$user,$routeParams,$rootScope ) {
    'use strict';    
    $scope.query  = "";
    var defaultMarkup = {n:'Без наценки',v:0};
    
    $scope.analog = {
      analogShow: $user.analogShow,
    };    
    $scope.markup = {
      values:   $user.markup,
      selected: JSON.stringify(defaultMarkup)
    }; 
    
    $scope.basket = {
      values: $user.baskets,
      selected: null
    }; 
    
    $scope.markup.values.unshift(defaultMarkup);
    setActiveBasket();
    
    function setActiveBasket(){      
      $user.baskets.every( function(item){      
        if( item.active ){
          $scope.basket.selected  = item.id + "";
          return false;
        }
        return true;
      });    
    }
    
    $('body').on('click',function(){
      $rootScope.$broadcast('onBgClick',{});
    });
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.basket.values = $user.baskets;
        $scope.markup.values = $user.markup;
        setActiveBasket();
        $scope.markup.values.unshift(defaultMarkup);
     });
    
    $scope.$watch('analog.analogShow',
      function(newVal,oldVal){        
        if( oldVal === newVal ){
          return newVal;
        }
        $rootScope.$broadcast('analogStateChange', {
          value: newVal
        });        
    });      
    
    $scope.$watch('markup.selected',
      function(newVal,oldVal){        
        if( oldVal === newVal ){
          return newVal;
        }
        var value = JSON.parse(newVal);        
        $rootScope.$broadcast('markupValueChange', {
          value: value.v,
          name: value.n
        });
    });
    
    $scope.$watch('basket.selected',
      function(newVal,oldVal){        
        if( !oldVal || (oldVal === newVal) ){
          return newVal;
        }
        $rootScope.$broadcast('basketValueChange', {
          value: newVal
        });
    });
        
}]);


atcCS.directive('modal', function (){
  return {
    require: "ngModel",    
    restrict: 'E',
    replace: true,    
    transclude: true,
    templateUrl: '/modal-window.html',
    scope: true,
    link: function link(scope, element, attrs, modelCtrl){
      scope.title = attrs.title;

      scope.$watch(function(){
          return modelCtrl.$viewValue;}, 
        function( newVal ){
          if( newVal === true ){
            $(element).modal({
              backdrop: false,
              show: true
            });
          } else {
            $(element).modal('hide');
          }
        });
    }
  };
} );

atcCS.directive('inject', function(){
  return {
    link: function($scope, $element, $attrs, controller, $transclude) {
      if (!$transclude) {
        throw minErr('ngTransclude')('orphan',
         'Illegal use of ngTransclude directive in the template! ' +
         'No parent directive that requires a transclusion found. ' +
         'Element: {0}',
         startingTag($element));
      }
      var innerScope = $scope.$new();
      $transclude(innerScope, function(clone) {
        $element.empty();
        $element.append(clone);
        });
      }
      
    };
});



atcCS.directive('scheckbox', function (){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: [
      '<div class="scheckbox">',
      '  <label for="{{name}}_id">{{label}}</label>',
      '  <span class="scb-box glyphicon glyphicon-unchecked" ng-click="toggle()"></span>',
      '  <input type="checkbox" name="{{name}}" id="{{name}}_id" ng-model="state" />',
      '</div>'].join(''),
    transclude: 'element',
    scope: {
      value: "@",
      label: "@",
      name: "@"      
    },
    controller: function controller($scope, $element, $attrs, $transclude){      
      $scope.state = true;
      $scope.box = $($element).find('span.scb-box');

      $scope.toggle = function toggle(){        
        $scope.state = ! $scope.state; 
      };

      $scope.change = function change(){
        if( $scope.state){
          $($scope.box).removeClass('glyphicon-unchecked');
          $($scope.box).addClass('glyphicon-check');
        } else {
          $($scope.box).addClass('glyphicon-unchecked');
          $($scope.box).removeClass('glyphicon-check');
        }        
      };
      
    },    
    link: function link(scope, element, attrs, modelCtrl){
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.state = newVal;
          return newVal;
      });

      scope.$watch(
        function(scope) { return scope.state; },
        function(newVal){
          modelCtrl.$setViewValue(newVal);
          scope.change();
          return newVal;
      });
    }
  };
} );



atcCS.directive( 'editable',['$events', function ($events){
  return {
    restrict: 'A',    
    replace: true,
    transclude:true,
    template: '<span class="editable-element"><span class="editable-text" ng-transclude/><input class="editable-input" type="text" value={{text}} /><span class="editable-input-resize"/><button class="editable-start"><span class="glyphicon glyphicon-pencil"></span></button></span>',
    scope: {      
      eVal:"="      
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      var btn = angular.element($element).children("button.editable-start");      
      var txt = angular.element($element).children("span.editable-text");      
      var input = angular.element($element).children("input.editable-input");      
      var resize= angular.element($element).children("span.editable-input-resize");      
      
      $scope.resize = resize;
      $scope.input  = input;
      
      btn.on('click', function(event){
        input.val(txt.text());
        input.width(txt.width());
        $element.toggleClass('edit');
        input.focus();    
        event.stopPropagation();
        return false;
      });
      
    },
    link: function link(scope, element, attrs, modelCtrl, transclude){       
      scope.input.keypress(function(event){        
        scope.resize.text(scope.input.val());
        scope.input.width(scope.resize.width());
        
        if (event.which === 13) {
          console.log(scope);
          element.removeClass('edit');  
          scope.$apply(function(){
            scope.eVal = scope.input.val();            
          });           
        }
      });  
      
    }
  };
}] );





/* global atcCS */

atcCS.directive( 'modelChange',[function (){
    'use strict';
  return {
    restrict: 'A',
    require: "ngModel",
    replace: false,
    transclude:false,
    template: '',
    scope: false,   
    controller: function controller($scope, $element, $attrs){      
    },
    link: function link(scope, element, attrs, modelCtrl, transclude){ 
      
      scope.$watch(function(modelCtrl){return modelCtrl.$viewValue ;},
      function(oldVal,newVal){
        console.log(123);
        if( angular.equals(oldVal, newVal) ){
          return;
        }
        
        console.log("asd");
        if( scope.onModelChaange instanceof Function ){          
          scope.onModelChaange(oldVal,newVal, modelCtrl);
        }
      }, true);
    }
  };
}] );





/* global ObjectHelper */ 

atcCS.directive('searchLine', [
  'User','$wndMng','$articulWnd', '$searchDropdown','$location','storage','$events',
  function ($user, $wndMng, $articulWnd, $searchDropdown,$location, $storage, $events){
  return {
    require: "ngModel", 
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: '/search-line.html',
    transclude: true,
    scope: true,
    controller: function controller($scope, $element, $attrs, $transclude){
      var icons = $($element).find("div.search-icons");
      var cars  = icons.find('button#search-cars');    
      var subs  = icons.find('button#search-sub');    
      var cnfg  = icons.find('button#search-cfg');    
      var search= icons.find('button#search-request');    
      var input = $($element).find("input");
      
      $scope.history  = $storage.get('history') || new Array(0);
      $scope.helper   = [];
      $scope.keyTimer = false;
      $scope.isAdmin  = $user.isAdmin;

      $scope.filter = ''; 
      $scope.typeFilter = false;
      $scope.typeInfo = false;
      $scope.events = $events.get(eventsNames.eventsSearch());
      //Создание структур данных      
      $scope.treeModel = {
          text: "Категории",
          type: 'request',
          url: $user.getUrl('helper','get-groups'),
          data: {path:"",type:""}
        };
        
      $scope.typeSelector = {
          text: "Список автомобилей",
          type: 'request',
          url: $user.getUrl('helper','get-mmt'),          
          data: {path:""}
        };        
      
      $scope.typeSelected = function(data){
        function response(answer){          
          $scope.typeInfo = answer;
          $scope.typeFilter = data;
          $wndMng.show($scope.treeWnd);
        };
        
        $user.findTypeDescr(data,response);        
      };
      
      $scope.groupSelected = function(data,item,lscope,event){
        var target = $(event.target);
        
        if( target.hasClass('search-btn') ){
          input.val( data['number'] );
          input.trigger('change');          
          return;
        }
        if( target.hasClass('info-btn') ){
          $articulWnd.requestInfo(data['aid'],$scope.treeWnd,data['number']);
          return;
        }
        
        console.log(event);
      };
      //Создание дополнительных отображений
      $searchDropdown.setParent($element);
      
      $scope.carsWnd = $wndMng.createWindow({
        title: "Подобрать по автомобилю",
        vPos: cars.offset().top + cars.position().top + cars.height(),
        hPos: cars.offset().left + cars.position().left - cars.width(),
        hSize: '25%',
        vSize: '40%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        show: false
      });

      $scope.treeWnd = $wndMng.createWindow({
        title: "Выбрать по каталогу",
        vPos: $scope.carsWnd.vPos,
        hPos: $scope.carsWnd.hPos - $scope.carsWnd.hSize,
        hSize: '25%',
        vSize: '40%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        show: false
      });
      
      $scope.cfgWnd = $wndMng.createWindow({
        title: "Настройки",
        vPos: cnfg.offset().top + cnfg.position().top + cnfg.height(),
        hPos: cnfg.offset().left + cnfg.position().left - cnfg.width()*5,
        hSize: '10%',
        vSize: '30%',
        hAlign: 'right',
        vAlign: 'top',
        hideIfClose: true,
        show: false
      });

      //Установка темплейтов
      $wndMng.setBodyByTemplate($scope.carsWnd, '/parts/_car-select-part.html',   $scope);
      $wndMng.setBodyByTemplate($scope.treeWnd, '/parts/_car-select-group.html',  $scope);      
      $wndMng.setBodyByTemplate($scope.cfgWnd,  '/parts/_settings.html',          $scope);
      $searchDropdown.setTemplate('/parts/_search-dropdown-part.html',            $scope);
      //Установка слушателей
      cars.click( toggle($scope.carsWnd) ); 
      subs.click( $searchDropdown.toggle );
      cnfg.click( toggle($scope.cfgWnd) ); 
      search.click( onSearchClick );
      input.keydown(onKeyDown);      
      
      $scope.onArticulSelect = function (number){
        input.val( number );
        input.trigger('change'); 
        $searchDropdown.hide();
      };
      
      $scope.onDropDownInfo = function (aid,number){
        $articulWnd.requestInfo(aid,$scope.treeWnd,number);
      };
      
      $scope.onStartSearch = function(){
        console.log("StartSearch");
        var searchText  = input.val();
        var clearText   = String(searchText).replace(/\W*/gi,"");
        
        ObjectHelper.addUniq($scope.history, clearText);
        $scope.history.splice(20);        
        $storage.set('history',$scope.history);        
        
        $searchDropdown.hide();
        $scope.$evalAsync(function() {
          $location.path('brands/'+clearText);
        });        
      };
      
      $scope.loadPrices = function(){        
        $wndMng.show($scope.priceWnd);        
      };
      
      function onSearchClick(event){
        $searchDropdown.hide();
        $scope.onStartSearch();
        return;
      }
      
      function onKeyDown(event){        
        if( $scope.keyTimer ){
          clearTimeout($scope.keyTimer);
        }
        
        if( event.keyCode === 13 ){
          $scope.onStartSearch();
          return;
        }
        $scope.keyTimer = setTimeout(typingTimerOn,700);
      };
      
      function typingTimerOn(event){        
        $user.getTypingHelper( input.val(), function (data){
          if( (data instanceof Array) && data.length ){
            $scope.helper = data;
            $searchDropdown.show();
          }          
        });
      };  
      
      function toggle(window){
        return function(){
          $wndMng.toggle(window);
        };
      }
      
      $scope.events.setListner("SetSearchText", function(event, args){
        input.val(args);
      });
      
      $scope.events.setListner("StartSearchText", function(event, args){
        input.val(args);
        $scope.onStartSearch();
      });
    },    
    link: function link(scope, element, attrs, modelCtrl){  
      
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.text = newVal;          
          return newVal;
      });

      scope.$watch("text",
        function(newVal){          
          modelCtrl.$setViewValue(newVal);
          return newVal;
      },true);
    }
  };
}] );
/*
 * Измененное поле ввода текста
 */
atcCS.directive('sinput', function (){ 
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: '/parts/_sinput.html',
    transclude: false,    
    scope: {
      placeholder: "@",
      value: "@",
      name: "@",
      submit: "@",
      submitFunction: "=",
      changeFunction: "=",
      step: "@",
      min: "@",
      max: "@",
      type: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){   
      var input     = $($element).children('input');
      $scope.model  = null;

      var onFocus = function(){        
        $($element).addClass('active');
      };

      var onBlur = function(){
        $($element).removeClass('active');
      };

      var onKeyPress = function(event){
        
        if( event.keyCode === 13 ){
          $scope.submitFunction(event);
        }
      };

      input.on('focus',onFocus);
      input.on('blur',onBlur);
      
      if( $scope.submitFunction ){
        input.on('keypress',onKeyPress);
      }

    },
    /*compile: function compile(templateElement, templateAttrs){
    },*/
    link: function link(scope, element, attrs, modelCtrl){
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){          
          scope.model = newVal;
          return newVal;
      });

      scope.$watch(
        function(scope) { return scope.model; },
        function(newVal, oldVal){
          
          if( scope.changeFunction && !scope.changeFunction(newVal) ){
            return oldVal;
          }
          modelCtrl.$setViewValue(newVal);          
          return newVal;
      });
    }
  };
} );
/* global atcCS, ObjectHelper */

function tableViewFactory($rootScope, $log, $filter){
  return tableViewCtrl;
  
  function tableViewCtrl($conf){
    
    var self = this;
    
    function sortGroups(sort){
      return function(headA, headB){
        if( headA.name > headB.name ){
          return 1;
        } else if( headA.name < headB.name ){
          return -1;
        }
        return 0;
      };
    }
    
    function sortRows(sort){
      
      function isNumeric(obj) {
        return !isNaN(obj - parseFloat(obj));
      }
      
      function calcWeight(rowA, rowB, sort){
        var weightA = 0;
        var weightB = 0;        
        var A,B;
        
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
    
    function reSort(obj){
      self.$rowGroups.sort(self.sortGroups(obj));
      self.$data.sort(self.sortRows(obj));      
    }
    
    function addRowGroup($group, $data){      
      for(var i in $data){        
        $data[i]['$group'] = $group;
      }
    }
    
    function addRowData($data){
      for(var i in $data){
        self.$data.push($data[i]);
      }
    }
    
    function addRowGroupItem(name){
      
      for(var i in self.$rowGroups){
        if( self.$rowGroups[i].name === name ){
          return;
        }
      }
      
      self.$rowGroups.push({
          name: name, 
          show: true, 
          extend: false});
    }
    
    function addData($newData){
      
      for(var mKey in $newData){
        var data = $newData[mKey];        
        addRowGroup(mKey, data);
        addRowData(data);
        addRowGroupItem(mKey);        
      }
      
      self.reSort(self.sort);
    }
    
    function initDefault($init){      
      self.$columns    = {};
      self.$rowGroups  = [];
      self.$rows       = [];
      self.$data       = [];
      self.hlight      = {};
      self.template    = {};
      self.addData     = addData;
      self.sortGroups  = sortGroups;
      self.sortRows    = sortRows;
      self.reSort      = reSort;
      self.filter      = undefined;
      self.sort        = {};
      
      for(var i in $init){
        self[i] = $init[i];
      }
    }
    
    initDefault($conf);
    
    return self;
    
  }
  
}

atcCS.factory('tableViewData', ['$rootScope', '$log', '$filter', tableViewFactory]);


atcCS.directive('tableTemplate', function ($compile){
  return {    
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: "", 
    transclude: false,    
    scope: {
      tpl: "=template",
      row: "=data",
      scp: "=parentScope"
    },
    link: function(scope, element, attrs){
      var newScope = scope.scp.$new(false);
      newScope.row = scope.row;
      element.replaceWith( $compile(scope.tpl)(newScope) );      
    }    
  };
} );

function tableViewController($compile, $parse, $sce){
  return function($scope, $element, $attrs, $transclude){        
    var model         = $scope.bindModel;    
    
    $scope.$columns   = model.$columns;
    $scope.$rows      = model.$rows;
    $scope.$rowGroups = model.$rowGroups;
    $scope.$sort      = model.sort;
    $scope.$data      = model.$data;
    $scope.template   = model.template;
    
    
    $scope.isHiLight = function(row){
      var flag = true;
      
      for( var hKey in model.hlight){
        if( (!model.hlight[hKey]) || ( String(row[hKey]).toUpperCase() !== String(model.hlight[hKey]).toUpperCase() )){
          flag = false;
        }
      }
      return flag;
    };
    
    $scope.onToggle = function(item){
      item.show = !item.show;
      return false;
    };
    
    $scope.onSortClick = function(event,key){
      var add = event.ctrlKey;
      var hasVal = $scope.$sort.hasOwnProperty(key);
      var val = hasVal?($scope.$sort[key]):1;
      var newVal = (val*-1);
              
      if( !add ){
        $scope.$sort = {};
      }
      
      $scope.$sort[key] = newVal;     
      model.reSort($scope.$sort);
    };
    
    $scope.sortDir = function(key){
      return ($scope.$sort[key] || 0);
    };
    
    $scope.getTemplate = function (key){           
      return ($scope.template[key] || "<span>{{row."+key+"}}</span>");
    };
    
    $scope.getColumnsCount = function (){
      return Object.keys($scope.$columns).length;
    };
    
    $scope.dataFilter = function(data){
      if( model.filter ){
        return model.filter(data);
      }      
      return true;
    };
    
  };
}

function tableViewDirective ($compile,$parse, $sce){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: "/table-view.html",
    transclude: false,
    scope: {
      bindModel: "=ngModel",
      extScope: "=ngExtrScope"
    },
    controller: tableViewController($compile,$parse,$sce)    
  };
}

atcCS.directive('tableView', ["$compile", "$parse", "$sce", tableViewDirective] );



atcCS.directive( 'tileSelector',['$http', function ($http){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: '',
    transclude: false,
    templateUrl: '/parts/_tile-selector.html',
    scope: {
      wsize: "@",
      textFilter: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      $scope.tiles = {};      
      $scope.loaded = true;
      
      $scope.update = function(){
        var width = $($element).width();
        var workspaceWidth = Math.max(0,(width - width*0.05 - $scope.wsize*10));
        var maxTileWidth = Math.ceil(workspaceWidth / $scope.wsize);
        var maxTileHeight = maxTileWidth;
        
        var element = $($element);
        element.html('');
        
        for(var text in $scope.tiles){
          var data = $scope.tiles[text];
          var tile = $('<div></div>');
          
          tile.addClass('tile-selector tile');
          tile.text(text);
          tile.attr('data', data);
          tile.css('width',maxTileWidth);
          tile.css('height',maxTileHeight);          
          tile.css('line-height',maxTileHeight+"px");          
          
          element.append(tile);
        }
        
        console.log(width, maxTileWidth);
      };
     
     $scope.update();
    },
    link: function link(scope, element, attrs, modelCtrl){
      /*scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.data = newVal;
          scope.update();
          return newVal;
      });*/
    }
  };
}] );





atcCS.directive( 'tree',['$http', function ($http){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: '',
    transclude: false,
    templateUrl: '/parts/_tree-part.html',
    scope: {
      filter: "@",
      onSelect: "="
    }, 
    controller: function controller($scope, $element, $attrs, $transclude){      
      var UL    = $($element);  
      $scope.filterText = false;
      $scope.loaded     = false;

      function itemLoadable(item){
        return !item.subItems && item.url && item.type && (item.type === 'request');
      }

      function serverResponse(item, listItem){
        return function(answer){
          $scope.loaded = false;
          listItem.removeClass('preloader');
          var data = answer && answer.data;
          if( !data ){
            return;
          }
           
          if( data.isRoot === true){
            $scope.clear();
            //$scope.filterText = false;
            delete data.isRoot;            
            $scope.data.subItems = data;
            $scope.data.open = true;
            $scope.update();
            return;
          }
          
          item.subItems = data;
          createItems(data, listItem);          
        };
      };
      
      function serverRequest(item, listItem){
        var request = {
          url: item.url,
          method:       "GET",
          responseType: 'json',
          params: {
            params: {}
          }
        };
        
        if( $scope.loaded ){
          return;
        }
        
        $scope.loaded = true;
        
        for(var i in item.data){
          request.params.params[i] = item.data[i];
        }
        if ( $scope.filterText ){
          request.params.params.filter = $scope.filterText;
        }        
        
        listItem.addClass('preloader');
        $http(request).then( serverResponse(item, listItem) );
      }

      function itemClick(item, listItem){
        return function(event){
          event.stopPropagation();
          $(listItem).toggleClass('open');
          
          if( $(listItem).hasClass('node') ){            
            if( ($scope.onSelect instanceof Function) && (item.data) ){
              $scope.onSelect(item.data,item,$scope,event);
              return;
            }
          }
          
          if( $(listItem).hasClass('open') && itemLoadable(item) ){            
            serverRequest(item,listItem);
          }          
        };
      }

      function createItem( item ){
        var listItem  = $('<li></li>');
        var ul        = $('<ul></ul>');
        var span      = $('<span></span>');
        var text      = item.text || "???";
        
        span.addClass(item.type);        
        
        if( item.open ){
          listItem.addClass('open');
        }
        
        if( item.title ){
          span.attr('title',item.title);          
        }
        
        if( span.hasClass('node') ){
          listItem.addClass('node');
        }
        
        span.html(text);
        listItem.append(span);
        listItem.append(ul);
        
        if( item.subItems ){
          for( var i in item.subItems ){
            $(ul).append( createItem(item.subItems[i]) );
          }          
        }        
        listItem.click( itemClick(item, listItem) );
        
        return listItem;
      }

      function createItems(data, root){
        var answer = "";
        var ul = $(root).find('ul');

        for( var i in data){
          $(ul).append( createItem(data[i]) );
        }
        return answer;
      }

      $scope.update = function (){        
        createItems([$scope.data], UL);
      };
      
      $scope.load = function (){
        if( $scope.data.type === 'request' ){          
          var li = UL.find('li').first();
          li.removeClass('open');
          serverRequest($scope.data,li);
        }
      };
      
      $scope.clear = function (){        
        UL.find('ul').html('');        
        delete $scope.data.open;
        delete $scope.data.subItems;                  
      };
    },
    link: function link(scope, element, attrs, modelCtrl){
      var timer = null;
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.data = newVal;
          scope.update();
          return newVal;
      });
      
      scope.$watch(
        function() {return scope.filter;},
        function(newVal, oldVal){
          var strLen = String(newVal).length;
          
          if (timer){
            clearTimeout(timer);
          }
          
          timer = setTimeout(function(){            
            if( strLen >= 3  ){
              scope.filterText = newVal;            
              scope.load();
              return ;
            }
          }, 1000);
          
          if (strLen < 3){
            scope.clear();
            scope.filterText = false;
            scope.update();
          }
          
         return newVal;
      });
    }
  };
}] );



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


/* global atcCS */
/* global atcCS */

atcCS.filter('partOut',function(){
  return function(items,name,reverse){
    var saveItem = null;
    if( items ) {      
      for(var i in items){
        var txt = (items[i] && items[i].value) || '';
        if( txt === name ){
          saveItem = items[i];
          items.splice(i,1);
        }
      }
      if( saveItem ){
        items.unshift(saveItem);        
      }
    }
    return items;
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

atcCS.service('User',['$http', '$cookies', '$rootScope', '$notify', '$q', '$events',
  function($http, $cookies, $rootScope, $notify, $q, $events){
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
        model.isAdmin = (model.role === 1)?true:false;
        
        setActiveBasket();
        
        $rootScope.$broadcast('userDataUpdate', {});        
        events.broadcast('userDataUpdate',model);
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
  
  model.catalog = new catalogBack($http,$events);
  
  model.news    = new newsBack($http,$events);
  
  init();
  return model; 

}]);

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

/* global atcCS */



var cqEvents = {
  login         : "CQEVENT_LOGIN",
  userData      : "CQEVENT_USER_DATA",
  articulInfo   : "CQEVENT_ARTICUL_INFO",
  findTypeDescr : "CQEVENT_FIND_TYPE_DESCR",
  typingHelper  : "CQEVENT_TYPING_HELPER",
  getBrands     : "CQEVENT_GET_BRANDS",  
  getParts      : "CQEVENT_GET_PARTS",  
  toBasket      : "CQEVENT_TO_BASKET"
};

function cqmEvent(name){
  if( (!name) || !( name instanceof String) ){
    throw new Error("Значение name для события должно быть установлено и быть строкой");
  }
  
  this.name         = name;
  this.url          = null;
  this.method       = null;
  this.responseType = "json";
  this.headers      = null
  this.require      = null
  this.wait         = false;
  this.multiple     = false;
  this.params       = null
  this.data         = null;
  this.promises     = null;
}


/*
 * Сервис для обслуживания модели очереди запросов
 */

function connectionQueueModel($rootScope,$user,$wndMng){
  'use strict';
  var model = {
    Queue       : new Object(),
    Finished    : new Object(),
    After       : new OBject(),
    Registered  : new Array()
  };
  
  model.createEvent = function(name, multiple){
    var event       = new cqmEvent(name);
    event.multiple  = multiple;    
  };
  /**
   * Заполняет структуру события данными
   * @param cqmEvent  event  Объект события
   * @param Object    data   Поля данных
   * @param boolean   append Копировать отсутствующие в структуре события поля
   * @returns {undefined}
   */
  model.fillEvent   = function(event,data,append){
    if( !(data instanceof Object) ){
      throw new Error("Параметр data должне быть объектом значений");
    }
    for(var id in data){
      var value = data[id];
      if( event.hasOwnProperty(id) || append ){
        event.id = value;
      }
    }
  };
  /**
   * Проверяет наличи события в стеке регистрации
   * @param cqmEvent event
   * @returns boolean
   */  
  model.hasEvent      = function( event ){
    var find = false;
    model.Registered.every(function(item){
      if( event.name === item.name ){
        find = true;
        return false;
      }
      return true;
    });
    return find;
  };
  /**
   * Регистрация события в стеке
   * @param cqmEvent event
   * @returns boolean
   * @throws Error Ошибка повторного внесения в список уникального события
   */  
  model.registerEvent = function(event){
    if( !event.multiple || model.hasEvent(event) ){
      throw new Error('Регистрация уже зарегистрированного события');
    }
    model.Registered.push(event);
  };
  
  model.sendRequest = function(name, params, data, fields){
    
  };
  

  return model;
};

atcCS.service('$connectionQueue',['$rootScope',
  function($rootScope){
    return connectionQueueModel($rootScope);
  }
]);
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
/* global atcCS */

function searchNumberControl(){
  'use strict';
  var model = {};

  model.change = function change(value){
    var input = $('input#search-text');    
    input.val( String(value) );
    input.trigger('change'); 
    return;
  };
  
  model.search= function change(value){
    var input = $('input#search-text');    
    var btn   = $('button#search-request');    
    input.val( String(value) );
    input.trigger('change'); 
    btn.click();
    return;
  };

  return model;
};

atcCS.service('searchNumberControl', function(){
  return searchNumberControl();
} );

/* global atcCS */

function storage($rootScope){
  'use strict';
  var model = {
    storage: {}
  };
  
  function clearLocalStorage(){
    if( !isLocalStorageAvailable() ){
      return;
    }
    
    var time = Math.round( (new Date()).getTime() / 1000);
    
    for (var i  in localStorage){  
      var itemTime = parseInt(i);
      if( isNaN(itemTime) ){
        continue;
      }
      
      if( (time-itemTime) > 60*60*12 ) {
        localStorage.removeItem(i);      
      }       
    }
  };
  
  function isLocalStorageAvailable() {
    try {      
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  model.set = function set(name,value){    
    if( (typeof value === 'object') ||
        (typeof value === 'array') ){
      value = angular.toJson(value);
    }    
    if ( isLocalStorageAvailable() ){
      try{
        localStorage.setItem(name,value);        
      } catch(e){
        if( (e.code === 22) || (e.code === 1014) ){
          localStorage.clear(); 
          localStorage.setItem(name,value);
        }
      }
    } else {
      model.storage[name] = value;
    }
    return;
  };
  
  model.get = function get(name){
    var result = null;
    var firstSymbol = null;
    if ( model.storage[name] ){
      result = model.storage[name];
    } else if( isLocalStorageAvailable() ) {
      result = localStorage.getItem(name);
    }
    firstSymbol = String(result).substr(0,1);
    if ( (firstSymbol === '{') || (firstSymbol === '[') ){      
      result = angular.fromJson(result);      
    }
    return result;
  };
  
  clearLocalStorage();

  return model;
};

atcCS.service('storage',[
  '$rootScope', 
  function($rootScope){
    return storage($rootScope);
}]);

/* global atcCS */

/*
 * Сервис для обслуживания модели уведомлений
 */

function tagsModel(){
  'use strict';
  var model = {
    root: null,
    tags: []
  };

  function onClose(model, tag){
    return function(){
      model.removeTag(tag);
    };
  }

  function createTag(model, tag){
    var close_icon = $('<span class="glyphicon glyphicon-remove"></span>');
    var icon = $('<span></span>');
    icon.text(tag.text);
    icon.attr('type',tag.type);
    icon.attr('key',tag.type);
    icon.addClass("tag");
    icon.addClass("icon-" + tag.type);
    icon.append(close_icon);

    $(close_icon).click(onClose(model, tag));

    return icon;
  };

  function clearTags(model){
    model.root.html("");
  };

  model.init = function init(root){
    var model = tagsModel();
    model.root= $(root);
    return model;
  };

  model.pushTag = function (tag){    
    this.tags.push(tag);
    this.updateTags();
  };

  model.removeTag = function (tag){
    for(var i in this.tags){
      if (this.tags[i] === tag){
        this.tags[i] = null;
        delete this.tags[i];
      }
    }
    this.updateTags();
  };

  model.updateTags = function updateTags(){
    clearTags(this);    
    for(var i in this.tags){
      var tag = this.tags[i];      
      this.root.append( createTag(this, tag) );
    }
  };

  model.getTags = function getTags(field, value){
    if( !field || !value){
      return this.tags;
    }
    var answer = [];
    
    for(var i in this.tags){
      var tag = this.tags[i];

      if( tag[field] === value ){
        answer.push(tag);
      }
    }

    return answer;
  };

  model.getTagsOneField = function getTagsOneField(field, value, filtredField){
    var data    = this.getTags(field,value);
    var answer  = [];

    for(var i in data){
      answer.push(data[i][filtredField]);
    }

    return answer;
  };

  model.length = function length(){
    return this.tags.length;
  };

  return model;
};

atcCS.service('tagsControl', function(){
  return tagsModel();
} );
