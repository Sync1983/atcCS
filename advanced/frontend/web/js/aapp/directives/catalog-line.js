atcCS.directive( 'catalogLine',['$events', function ($events){
  return {
    require: "ngModel",    
    //terminal: true,
    restrict: 'E',
    replace: true,    
    //transclude: false,
    template: '<li></li>',
    scope: {
      ngModel: "="
    },
    controller: function controller($scope, $element, $attrs, $transclude){
      
      var $a = angular.element('<a href="#"></a>');
      var $d = angular.element('<div class="description"></div>');
      var isGroup = $scope.ngModel.is_group;
      var name    = $scope.ngModel.name;
      var articul = $scope.ngModel.articul;
      var descr   = $scope.ngModel.descr;
      var maker   = $scope.ngModel.maker;
      var path    = $scope.ngModel.path;
      var event   = $events.get("catalogScope");
      var searchEvents = $events.get("searchScope");
      
      $a.on('click',function(eventIn){
        
        if( isGroup ){
          event.broadcast("update",{path:path, name:name});          
        } else {
          searchEvents.broadcast("StartSearchText",articul);
        };
        
        eventIn.stopPropagation();
        return false;
      });
      
      if( isGroup ){
        $a.text(name);
        $element.addClass('group');
        $element.append($a);
      } else {
        $a.text(articul + " : "+ name + " " + maker);
        $d.text(descr);
        $element.addClass('part');
        $element.append($a);
        $element.append($d);        
      }
    },
    link: function link(scope, element, attrs, modelCtrl){      
      
    }
  };
}] );




