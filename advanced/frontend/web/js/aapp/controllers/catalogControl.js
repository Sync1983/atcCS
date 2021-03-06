/* global atcCS, eventsNames */

function catalogActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route){  
  'use strict';
  var searchEvents;
  var events;
  var userEvents;
  var path;
  var self = this;
  
  function init(){
    searchEvents = $events.get(eventsNames.eventsSearch());
    events       = $events.get(eventsNames.eventsCatalog());
    userEvents   = $events.get(eventsNames.eventsUser());    
    path         = $routeParams.path || false;  
    //***************************************
    $scope.markup     = $user.activeMarkup || 0;
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.editMode   = false;
    $scope.nodes      = [];
    $scope.path       = [];
    $scope.onClick    = self.onClick; 
    $scope.search     = "";
    //***************************************    
  };
  
  this.updateListner = function(event, data){      
      $scope.nodes  = data.nodes;
      $scope.path   = data.path;  
      for(var i in $scope.nodes){
        var row = $scope.nodes[i];      
        row.price = row.rp*(1 + $scope.markup/100);
      }
  };
  
  this.onClick = function(row){
    if(row.is_group){        
        $route.updateParams({path:row.path});
        return;
     }
     searchEvents.broadcast("StartSearchText",row.articul);     
  };
  
  this.changeNodes = function(newVal, oldVal){    
    if(angular.equals(newVal, oldVal) || (oldVal.length === 0)) {
      return; // simply skip that
    }    
    
    $scope.markup     = $user.activeMarkup || 0;
    for(var i in newVal){
      var row = newVal[i];                  
      row.price = row.rp*(1 + $scope.markup/100);
    }
    
  };
  
  this.userDataUpdate = function(event,data){    
    $scope.isLogin    = data.isLogin;        
    $scope.isAdmin    = data.isAdmin;    
  };
  
  $rootScope.$on('markupValueChange', function(event, data){
      $scope.markup     = data.value;      
      for(var i in $scope.nodes){
        var row = $scope.nodes[i];      
        row.price = row.rp*(1 + $scope.markup/100);
      } 
  });
  
  //******************************************
  init();
  
  events.setListner("update",self.updateListner);
  events.broadcast("getData",path);
  
  userEvents.setListner("userDataUpdate",self.userDataUpdate);
  $scope.$watch("nodes", self.changeNodes, true);
  
};

atcCS.controller( 'catalogControl', [
  '$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify', '$events', '$routeParams', '$route', 
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route ) {
        return new catalogActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route);
}]);

