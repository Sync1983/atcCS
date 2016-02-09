/* global atcCS */

atcCS.filter('partOut',function(){
  return function(items,name,reverse){
    var saveItem = null;
    if( items ) {      
      for(var i in items){
        var txt = (items[i] && items[i].value) || '';
        if( txt === name ){
          saveItem = items[i];
          items.splice(i,1);
        }
      }
      if( saveItem ){
        items.unshift(saveItem);        
      }
    }
    return items;
  };
});

