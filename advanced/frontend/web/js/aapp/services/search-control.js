/* global atcCS */

/*
 * Сервис для обслуживания модели уведомлений
 */
atcCS.service('searchControl', function(){
  'use strict';

  var $model = {
    root: null,
    input: null,
    tagsField: null,
    iconsField: null,

    tags: {

    },
    inputPauseCallback: null,
    pauseTimer: null

  };

  var $this = this;

  function clearTags(){
    $($model.tagsField).html("");
  };

  function createTag($type, $text){    
    var close_icon = $('<span class="glyphicon glyphicon-remove"></span>');
    var icon = $('<span></span>');
    icon.text($text);
    icon.attr('type',$type);
    icon.attr('key',$text);
    icon.addClass("icon-" + $type);
    icon.append(close_icon);

    return icon;
  };

  function updateInput(){
    var paddingWidth = $($model.tagsField).width();

    $($model.input).css({
      'padding-left': paddingWidth + 20
    });
  };

  function inputTimeout(immediately){
    if( !$model.inputPauseCallback ){
      return;
    }
    
    var text = $($model.input).val();
    $model.inputPauseCallback(text,immediately);
  };

  function inputKeyDown($event){    
    clearTimeout($model.pauseTimer);
    $model.pauseTimer = null;
    if( $event.keyCode === 13){
      
      inputTimeout(true);
      $event.stopPropagation();
      return false;
    }
    return true;
  };

  function inputKeyUp(){
    if( $model.pauseTimer ){
      clearTimeout($model.pauseTimer);
    }
    
    $model.pauseTimer = setTimeout(inputTimeout,500);
  };

  
  $model.pushTag = function ($type, $tag, $ids){
    if( !$model.tags[$type] ){
      $model.tags[$type] = {};
    }
    $model.tags[$type][$tag] = $ids;
  };

  $model.removeTag = function ($type, $tag){
    $model.tags.$type.$tag = null;
  };

  $model.updateTags = function updateTags(){
    clearTags();
    
    for(var $type in $model.tags){
      var tags = $model.tags[$type];
      
      for(var $tag in tags){        
        if( tags[$tag] !== null){
          $($model.tagsField).append(createTag($type,$tag));
        }
      }

    }

    updateInput();
  };

  $model.init = function init($root, $onInputPause){
    $model.root       = $root;
    $model.input      = $($root).find('input');
    $model.tagsField  = $($root).find('div.tag-icons');
    $model.iconsField = $($root).find('div.search-icons');
    $model.inputPauseCallback = ($onInputPause instanceof Function)?$onInputPause:null;

    $($model.input).keydown(inputKeyDown);
    $($model.input).keyup(inputKeyUp);
    
  };


  return $model;

} );