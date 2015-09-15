
atcCS.directive('xngFocus', function(){
  
    return function($scope, $element, $attrs){
      
        return $scope.$watch($attrs.xngFocus, 
          function ($newValue){
                        
            return $newValue && $element[0].focus();
            
        });        
    };    
});