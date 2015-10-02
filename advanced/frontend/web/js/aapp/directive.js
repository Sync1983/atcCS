/* global atcCS */

'use strict';

atcCS.directive('xngFocus', function(){
  
    return function($scope, $element, $attrs){
      
        return $scope.$watch($attrs.xngFocus, 
          function ($newValue){
                        
            return $newValue && $element[0].focus();
            
        });        
    };    
});

atcCS.directive('checkbox',function(){
  return {
    require: "ngModel",
    // priority: 0,
    // terminal:false,
    /*
     * E - имя элемента:: <my-directive></my-directive>
     * A - атрибут: <div my-directive="exp"> </div>
     * C - класс: <div class="my-directive: exp;"></div>
     * M - комментарий: <!-- directive: my-directive exp -->
     */
    restrict: 'E',
    replace: true,
    template: '<button class="btn">' +
              '<span ng-style="style" ng-class="{\'glyphicon glyphicon-unchecked\': checked===false}"></span>' +
              '<span ng-style="style" ng-class="{\'glyphicon glyphicon-check\': checked===true}" style="left:0;"></span>' +
              '<div  ng-style="style" ng-transclude></div>' +
              '</button>',
    transclude: true,
    // templateUrl: 'template.html',
    scope: {},
    /*controller: function controller($scope, $element, $attrs, $transclude, otherInjectables) {
    },*/
    /*compile: function compile(templateElement, templateAttrs){
      console.log(templateElement);
      console.log(templateAttrs);

    },*/
    link: function link(scope,element,attrs,modelCtrl){
      
      scope.checked = modelCtrl.$modelValue;
      scope.style = {'display':'inline-block'};
      scope.icon  = {'display':'inline-block'/*, 'padding':'0 2px 0 0'*/};

      scope.$watch(
        function(){ return modelCtrl.$viewValue; },
        function(newVal){ scope.checked = newVal; }
      );
      
      element.bind('click',function(){
        scope.$apply(function(){
          modelCtrl.$setViewValue(!scope.checked);
          scope.checked = !scope.checked;          
        });
      });
    }
  };
});

atcCS.directive('select2', ['$compile','$parse', function ($compile,$parse){
  return {
    require: "ngModel",    
    restrict: 'E',
    replace: true,
    template: '<button class="select2" ng-click="showSelector()">' +
              '<span class="placeholder" ng-class="{\'hidden\': value!==null}">{{placeholder}}</span>'+
              '<span class="" ng-class="{\'hidden\': value===null}">{{showValue}}</span>'+
              '<ul class="select2selector hidden"></ul></button>',
    transclude: true,    
    scope: {
      ngModel       : "=",
      placeholder   : "@",
      list          : "=",
      showPattern   : "@"
    },
    controller: function ctrl($scope,$element,$attrs){

      $scope.showSelector = function showSelector(){
        $scope.open = !$scope.open;
        if( !$scope.open ){
          $scope.ul.addClass('hidden');
        } else {
          $scope.ul.removeClass('hidden');
        }
      };

      $scope.updateValue = function updateValue($value){
        var localScope = {};

        localScope[$scope.itemName] = $value;        
        $scope.value = $value;

        if( !$attrs.showPattern ){
          $scope.showValue = "selected";
        }

        $scope.showValue = $parse($attrs.showPattern)(localScope);
        
      };

      $scope.click = function click($event){        
        $scope.updateValue($event);
      };
    },
    link: function link(scope, element, attrs, modelCtrl, transclude){

      scope.value       = null;
      scope.open        = false;
      scope.placeholder = attrs.placeholder || "button";
      scope.showValue   = "selected";
      scope.itemName    = "item" || attrs.itemName;
      
      var ul      = angular.element(element.children('ul')[0]);
      var li      = angular.element('<li/>').
                    attr('ng-repeat',scope.itemName + ' in list').
                    attr('ng-transclude','').
                    attr('ng-click','click(' + scope.itemName + ')');
                    
      var top     = element[0].offsetHeight;

      scope.ul          = ul;
            
      $compile(li,transclude)(scope);
      
      ul.append(li);
      
      ul.offset({'top':top});

      scope.$watch('value',function(newVal){
        if( scope.value ){
          modelCtrl.$setViewValue(scope.value);
        }
      });
      
      scope.$watch(
        function(){ return modelCtrl.$viewValue; },
        function(newVal){ scope.updateValue(newVal);}
      );
    }
  };
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

atcCS.directive('inputhelper', ['$compile','$parse','$http','$filter', function ($compile,$parse,$http,$filter){
  return {
    require: "ngModel",
    restrict: 'E',
    replace: true,    
    transclude: true,
    templateUrl: '/input-help.html',
    scope: {
      ngModel       : "=",
      placeholder   : "@",
      url           : "@",
      startLength   : "@",      
      subFilter     : "@",
      inputClass    : "@",
      onLoad        : "="
    },
    controller: function controller($scope, $element, $attrs, $transclude,$filter){

      $scope.change = function inputChange(){
        var value = $scope.data.inputValue;
        var url   = $scope.url;        
        var req = {
          method: 'GET',
          url: url,
          responseType: 'json',
          params: { params: value }
        };

        if( value.length < $scope.startLength*1){
          return;
        }

        $http(req).then(
          function success(response){
            var list = response && response.data || {};

            
            if( list && list.count ){
              $scope.count = list.count;
              delete list.count;
            }

            $scope.data.filters = null;

            if( (!list) || (Object.keys(list).length <= 1) || (list.length === 0) ){
              $scope.visible = false;
            } else {
              $scope.visible = true;
            }

            $scope.list = list;
            $scope.fullList = list;
            if( $scope.onLoad instanceof Function ){
              $scope.onLoad();
            }
          },function error(response){
            $scope.list = {};
            $scope.fullList = {};
            $scope.count = 0;
        });

      };
      
      $scope.subfilter = function subfilter(){        
        $scope.list = $filter($scope.subFilter)($scope.fullList,$scope.data.filters);
      };

      $scope.toggle = function onToggle(){
        if( !$scope.visible && ($scope.count === 0)){
          return;
        }
        $scope.visible = !$scope.visible;
      };

    },
    
    link: function link($scope, $element, $attrs, modelCtrl){
      $scope.data = {
        inputValue  : "",
        filters     : ""
      };
      $scope.list = {"0":{"id":"1969592","article":"123444","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"1":{"id":"4520540","article":"12344","supply":"FARE\n","descrRU":"Шланг радиатора\n","descrEN":"Шланг радиатора\n"},"2":{"id":"170764","article":"123440601","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"3":{"id":"1969591","article":"123443","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"4":{"id":"1302189","article":"123440","supply":"ERNST\n","descrRU":"Труба выхлопного газа\n","descrEN":"Труба выхлопного газа\n"},"5":{"id":"539189","article":"1234431396","supply":"BOSCH\n","descrRU":"Электропроводка; Электропроводка\n","descrEN":"Электропроводка; Электропроводка\n"},"6":{"id":"1443113","article":"123449","supply":"SACHS\n","descrRU":"Амортизатор\n","descrEN":"Амортизатор\n"},"7":{"id":"2407016","article":"12344100002","supply":"MEYLE\n","descrRU":"Подвеска","descrEN":"Подвеска"},"8":{"id":"1969593","article":"123445","supply":"SCHLIECKMANN\n","descrRU":"Решетка вентилятора","descrEN":"Решетка вентилятора"},"9":{"id":"170766","article":"123443801","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"10":{"id":"539188","article":"1234431293","supply":"BOSCH\n","descrRU":"Регулятор генератора\n","descrEN":"Регулятор генератора\n"},"11":{"id":"170767","article":"123443901","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"12":{"id":"539191","article":"1234477022","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"13":{"id":"539190","article":"1234477018","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"14":{"id":"1099497","article":"12344911","supply":"EBERSPÄCHER\n","descrRU":"Соединительные элементы","descrEN":"Соединительные элементы"},"15":{"id":"24695","article":"12344901","supply":"EBERSPÄCHER\n","descrRU":"Прокладка","descrEN":"Прокладка"},"16":{"id":"3691103","article":"12344R","supply":"SERCORE\n","descrRU":"Приводной вал\n","descrEN":"Приводной вал\n"},"17":{"id":"2407018","article":"12344710003","supply":"MEYLE\n","descrRU":"Гидравлический насос","descrEN":"Гидравлический насос"},"18":{"id":"539187","article":"1234431256","supply":"BOSCH\n","descrRU":"Конденсатор","descrEN":"Конденсатор"},"19":{"id":"2407017","article":"12344710001","supply":"MEYLE\n","descrRU":"Гидравлический насос","descrEN":"Гидравлический насос"},"20":{"id":"539192","article":"1234485025","supply":"BOSCH\n","descrRU":"Штекерная гильза","descrEN":"Штекерная гильза"},"21":{"id":"170765","article":"123443701","supply":"REINZ\n","descrRU":"Комплект прокладок","descrEN":"Комплект прокладок"},"22":{"id":"1374164","article":"1234477014","supply":"BOSCH\n","descrRU":"Соединитель проводов\n","descrEN":"Соединитель проводов\n"},"23":{"id":"1443112","article":"123441","supply":"SACHS\n","descrRU":"Амортизатор\n","descrEN":"Амортизатор\n"}};
      $scope.fullList = {};
      $scope.count = 10;
      $scope.visible = true;
    }

  };
}]);

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

atcCS.directive('ajaxButton', ['$http','$compile', function ($http,$compile) {

  return {
    //require: "ngModel",
    restrict: 'E',
    replace: true,    
    transclude: true,
    template: '<button class="ajax-button" ng-transclude ng-click="toggle()"> </button>',
    scope: {
      ngModel       : "=",      
      url           : "@",
      data          : "@",
      title         : "@",
      name          : "@",      
    },
    controller: function controller($scope, $element, $attrs){

      $scope.hide = function hide(){
        $scope.window.addClass('hidden');
      };

      $scope.show = function show(){
        var button = angular.element($element);
        var offset = button.offset();
        $scope.window.css('left', offset.left + button.outerWidth());
        $scope.window.css('top', offset.top);
        $scope.window.removeClass('hidden');
      };

      $scope.toggle = function toggle(){
        $scope.window = angular.element($('body').find("#" + $scope.windowName)[0]);
        if( !$scope.window ){
          return;
        }

        var show = !$scope.window.hasClass('hidden');
        var title   = $scope.window.find("h3.ajax-button-header");
        var context = $scope.window.find("div.ajax-button-context");
        context.html("asdf");

        title.html($scope.title);
        title.html($scope.data + "asd");
        if( !show ) {
          $scope.show();
        } else {
          $scope.hide();
        }
      };

    },
    
    link: function link($scope, $element, $attrs, modelCtrl){      
      $scope.visible = false;
      $scope.loaded  = false;
      $scope.data    = "";
      $scope.templateWindow = '<div class="ajax-button-helper hidden"><div class="pointer"></div><h3 class="ajax-button-header"></h3><div class="ajax-button-context"></div></div>';
      $scope.windowName = $scope.name + '-ajax-button-window';

      var windowAlrearyAppend = $('body').find("#" + $scope.windowName).length !== 0;
      if( !windowAlrearyAppend ){
        var root       = angular.element('body');
        var window     = angular.element($scope.templateWindow);
        window.attr('id',$scope.windowName);
        root.append(window);
      }      

      $scope.$watch('visible',function(newVal){
        if( newVal && !$scope.loaded ){
        }
        return newVal;
      });
    }

  };
}]);

