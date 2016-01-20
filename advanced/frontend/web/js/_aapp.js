"use strict";var atcCS = angular.module('atcCS',['ngCookies']);
atcCS.config(['$httpProvider', function ($httpProvider) {   $httpProvider.defaults.headers.common = {'Accept' : "application/json, text/plain"}; $httpProvider.defaults.headers.common = {'Access-Control-Allow-Origin': 'http://rest.atc58.bit'}; $httpProvider.defaults.headers.common = {'Content-Type' : "application/json;charset=utf-8"}; $httpProvider.defaults.useXDomain = true;  $httpProvider.interceptors.push('atcServerToken'); }]);
atcCS.controller( 'searchControl', ['$scope','$filter', 'User', function($scope,$filter,$user) {  $scope.markup = null; $scope.query = "asd"; $scope.searchListLodaded = function listLoaded(){ $("body").popover({ container: "body", selector: "[data-toggle=popover]" }); }; }]);atcCS.controller( 'articulListController',['$scope','User','$wndMng', function($scope,$user,$wndMng) {  $scope.onLoadArticulInfo = function onLoadArticulInfo(articulData){ var $scope = this; console.log('articulInfo',articulData); $user.getArticulInfo(articulData.id).then( function(answer){ var data = answer && answer.data; if( !data ){ return; } var window = $wndMng.createWindow({ title: "\"" + articulData.number + "\"", hPos: $scope.wnd.hPos, vPos: $scope.wnd.vPos + $scope.wnd.vSize * 0.05, vSize: $scope.wnd.vSize, hSize: $scope.wnd.hSize, showStatusBar: false, }); var newScope = $scope.$new(true); newScope.id = data.id; newScope.number = data.number; newScope.supplier = data.supplier; newScope.description = data.description; newScope.cross = data.cross; newScope.wnd = window; $wndMng.setBodyByTemplate(window, '/parts/_articul-info-part.html', newScope);  }); }; }]);atcCS.controller( 'headControl',['$scope','User','$wndMng','$templateCache', function($scope,$user,$wndMng,$templateCache) {  var menu = $(".search-bar");   var window = $wndMng.createWindow({ title: "Авторизация", hPos: 0, vPos: menu.position().top + menu.height(), hSize: $(".view").position().left, vSize: 170, hAlign: 'left', showStatusBar: false, showClose: false, canResize: false, canMove: false, show: !$user.isLogin }); $wndMng.setBodyByTemplate(window, '/parts/_login-part.html', $scope); $scope.show = !$user.isLogin;  $scope.login = { name: $user.name, password: $user.password, remember: true }; $scope.onLogin = function(){   $user.login($scope.login.name,$scope.login.password,$scope.login.remember); $scope.show = !$user.isLogin; return false; }; $scope.$watch( function(){ return $user.isLogin }, function( newVal ){ $scope.show = !newVal; window.show = !newVal; } ); }]);
atcCS.directive('modal', function (){ return { require: "ngModel",  restrict: 'E', replace: true,  transclude: true, templateUrl: '/modal-window.html', scope: true, link: function link(scope, element, attrs, modelCtrl){ scope.title = attrs.title; scope.$watch(function(){ return modelCtrl.$viewValue;},  function( newVal ){ if( newVal === true ){ $(element).modal({ backdrop: false, show: true }); } else { $(element).modal('hide'); } }); } };} );atcCS.directive('inject', function(){ return { link: function($scope, $element, $attrs, controller, $transclude) { if (!$transclude) { throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element)); } var innerScope = $scope.$new(); $transclude(innerScope, function(clone) { $element.empty(); $element.append(clone); }); }  };});/*atcCS.directive('ajaxButton', ['$http','$compile', function ($http,$compile) { return {  restrict: 'E', replace: true,  transclude: true, template: '<button class="ajax-button" ng-transclude ng-click="toggle()"> </button>', scope: { ngModel : "=",  url : "@", data : "@", title : "@", name : "@",  }, controller: function controller($scope, $element, $attrs){ $scope.hide = function hide(){ $scope.window.addClass('hidden'); }; $scope.show = function show(){ var button = angular.element($element); var offset = button.offset(); $scope.window.css('left', offset.left + button.outerWidth()); $scope.window.css('top', offset.top); $scope.window.removeClass('hidden'); }; $scope.toggle = function toggle(){ $scope.window = angular.element($('body').find("#" + $scope.windowName)[0]); if( !$scope.window ){ return; } var show = !$scope.window.hasClass('hidden'); var title = $scope.window.find("h3.ajax-button-header"); var context = $scope.window.find("div.ajax-button-context"); context.html("asdf"); title.html($scope.title); title.html($scope.data + "asd"); if( !show ) { $scope.show(); } else { $scope.hide(); } }; },  link: function link($scope, $element, $attrs, modelCtrl){  $scope.visible = false; $scope.loaded = false; $scope.data = ""; $scope.templateWindow = '<div class="ajax-button-helper hidden"><div class="pointer"></div><h3 class="ajax-button-header"></h3><div class="ajax-button-context"></div></div>'; $scope.windowName = $scope.name + '-ajax-button-window'; var windowAlrearyAppend = $('body').find("#" + $scope.windowName).length !== 0; if( !windowAlrearyAppend ){ var root = angular.element('body'); var window = angular.element($scope.templateWindow); window.attr('id',$scope.windowName); root.append(window); }  $scope.$watch('visible',function(newVal){ if( newVal && !$scope.loaded ){ } return newVal; }); } };}]);*/
atcCS.directive('scheckbox', function (){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, template: [ '<div class="scheckbox">', ' <label for="{{name}}_id">{{label}}</label>', ' <span class="scb-box glyphicon glyphicon-unchecked" ng-click="toggle()"></span>', ' <input type="checkbox" name="{{name}}" id="{{name}}_id" ng-model="state" />', '</div>'].join(''), transclude: 'element', scope: { value: "@", label: "@", name: "@"  }, controller: function controller($scope, $element, $attrs, $transclude){  $scope.state = true; $scope.box = $($element).find('span.scb-box'); $scope.toggle = function toggle(){  $scope.state = ! $scope.state;  }; $scope.change = function change(){ if( $scope.state){ $($scope.box).removeClass('glyphicon-unchecked'); $($scope.box).addClass('glyphicon-check'); } else { $($scope.box).addClass('glyphicon-unchecked'); $($scope.box).removeClass('glyphicon-check'); }  };  },  link: function link(scope, element, attrs, modelCtrl){ scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.state = newVal; return newVal; }); scope.$watch( function(scope) { return scope.state; }, function(newVal){ modelCtrl.$setViewValue(newVal); scope.change(); return newVal; }); } };} );
atcCS.directive('inputhelper', ['$compile','$parse','$http','$filter', function ($compile,$parse,$http,$filter){ return { require: "ngModel", restrict: 'E', replace: true, transclude: true, templateUrl: '/input-help.html', scope: { ngModel : "=", placeholder : "@", url : "@", startLength : "@", subFilter : "@", inputClass : "@", onLoad : "=" }, controller: function controller($scope, $element, $attrs, $transclude,$filter){ $scope.change = function inputChange(){ var value = $scope.data.inputValue; var url = $scope.url; var req = { method: 'GET', url: url, responseType: 'json', params: { params: value } }; if( value.length < $scope.startLength*1){ return; } $http(req).then( function success(response){ var list = response && response.data || {}; if( list && list.count ){ $scope.count = list.count; delete list.count; } $scope.data.filters = null; if( (!list) || (Object.keys(list).length <= 1) || (list.length === 0) ){ $scope.visible = false; } else { $scope.visible = true; } $scope.list = list; $scope.fullList = list; if( $scope.onLoad instanceof Function ){ $scope.onLoad(); } },function error(response){ $scope.list = {}; $scope.fullList = {}; $scope.count = 0; }); }; $scope.subfilter = function subfilter(){ $scope.list = $filter($scope.subFilter)($scope.fullList,$scope.data.filters); }; $scope.toggle = function onToggle(){ if( !$scope.visible && ($scope.count === 0)){ return; } $scope.visible = !$scope.visible; }; }, link: function link($scope, $element, $attrs, modelCtrl){ $scope.data = { inputValue : "", filters : "" }; $scope.list = {"0":{"id":"1969592","article":"123444","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"1":{"id":"4520540","article":"12344","supply":"FARE\n","descrRU":"Шланг радиатора\n","descrEN":"Шланг радиатора\n"},"2":{"id":"170764","article":"123440601","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"3":{"id":"1969591","article":"123443","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"4":{"id":"1302189","article":"123440","supply":"ERNST\n","descrRU":"Труба выхлопного газа\n","descrEN":"Труба выхлопного газа\n"},"5":{"id":"539189","article":"1234431396","supply":"BOSCH\n","descrRU":"Электропроводка; Электропроводка\n","descrEN":"Электропроводка; Электропроводка\n"},"6":{"id":"1443113","article":"123449","supply":"SACHS\n","descrRU":"Амортизатор\n","descrEN":"Амортизатор\n"},"7":{"id":"2407016","article":"12344100002","supply":"MEYLE\n","descrRU":"Подвеска","descrEN":"Подвеска"},"8":{"id":"1969593","article":"123445","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"9":{"id":"170766","article":"123443801","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"10":{"id":"539188","article":"1234431293","supply":"BOSCH\n","descrRU":"Регулятор генератора\n","descrEN":"Регулятор генератора\n"},"11":{"id":"170767","article":"123443901","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"12":{"id":"539191","article":"1234477022","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"13":{"id":"539190","article":"1234477018","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"14":{"id":"1099497","article":"12344911","supply":"EBERSPÄCHER\n","descrRU":"Соединительные элементы","descrEN":"Соединительные элементы"},"15":{"id":"24695","article":"12344901","supply":"EBERSPÄCHER\n","descrRU":"Прокладка","descrEN":"Прокладка"},"16":{"id":"3691103","article":"12344R","supply":"SERCORE\n","descrRU":"Приводной вал\n","descrEN":"Приводной вал\n"},"17":{"id":"2407018","article":"12344710003","supply":"MEYLE\n","descrRU":"Гидравлический насос","descrEN":"Гидравлический насос"},"18":{"id":"539187","article":"1234431256","supply":"BOSCH\n","descrRU":"Конденсатор","descrEN":"Конденсатор"},"19":{"id":"2407017","article":"12344710001","supply":"MEYLE\n","descrRU":"Гидравлический насос","descrEN":"Гидравлический насос"},"20":{"id":"539192","article":"1234485025","supply":"BOSCH\n","descrRU":"Штекерная гильза","descrEN":"Штекерная гильза"},"21":{"id":"170765","article":"123443701","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"22":{"id":"1374164","article":"1234477014","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"23":{"id":"1443112","article":"123441","supply":"SACHS\n","descrRU":"Амортизатор\n","descrEN":"Амортизатор\n"}}; $scope.fullList = {}; $scope.count = 10; $scope.visible = false; } };}]);
/* * Измененное поле ввода текста */atcCS.directive('sinput', function (){  return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, templateUrl: '/parts/_sinput.html', transclude: false,  scope: { placeholder: "@", value: "@", name: "@", submit: "@", submitFunction: "&" }, controller: function controller($scope, $element, $attrs, $transclude){  $scope.model = null; var onFocus = function(){  $($element).addClass('active'); }; var onBlur = function(){ $($element).removeClass('active'); }; var onKeyPress = function(event){ if( event.charCode === 13 ){ $scope.submitFunction(event); } }; $($element).children('input').on('focus',onFocus); $($element).children('input').on('blur',onBlur); if( $scope.submit ){ $($element).children('input').on('keypress',onKeyPress); } }, /*compile: function compile(templateElement, templateAttrs){ },*/ link: function link(scope, element, attrs, modelCtrl){ scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){  scope.model = newVal; return newVal; }); scope.$watch( function(scope) { return scope.model; }, function(newVal){  modelCtrl.$setViewValue(newVal);  return newVal; }); } };} );
atcCS.directive('notificationItems', ['Notification', function ($notify){ return {  priority: 0, terminal: false, restrict: 'E', replace: true, template: "<ul></ul>",  transclude: false, scope: false, controller: function controller($scope, $element, $attrs, $transclude){  $scope.itemShow = function(){ var index = $(this).attr('index'); var item = $notify.list[index]; item.new = 0; $(this).children('button').children('span').remove(); };  },  link: function link(scope, element, attrs, modelCtrl){  for(var i = 0; i< $notify.list.length; i++){ var item = $notify.list[i]; var row = $("<li></li>"); var button = $('<button></button>'); item.text.replace(/\"/,''); row.addClass('notification-item'); row.addClass(item.class); row.attr('index',i); $(row).append(button); button.attr('type','button'); button.attr('data-toggle','popover'); button.attr('title','Просмотреть'); button.attr('data-content',item.text); button.addClass('btn'); button.addClass(item.style); button.text(item.head); if( item.new ){ button.prepend( '<span class="glyphicon glyphicon-flag pull-left text-muted"></span>'); } $(element).prepend(row); $(row).on('show.bs.popover',scope.itemShow); } } };}] );
atcCS.directive('searchLine', ['User','tagsControl','$wndMng','$sce', function ($user, $tagsControl, $wndMng, $sce){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, templateUrl: '/search-line.html', transclude: true, scope: {}, controller: function controller($scope, $element, $attrs, $transclude){  var icons = $($element).find("div.search-icons"); var cars = icons.find('button#search-cars'); $scope.text = ""; $scope.selector = { filter: "", url: $user.getUrl('helper','get-mft'), mmodel: "alm", models: {}, mfcs: {}, descriptions: {}, descr: "поршн", showDescr: false, selMFCs: [], selModels: [], selDescr: [] }; $scope.treeModel = [{ text: "Категории", type: 'request', url: $user.getUrl('helper','get-groups'), data: {path:""} }]; $scope.typeSelector = [{ text: "Список автомобилей", type: 'request', url: $user.getUrl('helper','get-mmt'), data: {path:""} }]; function toggle(window){ return function(){ $wndMng.toggle(window); }; } function selectAndConvert(text,data, type){ var result = []; for(var i in data){ var value = data[i]; var regReplace = new RegExp(text,'im'); result.push({ id: i, type: type, text: value, trustedHtml: $sce.trustAsHtml( String(value). replace( regReplace, '<b>' + text.toUpperCase() + '</b>') ) }); } return result; } function mmodelAnswer(text){ return function(answer){  var data = answer && answer.data; if( !data ){ return ; } $scope.selector.models = ( data && data.model ) ? selectAndConvert(text, data.model, 'model'): {}; $scope.selector.mfcs = ( data && data.mfc ) ? selectAndConvert(text, data.mfc, 'mfc'): {}; $scope.selector.descriptions = ( data && data.descr ) ? selectAndConvert(text, data.descr, 'descr'): {}; }; } $scope.onMMFind = function(){ var text = $scope.selector.mmodel;  if( text.length < 2 ){ return ; } $user.findMModel($scope.selector.mmodel, $scope.tagsCtrl).then(mmodelAnswer(text)); }; $scope.onSelectMModel = function(mmodel){ $scope.tagsCtrl.pushTag(mmodel); $scope.selector.mmodel = ""; $scope.selector.selMFCs = $scope.tagsCtrl.getTags('type','mfc'); $scope.selector.selModels = $scope.tagsCtrl.getTags('type','model'); $scope.selector.selDescr = $scope.tagsCtrl.getTags('type','descr');   if( mmodel.type === "mfc"){ if( ($scope.selector.selMFCs.length !== 0) && ($scope.selector.selModels.length !== 0) ){ $scope.selector.models = []; $scope.selector.mfcs = []; $scope.selector.showDescr = true; } else { $scope.selector.showDescr = false; } return; } else if ( mmodel.type === 'model' ){  if( $scope.selector.selMFCs.length === 0 ){ $user.findMFCs($scope.tagsCtrl).then(mmodelAnswer(' ')); return; } else if( ($scope.selector.selMFCs.length !== 0) && ($scope.selector.selModels.length !== 0) ){ $scope.selector.models = []; $scope.selector.mfcs = []; $scope.selector.showDescr = true;  } else { $scope.selector.showDescr = false; } } else if( mmodel.type === 'descr' ){ $user.findParts($scope.tagsCtrl).then(function(answer){ var data = answer && answer.data; if( !data ){ return; } var window = $wndMng.createWindow({ title: "Список подходящих деталей", hPos: $scope.carsWnd.hPos - $scope.carsWnd.hSize * 2 - 5, vPos: $scope.carsWnd.vPos,  vSize: $scope.carsWnd.vSize, hSize: $scope.carsWnd.hSize, showStatusBar: false, });   var newScope = $scope.$new(true); newScope.items = data.parts; newScope.mfc = $scope.selector.selMFCs; newScope.model = $scope.selector.selModels; newScope.descr = $scope.selector.selDescr; newScope.wnd = window;  $wndMng.setBodyByTemplate(window, '/parts/_car-select-articul-part.html', newScope); }); } }; $scope.onDescrFind = function(){ var text = $scope.selector.descr; if( text.length < 2 ){ return; } $user.findDescr(text,$scope.tagsCtrl).then(mmodelAnswer(text)); }; $scope.onShowPartTree = function onShowPartTree(){ var models = []; for(var i in $scope.selector.selModels){ models.push($scope.selector.selModels[i].id); } $scope.treeModel = { type: 'request', url: $user.getUrl('helper','get-groups'), data: models }; };  $scope.carsWnd = $wndMng.createWindow({ title: "Подобрать по автомобилю", vPos: cars.offset().top + cars.position().top + cars.height(), hPos: cars.offset().left + cars.position().left - cars.width(), hSize: '25%', vSize: '40%', hAlign: 'right', vAlign: 'top', hideIfClose: true,  }); $scope.treeWnd = $wndMng.createWindow({ title: "Выбрать по каталогу", vPos: $scope.carsWnd.vPos, hPos: $scope.carsWnd.hPos - $scope.carsWnd.hSize, hSize: '25%', vSize: '40%', hAlign: 'right', vAlign: 'top', hideIfClose: true,  });  $wndMng.setBodyByTemplate($scope.carsWnd, '/parts/_car-select-part.html', $scope); $wndMng.setBodyByTemplate($scope.treeWnd, '/parts/_car-select-group.html', $scope);  var tags = $wndMng.getBody($scope.carsWnd).find("div#tags");  $scope.tagsCtrl = $tagsControl.init(tags);  cars.click( toggle($scope.carsWnd) ); },  link: function link(scope, element, attrs, modelCtrl){   scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.text = newVal; return newVal; }); scope.$watch( function(scope) { return scope.text; }, function(newVal){ modelCtrl.$setViewValue(newVal); return newVal; }); } };}] );
atcCS.directive( 'tileSelector',['$http', function ($http){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, template: '', transclude: false, templateUrl: '/parts/_tile-selector.html', scope: { wsize: "@", textFilter: "@" }, controller: function controller($scope, $element, $attrs, $transclude){ $scope.tiles = { "asd":{data:1}, "absd":{data:1}, "acsd":{data:1}, "csd":{data:1}, "sd":{data:1}, "d":{data:1} }; $scope.loaded = true; $scope.update = function(){ var width = $($element).width(); var workspaceWidth = Math.max(0,(width - width*0.05 - $scope.wsize*10)); var maxTileWidth = Math.ceil(workspaceWidth / $scope.wsize); var maxTileHeight = maxTileWidth; var element = $($element); element.html(''); for(var text in $scope.tiles){ var data = $scope.tiles[text]; var tile = $('<div></div>'); tile.addClass('tile-selector tile'); tile.text(text); tile.attr('data', data); tile.css('width',maxTileWidth); tile.css('height',maxTileHeight); tile.css('line-height',maxTileHeight+"px"); element.append(tile); } console.log(width, maxTileWidth); }; $scope.update(); }, link: function link(scope, element, attrs, modelCtrl){ /*scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.data = newVal; scope.update(); return newVal; });*/ } };}] );
atcCS.directive( 'tree',['$http', function ($http){ return { require: "ngModel", priority: 0, terminal: false, restrict: 'E', replace: true, template: '', transclude: false, templateUrl: '/parts/_tree-part.html', scope: { }, controller: function controller($scope, $element, $attrs, $transclude){ console.log($element); var UL = $($element); function itemLoadable(item){ return !item.subItems && item.url && item.type && (item.type === 'request'); } function serverAnswer(item, listItem){ return function(answer){ var data = answer && answer.data; if( !data ){ return; }  item.subItems = data; createItems(data, listItem);  }; }; function itemClick(item, listItem){ return function(event){ if( $(listItem).hasClass('open') ){ $(listItem).removeClass('open'); }else { $(listItem).addClass('open');   if( itemLoadable(item) ){ var request = { url: item.url, method: "GET", responseType: 'json', params: { params: item.data } }; $http(request).then( serverAnswer(item, listItem) );  } } event.stopPropagation(); }; } function createItem(item){ var listItem = $('<li></li>'); var ul = $('<ul></ul>'); var span = $('<span></span>'); var text = item.text || "???"; if( item.type === "group" ){ span.addClass('node'); } span.text(text); listItem.append(span); listItem.append(ul); createItems(item.subItems,ul);  listItem.click( itemClick(item, listItem) );  return listItem; } function createItems(data, root){ var answer = ""; var ul = $(root).find('ul'); for( var i in data){ var item = data[i]; var htmlItem = createItem(item); $(ul).append(htmlItem); } return answer; } $scope.update = function treeUpdate(){  createItems($scope.data, UL); }; }, link: function link(scope, element, attrs, modelCtrl){ scope.$watch( function() { return modelCtrl.$viewValue; }, function(newVal){ scope.data = newVal; scope.update(); return newVal; }); } };}] );
 atcCS.factory('atcServerToken', ['$q', '$rootScope', '$injector', function ($q, $rootScope, $injector) { var interceptor = { request: function(config){ if( config.params ){ config.params._format = 'json'; config.responseType = 'json'; }  if( $rootScope.user.isLogin ){ config.headers.Authorization = 'Bearer ' + $rootScope.user.accessToken; } return config; }, response: function (response){ var accessToken = response && response.data && response.data["access-token"] || null; if( accessToken ){ $rootScope.user.accessToken = accessToken; $rootScope.user.isLogin = true; } return response; }, responseError: function(response){ if( response.status === 401){ $rootScope.user.accessToken = null; $rootScope.user.isLogin = false; } }  }; return interceptor;}]);
atcCS.filter('inputHelper', [function(){   return function(input,value){ var result = {};  if( !value ){ return input; } value = String(value).toUpperCase(); for (var i in input){ var item = input[i]; var article = item.article && String(item.article).toUpperCase() || ""; var supply = item.supply && String(item.supply).toUpperCase() || "";  if( (article.indexOf(value) > -1) || (supply.indexOf(value) > -1) ){  result[i] = item; } }  return result;  };}]);
/* * Модель пользователя системы */function userModel(){   return { name: 'Йожыг', surname: 'Йожыгов', company: 'ООО Йожыная ферма',  markup: [ { v:15,n:'Простая'}, { v:10,n:'Сложная'} ], alerts: [ /*{head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1}, {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1}, {head: "Добро пожаловать", text: "Добро пожаловать в нашу мега-супе-пупер-систему", style:"btn-info", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1}, {head: "Ошибка авторизации", text: "Ошибка при авторизации", style:"btn-danger", new:1},*/ ], analogShow : false,  isLogin : false,  accessToken : false   }; }
/* * Сервис для обслуживания модели пользователя и общения с сервером */atcCS.service('User',['$http', '$cookies', '$rootScope', 'Notification', function($http, $cookies, $rootScope, $notify){   var URL = "http://rest.atc58.bit/index.php"; var model = new userModel(); function URLto(controller,funct,local){ return (local?"":URL) + "?r=" + controller + "/" + funct; } function loadFormCookies(){ var name = $cookies.get('name'); var pass = $cookies.get('pass'); console.log("Login from Cookies", name, pass); if ( name && pass ){ console.log("Name:",name,"Pass:",pass); model.login(name,pass,true).then(function(){ model.update(); }); return true; }  return false; }; model.getUrl = function getUrl(controller, funct){ return URLto(controller, funct); }; model.login = function login(name,password,remember){ var req = { method: 'GET', url: URLto('login','login'), responseType: 'json',  headers: {  'Authorization': "Basic " + btoa(name + ":" + password) }, params: {  params: 'get-token' + (remember?'-hash':'') } };  return $http(req).then( function success(response){  var hash = response && response.data && response.data['hash'] || null;  if( hash && remember ){ var now = new Date(); var expires = new Date( now.getTime() + 30*24*3600 );  $cookies.put('name',name,{expires:expires}); $cookies.put('pass',hash,{expires:expires}); }  }, function error(response){ $notify.addItem("Ошибка","Вам не удалось авторизоваться. Проверьте правильность имени пользователя и\или пароля."); });  }; model.update = function update(){  var req = { method: 'GET', url: URLto('login','get-data'),  params: {  params: 'get-data' } }; if( model.isLogin === false ){ return false; } console.log("User data update"); return $http(req).then(function succes(response){  }, function error(response){  });  }; model.findParts = function findDescr(tags){ var req = { method: 'POST', url: URLto('helper','parts-search'), responseType: 'json', params:{ params:{ } }, data: {  descr: tags.getTagsOneField('type', 'descr', 'id'), mfc: tags.getTagsOneField('type', 'mfc', 'id'), model: tags.getTagsOneField('type', 'model', 'id')  } }; return $http(req); }; model.findDescr = function findDescr(text, tags){ var req = { method: 'POST', url: URLto('helper','description-search'), responseType: 'json', params: { params: { descr: text, mfc: tags.getTagsOneField('type', 'mfc', 'id'), model: tags.getTagsOneField('type', 'model', 'id') } } }; return $http(req); }; model.getArticulInfo = function getArticulInfo(articul_id){ var req = { method: 'GET', url: URLto('helper','articul-info'), responseType: 'json', params: { params: { articul_id: articul_id } } }; return $http(req); }; model.findMModel = function findMModel(text, tags){ var req = { method: 'POST', url: URLto('helper','mmodel-search'), responseType: 'json',  params: { params: { mmodel: text, mfc: tags.getTagsOneField('type', 'mfc', 'id'), model: tags.getTagsOneField('type', 'model', 'id') } } }; return $http(req); }; model.findMFCs = function findMFCs(tags){ var req = { method: 'POST', url: URLto('helper','mfcs-search'), responseType: 'json', params: { params: { model: tags.getTagsOneField('type', 'model', 'id') } } }; return $http(req); }; $rootScope.user = model; for(var index in model.alerts){ $notify.addObj(model.alerts[index]); } loadFormCookies();   return model; }]);
/** * @syntax wndStruc(callbackFunction) * @param {Object} callbackFunction * @returns {Object} */function wndStruc(callbackFunction){  var model = { _id: 0, _manager: null, _wnd_data: {}, title: "", body: null, hPos: 300, vPos: 200, hSize: 600, vSize: 200, vAlign: "none", hAlign: "none", showClose: true, showMin: true, showStatusBar: true, canMove: true, canResize: true, show: true, hideIfClose: false, setId: function(id){ if( this._id === 0 ){ this._id = id; return id; } throw new Error("Попытка изменить ID существующего окна"); }, getId: function(){ return this._id; } }; var struct = new Object(); if( (callbackFunction === undefined) || !(callbackFunction instanceof Function) ){ throw new Error("Создание дескриптора без оконной функции"); }  function createGetter(name){ return function getter(){ return this['_' + name]; }; } function createSetter(name,struct){ return function setter(newVal){ var oldVal = this['_' + name]; this['_' + name] = newVal; callbackFunction(struct, name, newVal, oldVal); return newVal; }; } for(var name in model){ var value = model[name]; if( (String(name).substr(0,1) === "_") || (value instanceof Function) ){ Object.defineProperty(struct,name,{ enumerable: (value instanceof Function)?true:false, writable: true, value: value }); continue; }  Object.defineProperty(struct,'_' + name,{ enumerable: false, writable: true, value: value }); Object.defineProperty(struct,name,{ get: createGetter(name), set: createSetter(name, struct) });  } return struct;};function wndManagerClass($templateCache, $compile){  var model = { _idCnt: 0, _stack: [], _inTray: [], area: "body", tray: "div.tray-bar", }; function initDrag(wnd, area, header, resize){ $(area).on({ "mouseup" : function(event){ delete(wnd._wnd_data.drag); delete(wnd._wnd_data.resize); }, "mousemove" : function (event){  if( ( event.buttons === 1 ) && ( wnd._wnd_data.drag ) && ( wnd.canMove ) && ( !wnd._wnd_data._minimize ) ){  var dx = event.pageX - wnd._wnd_data.drag.posX; var dy = event.pageY - wnd._wnd_data.drag.posY; wnd._wnd_data.drag = { posX: event.pageX, posY: event.pageY }; wnd.hPos += dx; wnd.vPos += dy;  event.stopPropagation(); return false; } if( ( event.buttons === 1 ) && ( wnd._wnd_data.resize) && ( wnd.canResize ) && ( !wnd._wnd_data._minimize ) ){ var dx = event.pageX - wnd._wnd_data.resize.posX; var dy = event.pageY - wnd._wnd_data.resize.posY; wnd._wnd_data.resize = { posX: event.pageX, posY: event.pageY }; wnd.hSize += dx; wnd.vSize += dy;  event.stopPropagation(); return false; } return true; } }); $(header).on({ "mousedown" : function(event){ wnd._wnd_data.drag = { posX: event.pageX, posY: event.pageY }; }, "dblclick" : function(event){ if( !wnd._wnd_data._minimize ){ return true; } popFromTray(wnd, wnd._manager); } }); $(resize).on({ "mousedown" : function(event){ wnd._wnd_data.resize = { posX: event.pageX, posY: event.pageY }; } }); } function getTopOfTray($this){ var items = $this._inTray; var height = $($this.tray).height() + $($this.tray).position().top; for(var i in items){ var body = items[i].body; height -= $(body).height(); }  return height; } function trayRefresh($this){ var items = $this._inTray; var height = $($this.tray).height() + $($this.tray).position().top; for(var i in items){ var bodyHeight = $(items[i].body).height(); height -= bodyHeight; items[i].body.animate({ top: height },300); } } function pushToTray(wnd, $this){ var body = wnd.body; var header = $(body).find("div.header"); var sysicons= $(body).find("div.sysicons"); var tray = $($this.tray); var left = $(tray).position().left; var bottom = getTopOfTray(wnd._manager); $(body).children().not('div.header').not(sysicons).fadeOut(200); $(body).animate({ height : $(header).height() + 6, width : $(tray).width(), left : left, top : bottom - $(header).height() - 6 },300); wnd._wnd_data._minimize = true; $this._inTray[wnd.getId()] = wnd; } function popFromTray(wnd, $this){ $this._inTray[wnd.getId()] = null; delete $this._inTray[wnd.getId()]; delete wnd._wnd_data._minimize; $(wnd.body).children().fadeIn(200); $this.updateWindow(wnd); trayRefresh($this); } function trayToggle(wnd, $this){ return function(event){ if( !wnd._wnd_data._minimize ){ pushToTray(wnd, $this); return; } popFromTray(wnd, $this); }; } function closeWindow(wnd, $this){ return function(event){ wnd.show = false; if( wnd.hideIfClose ){ return ; }  $this._stack[wnd.getId()] = null; $this._inTray[wnd.getId()] = null; delete $this._stack[wnd.getId()]; delete $this._inTray[wnd.getId()]; wnd = null;  trayRefresh($this); }; } function uTitle(text, body){ $(body).find('div.header').text(text); } function convertPercentToSize(value,areaValue){  if( typeof value === "string" ){ var stopPos = value.indexOf('%'); if( stopPos < 2){ throw new Error("Неверный формат данных"); } var subStr = value.substr(0,stopPos); var percent = subStr * 1; var newValue= Math.round(areaValue * percent / 100);  return newValue; } return value; } function uHPos(align, wnd, body, area){ var left = 0; var width = 0; wnd._hPos = convertPercentToSize(wnd._hPos, $(area).width() ); wnd._hSize = convertPercentToSize(wnd._hSize, $(area).width() );  switch( align.toLowerCase() ){ case 'left': left = wnd._hPos; break; case 'right': left = wnd._hPos - wnd.hSize - 5; break; case 'center': left = (area.width() - wnd.hSize) / 2; break; default : left = wnd.hPos; }  width = wnd.hSize; $(body).css({left: left,width: width}); } function uVPos(align, wnd, body, area){ var top = 0; var height = 0; wnd._vPos = convertPercentToSize(wnd._vPos, $(area).height()); wnd._vSize = convertPercentToSize(wnd._vSize, $(area).height()); switch( align ){ case 'top': top = wnd._vPos;  break; case 'bottom': top = wnd._vPos - wnd.vSize; top = (top < 0) ? 0 : top; break; case 'center': top = (area.height() - wnd.vSize) / 2; top = (top < 0) ? 0 : top; break; default : top = wnd.vPos; } height = wnd.vSize; $(body).css({top: top,height: height}); } function uVisible(wnd, body){ if( wnd.show !== body.is(':visible') ){ if( wnd.show ){ body.fadeIn(200); } else { body.fadeOut(200); } } var close = body.find('button.destroy'); var min = body.find('button.minimize'); var resize= body.find('div.resize'); var status= body.find('div.statusbar'); var content = body.find('div.content');  function changeState(item, key){ if( key ){ item.show(); } else { item.hide(); } }  changeState(close, wnd.showClose); changeState(min, wnd.showMin); changeState(status,wnd.showStatusBar); changeState(resize,wnd.canResize); if( wnd.showStatusBar ){ content.css('bottom','26'); } else { content.css('bottom','0'); } } function watchChanges(wnd,paramName,newValue,oldValue){  if( (paramName === 'vPos') && ( (wnd.vAlign === 'top') || (wnd.vAlign === 'bottom')) ){  wnd['_' + paramName] = oldValue; return ; } if( (paramName === 'hPos') && ( (wnd.hAlign === 'left') || (wnd.hAlign === 'right')) ){ wnd['_' + paramName] = oldValue; return ; }  wnd._manager.updateWindow(wnd); }; model.initWindow = function initWindow(wnd){ var body = wnd.body; var header = $(body).find("div.header"); var sysicons= $(body).find("div.sysicons"); var resize = $(body).find("div.resize"); var area = this.area; var $this = this; if( !wnd.show ){ $(body).hide(); } initDrag(wnd, area, header, resize); $(sysicons).find("button.minimize").click(trayToggle(wnd, $this)); $(sysicons).find("button.destroy").click(closeWindow(wnd, $this)); }; model.updateWindow = function updateWindow(wnd){ var body = wnd.body; var area = $(this.area); uTitle(wnd.title, body); uHPos(wnd.hAlign, wnd, body, area); uVPos(wnd.vAlign, wnd, body, area); uVisible(wnd, body); }; model.createWindow = function createWindow(config){ var newId = this._idCnt++; var wnd = new wndStruc(watchChanges); var area = this.area; var html = $templateCache.get('/window.html'); this._stack[newId]= wnd; wnd.setId(newId); wnd._manager = this; if( (typeof config === 'object') && (config !== null) ){ for(var field in config){  if( wnd.hasOwnProperty(field) ){  wnd['_' + field] = config[field]; } } } wnd._body = $(html); wnd._body.attr('id','wndMngId' + newId); $(area).append(wnd.body); this.updateWindow(wnd); this.initWindow(wnd); return wnd; }; model.getBody = function getBody(wnd){  if( !wnd ){ throw new Error("Запрос тела отсутствующего окна"); return false; }  var content = wnd.body.find('div.content'); return content; }; model.setBody = function setBody(wnd, html, scope){ this.getBody(wnd).html( $compile(html)(scope) ); }; model.setBodyByTemplate = function setBodyByTemplate(wnd, template, scope){ var html = $templateCache.get(template); this.getBody(wnd).html( $compile(html)(scope) ); }; model.toggle = function toggle(wnd){ wnd.show = !wnd.show; }; return model;}atcCS.service("$wndMng", ["$templateCache",'$compile', function($templateCache, $compile) { return wndManagerClass($templateCache, $compile);} ] );
/* * Сервис для обслуживания модели уведомлений */atcCS.service('Notification',['$rootScope', function($rootScope){  var model = {}; model.list = []; model.addObj = function(obj){ model.list.push(obj); }; model.addItem = function(head,text,style){ if( !style ){ style = "btn-info"; } model.list.push({head:head,text:text,style:style, new:1}); }; return model;}]);
/* * Сервис для обслуживания модели уведомлений */function tagsModel(){  var model = { root: null, tags: [] }; function onClose(model, tag){ return function(){ model.removeTag(tag); }; } function createTag(model, tag){ var close_icon = $('<span class="glyphicon glyphicon-remove"></span>'); var icon = $('<span></span>'); icon.text(tag.text); icon.attr('type',tag.type); icon.attr('key',tag.type); icon.addClass("tag"); icon.addClass("icon-" + tag.type); icon.append(close_icon); $(close_icon).click(onClose(model, tag)); return icon; }; function clearTags(model){ model.root.html(""); }; model.init = function init(root){ var model = tagsModel(); model.root= $(root); return model; }; model.pushTag = function (tag){  this.tags.push(tag); this.updateTags(); }; model.removeTag = function (tag){ for(var i in this.tags){ if (this.tags[i] === tag){ this.tags[i] = null; delete this.tags[i]; } } this.updateTags(); }; model.updateTags = function updateTags(){ clearTags(this);  for(var i in this.tags){ var tag = this.tags[i];  this.root.append( createTag(this, tag) ); } }; model.getTags = function getTags(field, value){ if( !field || !value){ return this.tags; } var answer = [];  for(var i in this.tags){ var tag = this.tags[i]; if( tag[field] === value ){ answer.push(tag); } } return answer; }; model.getTagsOneField = function getTagsOneField(field, value, filtredField){ var data = this.getTags(field,value); var answer = []; for(var i in data){ answer.push(data[i][filtredField]); } return answer; }; model.length = function length(){ return this.tags.length; }; return model;};atcCS.service('tagsControl', function(){ return tagsModel();} );
