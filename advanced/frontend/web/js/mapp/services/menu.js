/* global atcCS */

function menuControl($root, $q, $templateCache, $compile){
  var self = this;
  var body = $.find("#menu-block");
  var template = $templateCache.get('/menu-view.html');
  var scope = $root.$new(true);
  var html = $(template);
  var compile = $compile(html)(scope);
  
  scope.items = [
    {key:"a", name:"a"},
    {key:"b", name:'b'}
  ];
  
  $(body).html( compile );
  
  self.show = function(){
    $(body).fadeIn("slow").css("display","inline-block");
  };
  
  return self;  
}


atcCS.service('$menu',[
  '$rootScope', '$q', '$templateCache','$compile',
  function($rootScope,$q,$templateCache,$compile){
    return new menuControl($rootScope, $q, $templateCache, $compile);
}]);

