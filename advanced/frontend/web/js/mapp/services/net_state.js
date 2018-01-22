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


atcCS.directive('netState',['$rootScope',  function($rootScope){
    return {
    require: 'ngModel',
    restrict: 'E',
    scope: {
      ngModel: '='
    },
    template: "<span ng-show='ngModel>0' ng-class=\"{'wait':ngModel===1,'glyphicon glyphicon-ok':ngModel===2,'glyphicon glyphicon-remove':ngModel===3}\"></span>",
    replace: true
  };
}]);

