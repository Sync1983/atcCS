/*
 * Измененное поле ввода текста
 */
atcCS.directive('sinput', function (){ 
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: '/parts/_sinput.html',
    transclude: false,    
    scope: {
      placeholder: "@",
      value: "@",
      name: "@",
      submit: "@",
      submitFunction: "=",
      changeFunction: "=",
      step: "@",
      min: "@",
      max: "@",
      type: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){   
      var input     = $($element).children('input');
      $scope.model  = null;

      var onFocus = function(){        
        $($element).addClass('active');
      };

      var onBlur = function(){
        $($element).removeClass('active');
      };

      var onKeyPress = function(event){
        
        if( event.keyCode === 13 ){
          $scope.submitFunction(event);
        }
      };

      input.on('focus',onFocus);
      input.on('blur',onBlur);
      
      if( $scope.submitFunction ){
        input.on('keypress',onKeyPress);
      }

    },
    /*compile: function compile(templateElement, templateAttrs){
    },*/
    link: function link(scope, element, attrs, modelCtrl){
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){          
          scope.model = newVal;
          return newVal;
      });

      scope.$watch(
        function(scope) { return scope.model; },
        function(newVal, oldVal){
          
          if( scope.changeFunction && !scope.changeFunction(newVal) ){
            return oldVal;
          }
          modelCtrl.$setViewValue(newVal);          
          return newVal;
      });
    }
  };
} );