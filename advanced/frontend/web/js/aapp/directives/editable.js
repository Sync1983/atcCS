atcCS.directive( 'editable',['$events', function ($events){
  return {
    restrict: 'A',    
    replace: true,
    transclude:true,
    template: '<span class="editable-element"><span class="editable-text" ng-transclude/><input class="editable-input" type="text" value={{text}} /><span class="editable-input-resize"/><button class="editable-start"><span class="glyphicon glyphicon-pencil"></span></button></span>',
    scope: {      
      eVal:"="      
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      var btn = angular.element($element).children("button.editable-start");      
      var txt = angular.element($element).children("span.editable-text");      
      var input = angular.element($element).children("input.editable-input");      
      var resize= angular.element($element).children("span.editable-input-resize");      
      
      $scope.resize = resize;
      $scope.input  = input;
      
      btn.on('click', function(event){
        input.val(txt.text());
        input.width(txt.width());
        $element.toggleClass('edit');
        input.focus();    
        event.stopPropagation();
        return false;
      });
      
    },
    link: function link(scope, element, attrs, modelCtrl, transclude){       
      scope.input.keypress(function(event){        
        scope.resize.text(scope.input.val());
        scope.input.width(scope.resize.width());
        
        if (event.which === 13) {
          console.log(scope);
          element.removeClass('edit');  
          scope.$apply(function(){
            scope.eVal = scope.input.val();            
          });           
        }
      });  
      
    }
  };
}] );




