<?php

/**
 * @author sync1983
 */

namespace backend\models\search_engine;
use yii\base\Object;

class SearchEngine extends Object {

  public function getByDescription($text){
    mb_internal_encoding("UTF-8");    
    $text       = mb_strtoupper($text);
    $text_len   = mb_strlen($text);
    $part_len   = round($text_len / 2);

    $tesaurus   = new \common\models\PgTesaurus();
    $rows       = $tesaurus->find()->indexBy('id')->asArray(true)->select(['id','text'])->all();
    
    for( $i = 1; $i < $text_len; $i += $part_len ){      
      $search_result = dl_array($rows, $text, $i-1, $part_len);      
    }
    // Возврщаем 10 подходящих значений
    $result = dl_filter($rows,$search_result,10);
    
    $answer = [];
    foreach ($result as $value){      
      $answer[$value['id']]     = $value['text'];
    }
    return $answer;
  }

}
