atcCS.directive('tableView', function (){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: "/table-view.html",
    transclude: false,
    scope: {  
      bindModel:'=ngModel',
      fieldNames:'=fields'
    },
    controller: function controller($scope, $element, $attrs, $transclude){   
      var model     = $scope.bindModel || {};
      var fields    = $scope.fieldNames;
      var fieldList = model[Object.keys(model)[0]];
      var header    = [];
      
      for(var hKey in fields){
        var hName = fields[hKey];
        if( hName !== false ){
          
        }
      }
      
      
      
      console.log($scope.bindModel);
    },    
    link: function link(scope, element, attrs, modelCtrl){
      console.log(modelCtrl);
    }
  };
} );


