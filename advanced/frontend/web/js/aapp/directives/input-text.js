/*
 * Измененное поле ввода текста
 */
atcCS.directive('sinput', function (){
  return {
    //require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: '<div class="sinput"><input class="sinput" placeholder="{{placeholder}}" value="{{value}}" name="{{name}}"/></div>',
    transclude: true,
    // templateUrl: 'template.html',
    scope: {
      placeholder: "@",
      value: "@",
      name: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      var onFocus = function(){
        console.log('focus');
        $($element).addClass('active');
      };

      var onBlur = function(){
        $($element).removeClass('active');
      };

      $($element).children('input').on('focus',onFocus);
      $($element).children('input').on('blur',onBlur);

    },
    /*compile: function compile(templateElement, templateAttrs){
    },*/
    link: function link(scope, element, attrs, modelCtrl){

    }
  };
} );