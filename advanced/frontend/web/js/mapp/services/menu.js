/* global atcCS */

function menuControl($root, $q, $templateCache, $compile, $events){
  var self = this;
  var body = $.find("#menu-block");
  var template = $templateCache.get('/menu-view.html');
  var scope = $root.$new(true);
  var html = $(template);
  var compile = $compile(html)(scope);
  self.listner    = undefined;
  self.eventName  = undefined;
          
  scope.items = [  ];
  
  $(body).html( compile );
  $(body).find(".menu-close").click(function(){ self.hide(); });
  
  scope.onClick = function(id){
    if(self.listner && self.eventName ){
      self.listner.broadcast(self.eventName, id);
    }    
    self.hide();
  };
  
  self.show = function(){
    $(body).fadeIn("slow").css("display","inline-block");
  };
  
  self.hide = function(){    
    $(body).fadeOut("slow");
  };
  
  self.clear = function(){
    scope.items = new Array();
  };
  
  self.setEventsListner = function(listner, eventName){
    self.listner = listner;
    self.eventName = eventName;
  };
  
  self.addItem = function(id, name,bubble){    
    scope.items.push({key:id, name:name, bubble});
  };
  
  return self;  
}


atcCS.service('$menu',[
  '$rootScope', '$q', '$templateCache','$compile', '$events',
  function($rootScope,$q,$templateCache,$compile, $events){
    return new menuControl($rootScope, $q, $templateCache, $compile, $events);
}]);

