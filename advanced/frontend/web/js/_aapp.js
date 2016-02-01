"use strict";var atcCS = angular.module('atcCS',['ngCookies','ngRoute']);
atcCS.config(['$httpProvider', function ($httpProvider) {   $httpProvider.defaults.headers.common = {'Accept' : "application/json, text/plain"}; $httpProvider.defaults.headers.common = {'Access-Control-Allow-Origin': 'http://rest.atc58.bit'}; $httpProvider.defaults.headers.common = {'Content-Type' : "application/json;charset=utf-8"}; $httpProvider.defaults.useXDomain = true;  $httpProvider.interceptors.push('atcServerToken'); }]);
atcCS.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { $routeProvider .when('/brands/:searchText', { caseInsensitiveMatch: true, templateUrl: '/search-brands.html', controller: 'brandsSearch', controllerAs: 'atcCS' }); $locationProvider.html5Mode(true);}]);
atcCS.controller( 'searchControl', [ '$scope','$filter', 'User' ,'$routeParams', function($scope,$filter,$user,$routeParams ) {  $scope.markup = null; $scope.query = "3192066200"; }]);atcCS.controller( 'headControl',['$scope','User','$wndMng','$templateCache', function($scope,$user,$wndMng,$templateCache) {  var menu = $(".search-bar");   var window = $wndMng.createWindow({ title: "Авторизация", hPos: 0, vPos: menu.position().top + menu.height(), hSize: $(".view").position().left, vSize: 170, hAlign: 'left', showStatusBar: false, showClose: false, canResize: false, canMove: false, show: !$user.isLogin }); $wndMng.setBodyByTemplate(window, '/parts/_login-part.html', $scope); $scope.show = !$user.isLogin;  $scope.login = { name: $user.name, password: $user.password, remember: true }; $scope.onLogin = function(){   $user.login($scope.login.name,$scope.login.password,$scope.login.remember); $scope.show = !$user.isLogin; return false; }; $scope.$watch( function(){ return $user.isLogin; }, function( newVal ){ $scope.show = !newVal; window.show = !newVal; } ); }]);
atcCS.controller( 'brandsSearch', [ '$scope','$filter', 'User' ,'$routeParams', function($scope,$filter,$user,$routeParams ) {  $scope.searchText = $routeParams.searchText || false;  console.log("Load"); console.log($scope); console.log($routeParams); if( $scope.searchText ){ $user.getBrands( $scope.searchText, serverResponse); }  function serverResponse(data){ console.log(data); } }]);
atcCS.directive('modal', function (){ return { require: "ngModel",  restrict: 'E', replace: true,  transclude: true, templateUrl: '/modal-window.html', scope: true, link: function link(scope, element, attrs, modelCtrl){ scope.title = attrs.title; scope.$watch(function(){ return modelCtrl.$viewValue;},  function( newVal ){ if( newVal === true ){ $(element).modal({ backdrop: false, show: true }); } else { $(element).modal('hide'); } }); } };} );atcCS.directive('inject', function(){ return { link: function($scope, $element, $attrs, controller, $transclude) { if (!$transclude) { throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element)); } var innerScope = $scope.$new(); $transclude(innerScope, function(clone) { $element.empty(); $element.append(clone); }); }  };});/*atcCS.directive('ajaxButton', ['$http','$compile', function ($http,$compile) { return {  restrict: 'E', replace: true,  transclude: true, template: '<button class="ajax-button" ng-transclude ng-click="toggle()"> </button>', scope: { ngModel : "=",  url : "@", data : "@", title : "@", name : "@",  }, controller: function controller($scope, $element, $attrs){ $scope.hide = function hide(){ $scope.window.addClass('hidden'); }; $scope.show = function show(){ var button = angular.element($element); var offset = button.offset(); $scope.window.css('left', offset.left + button.outerWidth()); $scope.window.css('top', offset.top); $scope.window.removeClass('hidden'); }; $scope.toggle = function toggle(){ $scope.window = angular.element($('body').find("#" + $scope.windowName)[0]); if( !$scope.window ){ return; } var show = !$scope.window.hasClass('hidden'); var title = $scope.window.find("h3.ajax-button-header"); var context = $scope.window.find("div.ajax-button-context"); context.html("asdf"); title.html($scope.title); title.html($scope.data + "asd"); if( !show ) { $scope.show(); } else { $scope.hide(); } }; },  link: function link($scope, $element, $attrs, modelCtrl){  $scope.visible = false; $scope.loaded = false; $scope.data = ""; $scope.templateWindow = '<div class="ajax-button-helper hidden"><div class="pointer"></div><h3 class="ajax-button-header"></h3><div class="ajax-button-context"></div></div>'; $scope.windowName = $scope.name + '-ajax-button-window'; var windowAlrearyAppend = $('body').find("#" + $scope.windowName).length !== 0; if( !windowAlrearyAppend ){ var root = angular.element('body'); var window = angular.element($scope.templateWindow); window.attr('id',$scope.windowName); root.append(window); }  $scope.$watch('visible',function(newVal){ if( newVal && !$scope.loaded ){ } return newVal; }); } };}]);*/
atcCS.directive('scheckbox', function (){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, template: [ '<div class="scheckbox">', ' <label for="{{name}}_id">{{label}}</label>', ' <span class="scb-box glyphicon glyphicon-unchecked" ng-click="toggle()"></span>', ' <input type="checkbox" name="{{name}}" id="{{name}}_id" ng-model="state" />', '</div>'].join(''), transclude: 'element', scope: { value: "@", label: "@", name: "@"  }, controller: function controller($scope, $element, $attrs, $transclude){  $scope.state = true; $scope.box = $($element).find('span.scb-box'); $scope.toggle = function toggle(){  $scope.state = ! $scope.state;  }; $scope.change = function change(){ if( $scope.state){ $($scope.box).removeClass('glyphicon-unchecked'); $($scope.box).addClass('glyphicon-check'); } else { $($scope.box).addClass('glyphicon-unchecked'); $($scope.box).removeClass('glyphicon-check'); }  };  },  link: function link(scope, element, attrs, modelCtrl){ scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.state = newVal; return newVal; }); scope.$watch( function(scope) { return scope.state; }, function(newVal){ modelCtrl.$setViewValue(newVal); scope.change(); return newVal; }); } };} );
atcCS.directive('notificationItems', ['Notification', function ($notify){ return {  priority: 0, terminal: false, restrict: 'E', replace: true, template: "<ul></ul>",  transclude: false, scope: false, controller: function controller($scope, $element, $attrs, $transclude){  $scope.itemShow = function(){ var index = $(this).attr('index'); var item = $notify.list[index]; item.new = 0; $(this).children('button').children('span').remove(); };  },  link: function link(scope, element, attrs, modelCtrl){  for(var i = 0; i< $notify.list.length; i++){ var item = $notify.list[i]; var row = $("<li></li>"); var button = $('<button></button>'); item.text.replace(/\"/,''); row.addClass('notification-item'); row.addClass(item.class); row.attr('index',i); $(row).append(button); button.attr('type','button'); button.attr('data-toggle','popover'); button.attr('title','Просмотреть'); button.attr('data-content',item.text); button.addClass('btn'); button.addClass(item.style); button.text(item.head); if( item.new ){ button.prepend( '<span class="glyphicon glyphicon-flag pull-left text-muted"></span>'); } $(element).prepend(row); $(row).on('show.bs.popover',scope.itemShow); } } };}] );
atcCS.directive('searchLine', [ 'User','$wndMng','$articulWnd', '$searchDropdown','$location', function ($user, $wndMng, $articulWnd, $searchDropdown,$location){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, templateUrl: '/search-line.html', transclude: true, scope: { query: "=", }, controller: function controller($scope, $element, $attrs, $transclude){ var icons = $($element).find("div.search-icons"); var cars = icons.find('button#search-cars');  var subs = icons.find('button#search-sub');  var search= icons.find('button#search-request');  var input = $($element).find("input"); $scope.history = ['123','qwrasd3134','1124aasdadf']; $scope.helper = []; $scope.keyTimer = false; $scope.filter = '';  $scope.typeFilter = false; $scope.typeInfo = false;  $scope.treeModel = { text: "Категории", type: 'request', url: $user.getUrl('helper','get-groups'), data: {path:"",type:""} };  $scope.typeSelector = { text: "Список автомобилей", type: 'request', url: $user.getUrl('helper','get-mmt'),  data: {path:""} };   $scope.typeSelected = function(data){ function response(answer){  $scope.typeInfo = answer; $scope.typeFilter = data; $wndMng.show($scope.treeWnd); };  $user.findTypeDescr(data,response);  };  $scope.groupSelected = function(data,item,lscope,event){ var target = $(event.target);  if( target.hasClass('search-btn') ){ input.val( data['number'] ); input.trigger('change');  return; } if( target.hasClass('info-btn') ){ $articulWnd.requestInfo(data['aid'],$scope.treeWnd,data['number']); return; }  console.log(event); };  $searchDropdown.setParent($element);  $scope.carsWnd = $wndMng.createWindow({ title: "Подобрать по автомобилю", vPos: cars.offset().top + cars.position().top + cars.height(), hPos: cars.offset().left + cars.position().left - cars.width(), hSize: '25%', vSize: '40%', hAlign: 'right', vAlign: 'top', hideIfClose: true, show: false }); $scope.treeWnd = $wndMng.createWindow({ title: "Выбрать по каталогу", vPos: $scope.carsWnd.vPos, hPos: $scope.carsWnd.hPos - $scope.carsWnd.hSize, hSize: '25%', vSize: '40%', hAlign: 'right', vAlign: 'top', hideIfClose: true, show: false });  $wndMng.setBodyByTemplate($scope.carsWnd, '/parts/_car-select-part.html', $scope); $wndMng.setBodyByTemplate($scope.treeWnd, '/parts/_car-select-group.html', $scope); $searchDropdown.setTemplate('/parts/_search-dropdown-part.html', $scope);  cars.click( toggle($scope.carsWnd) );  subs.click( $searchDropdown.toggle ); search.click( onSearchClick ); input.keydown(onKeyDown);   $scope.onArticulSelect = function (number){ input.val( number ); input.trigger('change');  $searchDropdown.hide(); };  $scope.onDropDownInfo = function (aid,number){ $articulWnd.requestInfo(aid,$scope.treeWnd,number); };  $scope.onStartSearch = function(){ var searchText = input.val(); $searchDropdown.hide(); $scope.$apply(function() { $location.path('brands/'+searchText);  });  };  function onSearchClick(event){ $searchDropdown.hide(); $scope.onStartSearch(); return; }  function onKeyDown(event){  if( $scope.keyTimer ){ clearTimeout($scope.keyTimer); }  if( event.keyCode === 13 ){ $scope.onStartSearch(); return; } $scope.keyTimer = setTimeout(typingTimerOn,700); };  function typingTimerOn(event){  $user.getTypingHelper( input.val(), function (data){ if( (data instanceof Array) && data.length ){ $scope.helper = data; $searchDropdown.show(); }  }); };   function toggle(window){ return function(){ $wndMng.toggle(window); }; } },  link: function link(scope, element, attrs, modelCtrl){  scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.text = newVal;  return newVal; }); scope.$watch("text", function(newVal){  modelCtrl.$setViewValue(newVal); return newVal; },true); } };}] );
/* * Измененное поле ввода текста */atcCS.directive('sinput', function (){  return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, templateUrl: '/parts/_sinput.html', transclude: false,  scope: { placeholder: "@", value: "@", name: "@", submit: "@", submitFunction: "&" }, controller: function controller($scope, $element, $attrs, $transclude){  $scope.model = null; var onFocus = function(){  $($element).addClass('active'); }; var onBlur = function(){ $($element).removeClass('active'); }; var onKeyPress = function(event){ if( event.charCode === 13 ){ $scope.submitFunction(event); } }; $($element).children('input').on('focus',onFocus); $($element).children('input').on('blur',onBlur); if( $scope.submit ){ $($element).children('input').on('keypress',onKeyPress); } }, /*compile: function compile(templateElement, templateAttrs){ },*/ link: function link(scope, element, attrs, modelCtrl){ scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){  scope.model = newVal; return newVal; }); scope.$watch( function(scope) { return scope.model; }, function(newVal){  modelCtrl.$setViewValue(newVal);  return newVal; }); } };} );
atcCS.directive( 'tileSelector',['$http', function ($http){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, template: '', transclude: false, templateUrl: '/parts/_tile-selector.html', scope: { wsize: "@", textFilter: "@" }, controller: function controller($scope, $element, $attrs, $transclude){ $scope.tiles = {}; $scope.loaded = true; $scope.update = function(){ var width = $($element).width(); var workspaceWidth = Math.max(0,(width - width*0.05 - $scope.wsize*10)); var maxTileWidth = Math.ceil(workspaceWidth / $scope.wsize); var maxTileHeight = maxTileWidth; var element = $($element); element.html(''); for(var text in $scope.tiles){ var data = $scope.tiles[text]; var tile = $('<div></div>'); tile.addClass('tile-selector tile'); tile.text(text); tile.attr('data', data); tile.css('width',maxTileWidth); tile.css('height',maxTileHeight); tile.css('line-height',maxTileHeight+"px"); element.append(tile); } console.log(width, maxTileWidth); }; $scope.update(); }, link: function link(scope, element, attrs, modelCtrl){ /*scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.data = newVal; scope.update(); return newVal; });*/ } };}] );
atcCS.directive( 'tree',['$http', function ($http){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, template: '', transclude: false, templateUrl: '/parts/_tree-part.html', scope: { filter: "@", onSelect: "=" },  controller: function controller($scope, $element, $attrs, $transclude){  var UL = $($element);  $scope.filterText = false; $scope.loaded = false; function itemLoadable(item){ return !item.subItems && item.url && item.type && (item.type === 'request'); } function serverResponse(item, listItem){ return function(answer){ $scope.loaded = false; listItem.removeClass('preloader'); var data = answer && answer.data; if( !data ){ return; }  if( data.isRoot === true){ $scope.clear();  delete data.isRoot;  $scope.data.subItems = data; $scope.data.open = true; $scope.update(); return; }  item.subItems = data; createItems(data, listItem);  }; };  function serverRequest(item, listItem){ var request = { url: item.url, method: "GET", responseType: 'json', params: { params: {} } };  if( $scope.loaded ){ return; }  $scope.loaded = true;  for(var i in item.data){ request.params.params[i] = item.data[i]; } if ( $scope.filterText ){ request.params.params.filter = $scope.filterText; }   listItem.addClass('preloader'); $http(request).then( serverResponse(item, listItem) ); } function itemClick(item, listItem){ return function(event){ event.stopPropagation(); $(listItem).toggleClass('open');  if( $(listItem).hasClass('node') ){  if( ($scope.onSelect instanceof Function) && (item.data) ){ $scope.onSelect(item.data,item,$scope,event); return; } }  if( $(listItem).hasClass('open') && itemLoadable(item) ){  serverRequest(item,listItem); }  }; } function createItem( item ){ var listItem = $('<li></li>'); var ul = $('<ul></ul>'); var span = $('<span></span>'); var text = item.text || "???";  span.addClass(item.type);   if( item.open ){ listItem.addClass('open'); }  if( item.title ){ span.attr('title',item.title);  }  if( span.hasClass('node') ){ listItem.addClass('node'); }  span.html(text); listItem.append(span); listItem.append(ul);  if( item.subItems ){ for( var i in item.subItems ){ $(ul).append( createItem(item.subItems[i]) ); }  }  listItem.click( itemClick(item, listItem) );  return listItem; } function createItems(data, root){ var answer = ""; var ul = $(root).find('ul'); for( var i in data){ $(ul).append( createItem(data[i]) ); } return answer; } $scope.update = function (){  createItems([$scope.data], UL); };  $scope.load = function (){ if( $scope.data.type === 'request' ){  var li = UL.find('li').first(); li.removeClass('open'); serverRequest($scope.data,li); } };  $scope.clear = function (){  UL.find('ul').html('');  delete $scope.data.open; delete $scope.data.subItems;  }; }, link: function link(scope, element, attrs, modelCtrl){ scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.data = newVal; scope.update(); return newVal; });  scope.$watch( function() {return scope.filter;}, function(newVal, oldVal){ var strLen = String(newVal).length;   if( newVal && (newVal !== oldVal) && (strLen >= 2) ){ scope.filterText = newVal;  scope.load(); return newVal; }  scope.clear(); scope.filterText = false; scope.update();  return newVal; }); } };}] );
 atcCS.factory('atcServerToken', ['$q', '$rootScope', '$injector', function ($q, $rootScope, $injector) { var interceptor = { request: function(config){ if( config.params ){ config.params._format = 'json'; config.responseType = 'json'; }  if( $rootScope.user.isLogin ){ config.headers.Authorization = 'Bearer ' + $rootScope.user.accessToken; } return config; }, response: function (response){ var accessToken = response && response.data && response.data["access-token"] || null; if( accessToken ){ $rootScope.user.accessToken = accessToken; $rootScope.user.isLogin = true; } return response; }, responseError: function(response){ if( response.status === 401){ $rootScope.user.accessToken = null; $rootScope.user.isLogin = false; } }  }; return interceptor;}]);

/* * Модель пользователя системы */function userModel(){   return { name: 'Йожыг', surname: 'Йожыгов', company: 'ООО Йожыная ферма',  markup: [ { v:15,n:'Простая'}, { v:10,n:'Сложная'} ], alerts: [ /*{head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1}, {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1}, {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1},*/ ], analogShow : false,  isLogin : false,  accessToken : false   }; }
/* * Сервис для обслуживания модели пользователя и общения с сервером */atcCS.service('User',['$http', '$cookies', '$rootScope', 'Notification', function($http, $cookies, $rootScope, $notify){   var URL = "http://rest.atc58.bit/index.php"; var model = new userModel(); function URLto(controller,funct,local){ return (local?"":URL) + "?r=" + controller + "/" + funct; } function loadFormCookies(){ var name = $cookies.get('name'); var pass = $cookies.get('pass'); console.log("Login from Cookies", name, pass); if ( name && pass ){ console.log("Name:",name,"Pass:",pass); model.login(name,pass,true).then(function(){ model.update(); }); return true; }  return false; }; model.getUrl = function getUrl(controller, funct){ return URLto(controller, funct); }; model.login = function login(name,password,remember){ var req = { method: 'GET', url: URLto('login','login'), responseType: 'json',  headers: {  'Authorization': "Basic " + btoa(name + ":" + password) }, params: {  params: 'get-token' + (remember?'-hash':'') } };  return $http(req).then( function success(response){  var hash = response && response.data && response.data['hash'] || null;  if( hash && remember ){ var now = new Date(); var expires = new Date( now.getTime() + 30*24*3600 );  $cookies.put('name',name,{expires:expires}); $cookies.put('pass',hash,{expires:expires}); }  }, function error(response){ $notify.addItem("Ошибка","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля."); });  }; model.update = function update(){  var req = { method: 'GET', url: URLto('login','get-data'),  params: {  params: 'get-data' } }; if( model.isLogin === false ){ return false; } console.log("User data update"); return $http(req).then(function succes(response){  }, function error(response){  });  }; model.findParts = function findDescr(tags){ var req = { method: 'POST', url: URLto('helper','parts-search'), responseType: 'json', params:{ params:{ } }, data: {  descr: tags.getTagsOneField('type', 'descr', 'id'), mfc: tags.getTagsOneField('type', 'mfc', 'id'), model: tags.getTagsOneField('type', 'model', 'id')  } }; return $http(req); }; model.findDescr = function findDescr(text, tags){ var req = { method: 'POST', url: URLto('helper','description-search'), responseType: 'json', params: { params: { descr: text, mfc: tags.getTagsOneField('type', 'mfc', 'id'), model: tags.getTagsOneField('type', 'model', 'id') } } }; return $http(req); }; model.getArticulInfo = function getArticulInfo(articul_id){ var req = { method: 'GET', url: URLto('helper','articul-info'), responseType: 'json', params: { params: { articul_id: articul_id } } }; return $http(req); }; model.findMModel = function findMModel(text, tags){ var req = { method: 'POST', url: URLto('helper','mmodel-search'), responseType: 'json',  params: { params: { mmodel: text, mfc: tags.getTagsOneField('type', 'mfc', 'id'), model: tags.getTagsOneField('type', 'model', 'id') } } }; return $http(req); }; model.findMFCs = function findMFCs(tags){ var req = { method: 'POST', url: URLto('helper','mfcs-search'), responseType: 'json', params: { params: { model: tags.getTagsOneField('type', 'model', 'id') } } }; return $http(req); };  model.findTypeDescr = function findTypeDescr(data, response){ var req = { method: 'GET', url: URLto('helper','get-type-description'), responseType: 'json', params: { params: { type: data } } };  function serverResponse(answer){  var data = answer && answer.data; var responseData = new Array();  if( !data ){ return false; }  if( data instanceof Array ){ for(var i in data){ var item = data[i]; responseData.push({  name : item.name, power : item.power, volume: item.volume, cyl : item.cylinder, val : item.valves, fuel : item.fuel, drive : item.drive, start : new Date(item.start), end : new Date(item.end) }); } } else { responseData.push({  name : data.name, power : data.power, volume: data.volume, cyl : data.cylinder, val : data.valves, fuel : data.fuel, drive : data.drive, start : new Date(data.start), end : new Date(data.end) }); } response(responseData);  } $http(req).then(serverResponse); };  model.getTypingHelper = function getTypingHelper(typedText, callback){ var req = { method: 'GET', url: URLto('helper','get-typed-helper'), responseType: 'json', params: { params: String(typedText) } };  function serverResponse(answer){ var data = answer && answer.data; if( data && (callback instanceof Function) ){ callback(data); }  } $http(req).then(serverResponse); };  model.getBrands = function getBrands(searchText, callback){ var req = { method: 'GET', url: URLto('search','get-brands'), responseType: 'json', params: { params: String(searchText) } };  function serverResponse(answer){ var data = answer && answer.data; if( data && (callback instanceof Function) ){ callback(data); }  } $http(req).then(serverResponse); }; $rootScope.user = model; for(var index in model.alerts){ $notify.addObj(model.alerts[index]); } loadFormCookies();   return model; }]);
/** * @syntax wndStruc(callbackFunction) * @param {Object} callbackFunction * @returns {Object} */function wndStruc(callbackFunction){  var model = { _id: 0, _manager: null, _wnd_data: {}, title: "", body: null, hPos: 300, vPos: 200, hSize: 600, vSize: 200, vAlign: "none", hAlign: "none", showClose: true, showMin: true, showStatusBar: true, canMove: true, canResize: true, show: true, hideIfClose: false, setId: function(id){ if( this._id === 0 ){ this._id = id; return id; } throw new Error("Попытка изменить ID существующего окна"); }, getId: function(){ return this._id; } }; var struct = new Object(); if( (callbackFunction === undefined) || !(callbackFunction instanceof Function) ){ throw new Error("Создание дескриптора без оконной функции"); }  function createGetter(name){ return function getter(){ return this['_' + name]; }; } function createSetter(name,struct){ return function setter(newVal){ var oldVal = this['_' + name]; this['_' + name] = newVal; callbackFunction(struct, name, newVal, oldVal); return newVal; }; } for(var name in model){ var value = model[name]; if( (String(name).substr(0,1) === "_") || (value instanceof Function) ){ Object.defineProperty(struct,name,{ enumerable: (value instanceof Function)?true:false, writable: true, value: value }); continue; }  Object.defineProperty(struct,'_' + name,{ enumerable: false, writable: true, value: value }); Object.defineProperty(struct,name,{ get: createGetter(name), set: createSetter(name, struct) });  } return struct;};function wndManagerClass($templateCache, $compile){  var model = { _idCnt: 0, _stack: [], _inTray: [], area: "body", tray: "div.tray-bar" }; function initDrag(wnd, area, header, resize){ $(area).on({ "mouseup" : function(event){ delete(wnd._wnd_data.drag); delete(wnd._wnd_data.resize); }, "mousemove" : function (event){  if( ( event.buttons === 1 ) && ( wnd._wnd_data.drag ) && ( wnd.canMove ) && ( !wnd._wnd_data._minimize ) ){  var dx = event.pageX - wnd._wnd_data.drag.posX; var dy = event.pageY - wnd._wnd_data.drag.posY; wnd._wnd_data.drag = { posX: event.pageX, posY: event.pageY }; wnd.hPos += dx; wnd.vPos += dy;  event.stopPropagation(); return false; } if( ( event.buttons === 1 ) && ( wnd._wnd_data.resize) && ( wnd.canResize ) && ( !wnd._wnd_data._minimize ) ){ var dx = event.pageX - wnd._wnd_data.resize.posX; var dy = event.pageY - wnd._wnd_data.resize.posY;  if( wnd.hAlign == 'right'){ dx = -dx; }  wnd._wnd_data.resize = { posX: event.pageX, posY: event.pageY }; wnd.hSize += dx; wnd.vSize += dy;  event.stopPropagation(); return false; } return true; } }); $(header).on({ "mousedown" : function(event){ wnd._wnd_data.drag = { posX: event.pageX, posY: event.pageY }; }, "dblclick" : function(event){ if( !wnd._wnd_data._minimize ){ return true; } popFromTray(wnd, wnd._manager); } }); $(resize).on({ "mousedown" : function(event){ wnd._wnd_data.resize = { posX: event.pageX, posY: event.pageY }; } }); } function getTopOfTray($this){ var items = $this._inTray; var height = $($this.tray).height() + $($this.tray).position().top; for(var i in items){ var body = items[i].body; height -= $(body).height(); }  return height; } function trayRefresh($this){ var items = $this._inTray; var height = $($this.tray).height() + $($this.tray).position().top; for(var i in items){ var bodyHeight = $(items[i].body).height(); height -= bodyHeight; items[i].body.animate({ top: height },300); } } function pushToTray(wnd, $this){ var body = wnd.body; var header = $(body).find("div.header"); var sysicons= $(body).find("div.sysicons"); var tray = $($this.tray); var left = $(tray).position().left; var bottom = getTopOfTray(wnd._manager); $(body).children().not('div.header').not(sysicons).fadeOut(200); $(body).animate({ height : $(header).height() + 6, width : $(tray).width(), left : left, top : bottom - $(header).height() - 6 },300); wnd._wnd_data._minimize = true; $this._inTray[wnd.getId()] = wnd; } function popFromTray(wnd, $this){ $this._inTray[wnd.getId()] = null; delete $this._inTray[wnd.getId()]; delete wnd._wnd_data._minimize; $(wnd.body).children().fadeIn(200); $this.updateWindow(wnd); trayRefresh($this); } function trayToggle(wnd, $this){ return function(event){ if( !wnd._wnd_data._minimize ){ pushToTray(wnd, $this); return; } popFromTray(wnd, $this); }; } function closeWindow(wnd, $this){ return function(event){ wnd.show = false; if( wnd.hideIfClose ){ return ; }  $this._stack[wnd.getId()] = null; $this._inTray[wnd.getId()] = null; delete $this._stack[wnd.getId()]; delete $this._inTray[wnd.getId()]; wnd = null;  trayRefresh($this); }; } function uTitle(text, body){ $(body).find('div.header').text(text); } function convertPercentToSize(value,areaValue){  if( typeof value === "string" ){ var stopPos = value.indexOf('%'); if( stopPos < 2){ throw new Error("Неверный формат данных"); } var subStr = value.substr(0,stopPos); var percent = subStr * 1; var newValue= Math.round(areaValue * percent / 100);  return newValue; } return value; } function uHPos(align, wnd, body, area){ var left = 0; var width = 0; wnd._hPos = convertPercentToSize(wnd._hPos, $(area).width() ); wnd._hSize = convertPercentToSize(wnd._hSize, $(area).width() );  switch( align.toLowerCase() ){ case 'left': left = wnd._hPos; break; case 'right': var resize = $(body).find("div.resize"); resize.addClass('left-angle'); left = wnd._hPos - wnd.hSize - 5; break; case 'center': left = (area.width() - wnd.hSize) / 2; break; default : left = wnd.hPos; }  width = wnd.hSize; $(body).css({left: left,width: width}); } function uVPos(align, wnd, body, area){ var top = 0; var height = 0; wnd._vPos = convertPercentToSize(wnd._vPos, $(area).height()); wnd._vSize = convertPercentToSize(wnd._vSize, $(area).height()); switch( align ){ case 'top': top = wnd._vPos;  break; case 'bottom': top = wnd._vPos - wnd.vSize; top = (top < 0) ? 0 : top; break; case 'center': top = (area.height() - wnd.vSize) / 2; top = (top < 0) ? 0 : top; break; default : top = wnd.vPos; } height = wnd.vSize; $(body).css({top: top,height: height}); } function uVisible(wnd, body){ var close = body.find('button.destroy'); var min = body.find('button.minimize'); var resize= body.find('div.resize'); var status= body.find('div.statusbar'); var content = body.find('div.content');  if( wnd.show !== body.is(':visible') ){ if( wnd.show ){ body.fadeIn(200); content.fadeIn(200); } else { body.fadeOut(200); } }  function changeState(item, key){ if( key ){ item.show(); } else { item.hide(); } }  changeState(close, wnd.showClose); changeState(min, wnd.showMin); changeState(status,wnd.showStatusBar); changeState(resize,wnd.canResize); if( wnd.showStatusBar ){ content.css('bottom','26'); } else { content.css('bottom','0'); } } function watchChanges(wnd,paramName,newValue,oldValue){  if( (paramName === 'vPos') && ( (wnd.vAlign === 'top') || (wnd.vAlign === 'bottom')) ){  wnd['_' + paramName] = oldValue; return ; } if( (paramName === 'hPos') && ( (wnd.hAlign === 'left') || (wnd.hAlign === 'right')) ){ wnd['_' + paramName] = oldValue; return ; }  wnd._manager.updateWindow(wnd); }; model.initWindow = function initWindow(wnd){ var body = wnd.body; var header = $(body).find("div.header"); var sysicons= $(body).find("div.sysicons"); var resize = $(body).find("div.resize"); var area = this.area; var $this = this; if( !wnd.show ){ $(body).hide(); } initDrag(wnd, area, header, resize); $(sysicons).find("button.minimize").click(trayToggle(wnd, $this)); $(sysicons).find("button.destroy").click(closeWindow(wnd, $this)); }; model.updateWindow = function updateWindow(wnd){ var body = wnd.body; var area = $(this.area); uTitle(wnd.title, body); uHPos(wnd.hAlign, wnd, body, area); uVPos(wnd.vAlign, wnd, body, area); uVisible(wnd, body); }; model.createWindow = function createWindow(config){ var newId = this._idCnt++; var wnd = new wndStruc(watchChanges); var area = this.area; var html = $templateCache.get('/window.html'); this._stack[newId]= wnd; wnd.setId(newId); wnd._manager = this; if( (typeof config === 'object') && (config !== null) ){ for(var field in config){  if( wnd.hasOwnProperty(field) ){  wnd['_' + field] = config[field]; } } } wnd._body = $(html); wnd._body.attr('id','wndMngId' + newId); $(area).append(wnd.body); this.updateWindow(wnd); this.initWindow(wnd); return wnd; }; model.getBody = function getBody(wnd){  if( !wnd ){ throw new Error("Запрос тела отсутствующего окна"); return false; }  var content = wnd.body.find('div.content'); return content; }; model.setBody = function setBody(wnd, html, scope){ this.getBody(wnd).html( $compile(html)(scope) ); }; model.setBodyByTemplate = function setBodyByTemplate(wnd, template, scope){ var html = $templateCache.get(template); this.getBody(wnd).html( $compile(html)(scope) ); }; model.toggle = function toggle(wnd){ if( wnd._wnd_data._minimize ){ popFromTray(wnd,this); return; } wnd.show = !wnd.show; };  model.show = function show(wnd){ if( wnd._wnd_data._minimize ){ popFromTray(wnd,this); return; } wnd.show = true; };  model.hide = function hide(wnd){ wnd.show = false; }; return model;}atcCS.service("$wndMng", ["$templateCache",'$compile', function($templateCache, $compile) { return wndManagerClass($templateCache, $compile);} ] );
/* * Сервис для обслуживания модели данных артикла */function articulInfoModel($rootScope,$user,$wndMng){  var model = { windows: new Array() };  function response(scope,wnd){ return function(answer){ var data = answer && answer.data; if( !data ){ return; }  scope.id = data.id; scope.number = data.number; scope.supplier = data.supplier; scope.description = data.description; scope.cross = data.cross;  }; }  model.requestInfo = function request(articulId,$parentWnd, $title){ var length = model.windows.length; var newScope = $rootScope.$new(true);  var window = $wndMng.createWindow({ title: "\"" + $title + "\"", hPos: $parentWnd.hPos, vPos: $parentWnd.vPos + $parentWnd.vSize * 0.05, vSize: $parentWnd.vSize, hSize: $parentWnd.hSize }); model.windows[length] = window;  newScope.id = false; newScope.number = "Загрузка..."; newScope.supplier = "Загрузка..."; newScope.description = "Загрузка..."; newScope.cross = "Загрузка..."; newScope.wnd = window; $wndMng.setBodyByTemplate(window, '/parts/_articul-info-part.html', newScope);  $user.getArticulInfo(articulId).then( response(newScope,window) ); }; return model;};atcCS.service('$articulWnd',['$rootScope','User','$wndMng',  function($rootScope,$user,$wndMng){ return articulInfoModel($rootScope,$user,$wndMng); }]);
/* * Сервис для обслуживания модели уведомлений */atcCS.service('Notification',['$rootScope', function($rootScope){  var model = {}; model.list = []; model.addObj = function(obj){ model.list.push(obj); }; model.addItem = function(head,text,style){ if( !style ){ style = "btn-info"; } model.list.push({head:head,text:text,style:style, new:1}); }; return model;}]);
/* * Сервис для обслуживания выпадающего меню поиска */function searchDropdown($rootScope,$user,$templateCache,$compile){  var model = {  parent: null, body: null, showBody: null };  function init(){ model.body = $('<div></div>'); model.body.addClass('dropdown-helper'); }  model.setParent = function setParent(parent){ if( model.parent && $(model.parent).parent() ){ $(model.parent).remove('div.dropdown-helper');  }  model.parent = $(parent); $(model.parent).append(model.body);  };  model.setTemplate = function setTemplate(templateUrl, scope){ var template = $templateCache.get(templateUrl); var compileTemplate = template; if( scope ){ var linkFn = $compile(template); compileTemplate = linkFn(scope); } $(model.body).html(compileTemplate); };  model.show = function show(){ if( model.showBody ){ return; } var x = $(model.parent).position().left; var y = $(model.parent).position().top; var width = $(model.parent).width(); var height= $(model.parent).height();  model.body.width(width-12);  model.body.position('left',x-2); model.body.position('top',y+height);  $(model.body).fadeIn(300); model.showBody = true; };  model.hide = function hide(){ if( !model.showBody ){ return; }  $(model.body).fadeOut(100);  model.showBody = false; };  model.toggle = function toggle(){ if( model.showBody ){ model.hide(); return; } model.show(); };  model.requestList = function request(articulText){ var text = String(articulText); var clearText = text.replace(new RegExp("\W*", "ig"),""); console.log(clearText); };  init(); return model;};atcCS.service('$searchDropdown',['$rootScope','User', '$templateCache', '$compile',  function($rootScope,$user,$templateCache, $compile){ return searchDropdown($rootScope,$user,$templateCache,$compile); }]);
/* * Сервис для обслуживания модели уведомлений */function tagsModel(){  var model = { root: null, tags: [] }; function onClose(model, tag){ return function(){ model.removeTag(tag); }; } function createTag(model, tag){ var close_icon = $('<span class="glyphicon glyphicon-remove"></span>'); var icon = $('<span></span>'); icon.text(tag.text); icon.attr('type',tag.type); icon.attr('key',tag.type); icon.addClass("tag"); icon.addClass("icon-" + tag.type); icon.append(close_icon); $(close_icon).click(onClose(model, tag)); return icon; }; function clearTags(model){ model.root.html(""); }; model.init = function init(root){ var model = tagsModel(); model.root= $(root); return model; }; model.pushTag = function (tag){  this.tags.push(tag); this.updateTags(); }; model.removeTag = function (tag){ for(var i in this.tags){ if (this.tags[i] === tag){ this.tags[i] = null; delete this.tags[i]; } } this.updateTags(); }; model.updateTags = function updateTags(){ clearTags(this);  for(var i in this.tags){ var tag = this.tags[i];  this.root.append( createTag(this, tag) ); } }; model.getTags = function getTags(field, value){ if( !field || !value){ return this.tags; } var answer = [];  for(var i in this.tags){ var tag = this.tags[i]; if( tag[field] === value ){ answer.push(tag); } } return answer; }; model.getTagsOneField = function getTagsOneField(field, value, filtredField){ var data = this.getTags(field,value); var answer = []; for(var i in data){ answer.push(data[i][filtredField]); } return answer; }; model.length = function length(){ return this.tags.length; }; return model;};atcCS.service('tagsControl', function(){ return tagsModel();} );
