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

      console.log(element[0].style);

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