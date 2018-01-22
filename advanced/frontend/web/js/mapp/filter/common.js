/* global atcCS, cqEvents, eventsNames, ObjectHelper */

atcCS.filter('ObjectLength', function() {
  return function(object) {
    return Object.keys(object).length;
  };
});

atcCS.filter('percent',function(){
  return function(text,value){
    var pc = 1 + (value/100);
    var res = text * pc;
    if( isNaN(res) ){
      res = text;
    }
    return res;
  };
});
