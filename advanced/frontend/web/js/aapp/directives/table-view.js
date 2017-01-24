/* global atcCS, ObjectHelper */

function tableViewFactory($rootScope, $log, $filter){
  return tableViewCtrl;
  
  function tableViewCtrl($conf){
    
    var self = this;
    
    function sortGroups(sort){
      return function(headA, headB){
        if( headA.name > headB.name ){
          return 1;
        } else if( headA.name < headB.name ){
          return -1;
        }
        return 0;
      };
    }
    
    function sortRows(sort){
      
      function isNumeric(obj) {
        return !isNaN(obj - parseFloat(obj));
      }
      
      function calcWeight(rowA, rowB, sort){
        var weightA = 0;
        var weightB = 0;        
        var A,B;
        
        for(var cKey in sort){
          
          if( isNumeric(rowA[cKey]) && isNumeric(rowB[cKey]) ){
            A = parseFloat(rowA[cKey]);
            B = parseFloat(rowB[cKey]);
          } else {
            A = String(rowA[cKey]).toUpperCase();
            B = String(rowB[cKey]).toUpperCase();            
          }
          
          if( A > B ){
            weightA += sort[cKey];
          } else if( A < B){
            weightB += sort[cKey];            
          }
          
        }
        
        if( weightA > weightB ){
          return 1;
        } else if( weightA < weightB ){
          return -1;
        }
        
        return 0;
        
      }
      
      return function(rowA, rowB){
        return calcWeight(rowA, rowB, sort);
      };
    }
    
    function reSort(obj){
      self.$rowGroups.sort(self.sortGroups(obj));
      self.$data.sort(self.sortRows(obj));      
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
    
    function addRowGroupItem(name){
      
      for(var i in self.$rowGroups){
        if( self.$rowGroups[i].name === name ){
          return;
        }
      }
      
      self.$rowGroups.push({
          name: name, 
          show: false, 
          extend: false});
    }
    
    function addData($newData){
      
      for(var mKey in $newData){
        var data = $newData[mKey];        
        addRowGroup(mKey, data);
        addRowData(data);
        addRowGroupItem(mKey);        
      }
      
      self.reSort(self.sort);
    }
    
    function initDefault($init){      
      self.$columns    = {};
      self.$rowGroups  = [];
      self.$rows       = [];
      self.$data       = [];
      self.hlight      = {};
      self.template    = {};
      self.addData     = addData;
      self.sortGroups  = sortGroups;
      self.sortRows    = sortRows;
      self.reSort      = reSort;
      self.filter      = undefined;
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
      row: "=data",
      scp: "=parentScope"
    },
    link: function(scope, element, attrs){
      var newScope = scope.scp.$new(false);
      newScope.row = scope.row;
      element.replaceWith( $compile(scope.tpl)(newScope) );      
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
        if( (!model.hlight[hKey]) || ( String(row[hKey]).toUpperCase() !== String(model.hlight[hKey]).toUpperCase() )){
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
      var hasVal = $scope.$sort.hasOwnProperty(key);
      var val = hasVal?($scope.$sort[key]):1;
      var newVal = (val*-1);
              
      if( !add ){
        $scope.$sort = {};
      }
      
      $scope.$sort[key] = newVal;     
      model.reSort($scope.$sort);
    };
    
    $scope.sortDir = function(key){
      return ($scope.$sort[key] || 0);
    };
    
    $scope.getTemplate = function (key){           
      return ($scope.template[key] || "<span>{{row."+key+"}}</span>");
    };
    
    $scope.getColumnsCount = function (){
      return Object.keys($scope.$columns).length;
    };
    
    $scope.dataFilter = function(data){
      if( model.filter ){
        return model.filter(data);
      }      
      return true;
    };
    
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
      bindModel: "=ngModel",
      extScope: "=ngExtrScope"
    },
    controller: tableViewController($compile,$parse,$sce)    
  };
}

atcCS.directive('tableView', ["$compile", "$parse", "$sce", tableViewDirective] );


