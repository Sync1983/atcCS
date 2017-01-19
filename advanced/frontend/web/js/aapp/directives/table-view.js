
atcCS.directive('tableTemplate', function ($compile){
  return {    
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: "",
    transclude: false,    
    scope: {
      tpl: "=template",
      row: "=data"
    },
    link: function(scope, element, attrs){
      element.replaceWith( $compile(scope.tpl)(scope.$parent) );      
    }    
  };
} );

function dataController(data){
  var self = this;
  
  self.$headers = [];
  self.$group = [];
  self.$data = data;
  
  self.appendData = function( newData ){
    
    for(var key in newData){
      
    }
  };
  
  self.initHeaders = function(){
    
  }
  
  
}

function tableViewController($compile, $parse){
  return function($scope, $element, $attrs, $transclude){
    console.log($scope);
    var model     ;
    var header    ;
    var templates ;
    var hlight    ;
    var makers    ;
    var cols      ;   
    var sort      ;
    
    function updateVars(){
      model     = $scope.modelValue() || {};
      header    = model && model.fields;        
      templates = model && model.templates || {};
      hlight    = model && model.hightlight || {};
      makers    = makers || [];
      sort      = {};
      cols      = 1;
      $scope.header = header;
     
      for(var hKey in header){        
        header[hKey].align = header[hKey].align || "center";
        header[hKey].template = templates[hKey] || ("<span>{{row." + hKey + "}}</span>");
        cols++;
      }
    }
  
    $scope.dataUpdate = function(updateFull = true){
      if(updateFull){
        updateVars();        
      }
      
      for( var mKey in model.data ){
        var maker = makers[mKey] || {};
        var show = maker.show || false;
        console.log(mKey);
        makers.push({name: mKey, show: show, extend: false, data: model.data[mKey], cols: cols});
      }
      console.log(makers);
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
    
    $scope.onSortClick = function(event,key){
      var add = event.ctrlKey;
      var hasVal = sort.hasOwnProperty(key);
      var val = hasVal?(sort[key]):1;
      var newVal = (val*-1);
              
      if( !add ){
        sort = {};
      }
      
      sort[key] = newVal;
     
      $scope.reSort();
    };
    
    $scope.sortDir = function(key){
      return sort[key] || 0;
    };
    
    function sortMakers(m,s){
      var newObj = {};      
      var keys   = Object.keys(m);
      
      keys.sort();
      
      for(var i in keys){
        var key = keys[i];        
        newObj[key] = m[key];
      }
      
      return newObj;
    }
    
    $scope.headerComparator = function(a,b,c){
      console.log(a,b,c);
    };
    
    $scope.reSort = function(){
      if( model.headerSort ){
        $scope.makers = model.headerSort($scope.makers, sort);
      } else {
        $scope.$applyAsync(function(){
          $scope.makers = sortMakers($scope.makers, sort);
        });
      }
      //$scope.dataUpdate(false);
      //);
    };
    
    //$scope.dataUpdate();      
  };
}

atcCS.directive('tableView', function ($compile){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: "/table-view.html",
    transclude: false,
    scope: true,
    bindToController: true,
    controller: tableViewController($compile),
    link: function link(scope, element, attrs, modelCtrl){  
      
      scope.modelValue = function () {        
        return modelCtrl.$viewValue;
      };
            
      scope.$watch(
        function() { return modelCtrl.$viewValue; }, 
        function(){
          scope.dataUpdate();
      },true);
    }
  };
} );


