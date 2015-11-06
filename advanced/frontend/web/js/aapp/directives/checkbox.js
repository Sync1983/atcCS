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


