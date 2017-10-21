/* global atcCS, eventsNames */

function newsActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route){  
  'use strict';
  var searchEvents;  
  var newsEvents;
  var userEvents;
  var page;
  var self = this;
  
  function init(){
    searchEvents = $events.get(eventsNames.eventsSearch());    
    newsEvents   = $events.get(eventsNames.eventsNews());    
    userEvents   = $events.get(eventsNames.eventsUser());    
    page         = $routeParams.page || false;    
    //***************************************
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin; 
    $scope.news       = [];
    //*************************************** 
    newsEvents.broadcast("getData", page);
  };
  
  this.userDataUpdate = function(event,data){    
    $scope.isLogin    = data.isLogin;        
    $scope.isAdmin    = data.isAdmin;    
  };
  
  this.newsUpdate = function(event, data){
    $scope.news = data.data || [];
    for(var item in data.data){
        data.data[item].date = Date.parse(data.data[item].date);  
        //data.data[item].full_text = htmlString(data.data[item].full_text);
    }
    console.log("News:",data);
  };
  
  this.onClick = function(row){
    if(row.is_group){        
        $route.updateParams({path:row.path});
        return;
     }
     searchEvents.broadcast("StartSearchText",row.articul);     
  };
  
  //******************************************
  init();  
  
  userEvents.setListner("userDataUpdate",self.userDataUpdate);
  newsEvents.setListner("update",self.newsUpdate);
};

atcCS.controller( 'newsControl', ['$scope', 'User' ,'$rootScope', '$confirm','$wndMng','$notify', '$events', '$routeParams', '$route', 
  function($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route ) {
        return new newsActions($scope,$user,$rootScope,$confirm,$wndMng,$notify, $events, $routeParams, $route);
}]);

