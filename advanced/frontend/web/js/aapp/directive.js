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

/*atcCS.directive('ajaxButton', ['$http','$compile', function ($http,$compile) {

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
}]);*/


