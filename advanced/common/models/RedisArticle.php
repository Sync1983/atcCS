<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\redis\ActiveRecord;

class RedisArticle extends ActiveRecord {
  const  prefix = "ART-";
  public $id;
  public $article;  
  public $supply;
  public $descrRU;
  public $descrEN;

  public static function findByPattern($pattern){
    /* @var $db Connection|ServiceLocator */
    $db = self::getDb();

    $keys = $db->KEYS(self::prefix . $pattern );
    $count = count($keys);

    $keysPart = array_slice($keys, 0, 50);
    if( count($keysPart) <= 0 ){
      return [];
    }
    
    $dbItems = $db->executeCommand("MGET",$keysPart);
    $items = array_map(function($item){
        return json_decode($item);
      },
    $dbItems);

    $items['count'] = $count;
    return $items;
  }

  public function save($runValidation = true, $attributeNames = NULL){
    $key = self::prefix . $this->article;
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
