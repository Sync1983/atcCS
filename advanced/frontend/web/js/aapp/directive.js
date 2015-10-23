
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


