
atcCS.directive('tableTemplate', function ($compile, $parse){
  return {    
    priority: 0,
    terminal: false,
    restrict: 'AE',
    replace: true,
    template: "",
    transclude: false,    
    scope: {
      row: "=data",
      tpl:  "=template"
    },
    link: function(scope, element){
      element.replaceWith( $compile(scope.tpl)(scope) );      
    }    
  };
} );

function tableViewController($compile, $parse){
  return function($scope, $element, $attrs, $transclude){
    var model     = $scope.bindModel || {};
    var header    = model && model.fields;        
    var templates = model && model.templates || {};
    var hlight    = model && model.hightlight || {};
    var makers    = {};
    var cols      = 1;
    
    $scope.header = header;
      
    for(var hKey in header){
      header[hKey].sort = 0;
      header[hKey].align = header[hKey].align || "center";
      header[hKey].template = templates[hKey] || ("<span>{{row." + hKey + "}}</span>");
      cols++;
    }
  
    $scope.dataUpdate = function(){
      makers = {};
      
      for( var mKey in model.data ){
        makers[mKey] = {name: mKey, show: false, extend: false, data: model.data[mKey], cols: cols};
      }
      
      $scope.makers = makers;      
    };
    
    $scope.isHightlight = function(row){
      var flag = true;
      for( var hKey in hlight){
        if( String(row[hKey]).toUpperCase() !== String(hlight[hKey]).toUpperCase() ){
          flag = false;
        }
      }
      return flag;
    };
    
    $scope.onToggle = function(item){
      item.show = !item.show;
      return false;
    };
    
    $scope.dataUpdate();      
  };
}

atcCS.directive('tableView', function ($compile, $parse){
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
    },
    controller: tableViewController($compile, $parse),    
    link: function link(scope, element, attrs, modelCtrl){      
      
      scope.$watch(
        function(scope) { return modelCtrl.$viewValue; }, 
        function(newVal, oldVal){          
          if( angular.equals(oldVal, newVal) ){
            return;
          }
          
          scope.bingModel = newVal;
          scope.dataUpdate();
      },true);
    }
  };
} );


