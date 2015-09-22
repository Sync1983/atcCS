<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\redis\ActiveRecord;

class RedisArticle extends ActiveRecord {

  public $id;
  public $article;  
  public $supply;
  public $descrRU;
  public $descrEN;

  public function save($runValidation = true, $attributeNames = NULL){
    $key = "ART-" . $this->article;
    $obj = json_encode($this);
    return $this->getDb()->executeCommand("SET",[$key,$obj]);
  }

  public function attributes() {
    return [
      'id',
      'article',
      'supply',
      'descrRU',
      'descrEN',
    ];
  }

  public function rules() {
    return [['id','article','supply','descrRU','descrEN'],'safe'];
  }

}
