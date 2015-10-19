atcCS.directive('scheckbox', function (){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: '<div class="scheckbox"><label for="{{name}}_id">{{label}}</label><div class="scb-box"></div><input type="checkbox" name="{{name}}" id="{{name}}_id" /> </div>',
    transclude: true,    
    scope: {
      value: "@",
      label: "@",
      name: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude, otherInjectables){
    },
    compile: function compile(templateElement, templateAttrs){
    },
    link: function link(scope, element, attrs, modelCtrl){
    }
  };
} );


