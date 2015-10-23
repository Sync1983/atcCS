atcCS.directive('window', function (){
  return {
    //require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/window.html',
    scope: {
      header: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){
    },
    compile: function compile(templateElement, templateAttrs){      
      $(templateElement).children('div.header').html("<span>" + templateAttrs.header + "</span>");
    },
    link: function link(scope, element, attrs, modelCtrl){
      
      //$(element).children('.head').text(scope.title);
    }
  };
} );

