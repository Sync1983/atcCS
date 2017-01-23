/* global atcCS, ObjectHelper */

function tableViewFactory($rootScope, $log, $filter){
  return tableViewCtrl;
  
  function tableViewCtrl($conf){
    
    var self = this;
    
    function sortHeader(sort){
      return function(headA, headB){
        if( headA.name > headB.name ){
          return 1;
        } else if( headA.name < headB.name ){
          return -1;
        }
        return 0;
      };
    }
    
    function sortRows(){
      
    }
    
    function onEvent($event){
      $log.info("Fired event" + $event);
    }
    
    function onHeader($id){
      
    }
    
    function addRowGroup($group, $data){      
      for(var i in $data){        
        $data[i]['$group'] = $group;
      }
    }
    
    function addRowData($data){
      for(var i in $data){
        self.$data.push($data[i]);
      }
    }
    
    function addData($newData){
      
      for(var mKey in $newData){
        var data = $newData[mKey];
        
        addRowGroup(mKey, data);
        addRowData(data);
        
        self.$rowGroups.push({
          name: mKey, 
          show: false, 
          extend: false});
      }
      self.$rowGroups.sort(self.sortHeader(self.sort));
    }
    
    function initDefault($init){      
      self.$columns    = {};
      self.$rowGroups  = [];
      self.$rows       = [];
      self.$data       = [];
      self.hlight      = {};
      self.template    = {};
      self.addData     = addData;
      self.sortHeader  = sortHeader;
      self.sortRows    = sortRows;
      self.onEvent     = onEvent;      
      self.sort        = {};
      
      for(var i in $init){
        self[i] = $init[i];
      }
    }
    
    initDefault($conf);
    
    return self;
    
  }
  
}

atcCS.factory('tableViewData', ['$rootScope', '$log', '$filter', tableViewFactory]);


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

function tableViewController($compile, $parse, $sce){
  return function($scope, $element, $attrs, $transclude){        
    var model         = $scope.bindModel;    
    
    $scope.$columns   = model.$columns;
    $scope.$rows      = model.$rows;
    $scope.$rowGroups = model.$rowGroups;
    $scope.$sort      = model.sort;
    $scope.$data      = model.$data;
    $scope.template   = model.template;
    
    
    $scope.isHiLight = function(row){
      var flag = true;
      
      for( var hKey in model.hlight){
        if((!model.hlight[hKey]) || ( String(row[hKey]).toUpperCase() !== String(model.hlight[hKey]).toUpperCase() )){
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
        $scope.sort = {};
      }
      
      $scope.sort[key] = newVal;
     
      //$scope.reSort();
    };
    
    $scope.sortDir = function(key){
      return ($scope.$sort[key] || 0);
    };
    
    $scope.getTemplate = function (key){           
      return ($scope.template[key] || "<span>{{row."+key+"}}</span>");
    };
    
    $scope.getColumnsCount = function (){
      return Object.keys($scope.$columns).length;
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

function tableViewDirective ($compile,$parse, $sce){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    templateUrl: "/table-view.html",
    transclude: false,
    scope: {
      bindModel: "=ngModel"
    },
    controller: tableViewController($compile,$parse,$sce),
    link: function(scope, element,attributes){
      console.log(attributes);
    }
  };
}

atcCS.directive('tableView', ["$compile", "$parse", "$sce", tableViewDirective] );


