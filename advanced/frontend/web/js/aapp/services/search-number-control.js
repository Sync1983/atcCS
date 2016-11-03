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
  
  model.search= function change(value){
    var input = $('input#search-text');    
    var btn   = $('button#search-request');    
    input.val( String(value) );
    input.trigger('change'); 
    btn.click();
    return;
  };

  return model;
};

atcCS.service('searchNumberControl', function(){
  return searchNumberControl();
} );
