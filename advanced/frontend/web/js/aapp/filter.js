/* global atcCS */


atcCS.filter('inputHelper', [function(){
  'use strict';
  
  return function(input,value){
    var result = {};
    
    if( !value ){
      return input;
    }

    value = String(value).toUpperCase();

    for (var i in input){
      var item = input[i];
      var article = item.article && String(item.article).toUpperCase() || "";
      var supply =  item.supply  && String(item.supply).toUpperCase() || "";
      
      if( (article.indexOf(value) > -1) || (supply.indexOf(value) > -1) ){    
        result[i] = item;
      }
    }
    
    return result;
    
  };
}]);