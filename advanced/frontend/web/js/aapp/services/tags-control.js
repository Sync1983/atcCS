/* global atcCS */

/*
 * Сервис для обслуживания модели уведомлений
 */

function tagsModel(){
  'use strict';
  var model = {
    root: null,
    tags: []
  };

  function onClose(model, tag){
    return function(){
      model.removeTag(tag);
    };
  }

  function createTag(model, tag){
    var close_icon = $('<span class="glyphicon glyphicon-remove"></span>');
    var icon = $('<span></span>');
    icon.text(tag.text);
    icon.attr('type',tag.type);
    icon.attr('key',tag.type);
    icon.addClass("tag");
    icon.addClass("icon-" + tag.type);
    icon.append(close_icon);

    $(close_icon).click(onClose(model, tag));

    return icon;
  };

  function clearTags(model){
    model.root.html("");
  };

  model.init = function init(root){
    var model = tagsModel();
    model.root= $(root);
    return model;
  };

  model.pushTag = function (tag){    
    this.tags.push(tag);
    this.updateTags();
  };

  model.removeTag = function (tag){
    for(var i in this.tags){
      if (this.tags[i] === tag){
        this.tags[i] = null;
        delete this.tags[i];
      }
    }
    this.updateTags();
  };

  model.updateTags = function updateTags(){
    clearTags(this);    
    for(var i in this.tags){
      var tag = this.tags[i];      
      this.root.append( createTag(this, tag) );
    }
  };

  model.getTags = function getTags(field, value){
    if( !field || !value){
      return this.tags;
    }
    var answer = [];
    
    for(var i in this.tags){
      var tag = this.tags[i];

      if( tag[field] === value ){
        answer.push(tag);
      }
    }

    return answer;
  };

  model.getTagsOneField = function getTagsOneField(field, value, filtredField){
    var data    = this.getTags(field,value);
    var answer  = [];

    for(var i in data){
      answer.push(data[i][filtredField]);
    }

    return answer;
  };

  model.length = function length(){
    return this.tags.length;
  };

  return model;
};

atcCS.service('tagsControl', function(){
  return tagsModel();
} );