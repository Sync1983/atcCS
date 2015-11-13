atcCS.directive('searchLine', ['User','searchControl', function ($user,$searchCtrl){
  return {    
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/search-line.html',
    scope: {},
    controller: function controller($scope, $element, $attrs, $transclude){

      $searchCtrl.pushTag('sup','NISSAN',[1,2,3,4]);
      $searchCtrl.pushTag('brand','GNK',[1,2,3,4]);
      $searchCtrl.pushTag('model','AD',[1,2,3,4]);
      $searchCtrl.pushTag('part','256G3','256G3');

      $searchCtrl.init($($element), function textValid(text,byEnter){
        console.log(text);
        $user.parseSearch(text,{}).then(
          function success(answer){
            console.log(answer);
          },
          function error(answer){
            console.log("Error", answer);
          });
      });
      $searchCtrl.updateTags();      
    },
    compile: function compile(templateElement, templateAttrs){
      
    },
    link: function link(scope, element, attrs, modelCtrl){
      
      //$(element).children('.head').text(scope.title);
    }
  };
}] );