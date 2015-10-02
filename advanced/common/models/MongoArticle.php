<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\mongodb\ActiveRecord;

class MongoArticle extends ActiveRecord{

  public static function collectionName() {
    return 'articles';
  }

  public function attributes() {
    return [
      '_id',
      'ID',
      'part_search_number',
      'part_type',      
      'part_full_number',
      'brand',
    ];
  }

  public function rules() {
    return [
      [ ['ID','part_type','brand'], 'setInt'],
      [ ['part_search_number','part_full_number'],'string']
    ];
  }

  public function setInt($attr,$params){
    $this->$attr = intval($this->$attr);
  }
  
}
