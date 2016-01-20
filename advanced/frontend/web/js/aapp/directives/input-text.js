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
      submitFunction: "&"
    },
    controller: function controller($scope, $element, $attrs, $transclude){      
      $scope.model = null;

      var onFocus = function(){        
        $($element).addClass('active');
      };

      var onBlur = function(){
        $($element).removeClass('active');
      };

      var onKeyPress = function(event){
        if( event.charCode === 13 ){
          $scope.submitFunction(event);
        }
      };

      $($element).children('input').on('focus',onFocus);
      $($element).children('input').on('blur',onBlur);
      if( $scope.submit ){
        $($element).children('input').on('keypress',onKeyPress);
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
        function(newVal){          
          modelCtrl.$setViewValue(newVal);          
          return newVal;
      });
    }
  };
} );