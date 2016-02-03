/* global atcCS */

function searchNumberControl(){
  'use strict';
  var model = {};

  model.change = function change(value){
    var input = $('input#search-text');    
    input.val( String(value) );
    input.trigger('change'); 
    return;
  };

  return model;
};

atcCS.service('searchNumberControl', function(){
  return searchNumberControl();
} );
