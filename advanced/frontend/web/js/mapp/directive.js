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


