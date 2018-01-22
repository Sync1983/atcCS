/* global atcCS */

function windowControl($root, $q, $templateCache, $compile, $events){
  var self = this;
  var body = $.find("#window");
  var defer = $q.defer();
  
  self.setTemplate = function(templateAddr, scope){
    var template = $templateCache.get(templateAddr);
    var html = $(template);
    var compile = $compile(html)(scope);
    $(body).find(".window-body").html( compile );
  };
  
  $(body).find(".window-close").click(onClose);
  $(body).find("#cancel").click(onClose);
  $(body).find("#ok").click(onOk);
  
  function onClose(){
    $(body).fadeOut();
    defer.reject();
  };
  
  function onOk(){
    $(body).fadeOut();    
    defer.resolve(true);
  };
  
  self.show = function(){
    $(body).fadeIn();
    return defer.promise;
  };
  
  return self;  
}


atcCS.service('$windowSrv',[
  '$rootScope', '$q', '$templateCache','$compile', '$events',
  function($rootScope,$q,$templateCache,$compile, $events){
    return new windowControl($rootScope, $q, $templateCache, $compile, $events);
}]);

