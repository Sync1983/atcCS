/* global atcCS */

atcCS.directive( 'modelChange',[function (){
    'use strict';
  return {
    restrict: 'A',
    require: "ngModel",
    replace: false,
    transclude:false,
    template: '',
    scope: false,   
    controller: function controller($scope, $element, $attrs){      
    },
    link: function link(scope, element, attrs, modelCtrl, transclude){ 
      
      scope.$watch(function(modelCtrl){return modelCtrl.$viewValue ;},
      function(oldVal,newVal){
        console.log(123);
        if( angular.equals(oldVal, newVal) ){
          return;
        }
        
        console.log("asd");
        if( scope.onModelChaange instanceof Function ){          
          scope.onModelChaange(oldVal,newVal, modelCtrl);
        }
      }, true);
    }
  };
}] );




