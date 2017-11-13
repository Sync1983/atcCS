/* global atcCS */

function menuControll($root, $q){
  var self = this;
  
  return self;  
}


atcCS.service('$menu',[
  '$rootScope', '$q',
  function($rootScope,$q){
    return new menuControl($rootScope,$q);
}]);

