<?php

/**
 * @author sync1983
 */

namespace backend\models\search_engine;
use yii\base\Object;

class SearchEngine extends Object {

  public function getByDescription($text){
    mb_internal_encoding("UTF-8");
    $time = microtime(true);
    $text       = mb_strtoupper($text);
    $text_len   = mb_strlen($text);
    $tesaurus   = new \common\models\PgTesaurus();
    $rows       = $tesaurus->find()->indexBy('id')->asArray(true)->select(['id','text'])->all();
    $text_parts = [];
    $filtred    = $rows;
    
    for( $i = 0; $i < $text_len; $i += 2 ){
      $text_parts[] = mb_substr($text, $i, 3);
    }

    for( $j = 0; $j < count($text_parts); $j ++ ){
      $text_part = $text_parts[$j];      
      $this->searchByPart($filtred, $text_part, $j * 2 );
    }

    
    /*$result = [];

    $keys = array_keys($filtred[0]);

    foreach ($keys as $db_key){
      
      $result[$db_key]['distance'] = 0;
      $result[$db_key]['id']       = $db_key;
      $result[$db_key]['text']     = $filtred[0][$db_key]['full_text'];

      for( $i = 0; $i < count($filtred); $i++){
        $result[$db_key]['distance'] += $filtred[$i][$db_key]['distance']/2;
      }

    }*/

    $sort = function($A,$B){
      return $A['distance'] >= $B['distance'];      
    };

    usort($filtred, $sort);
    
    $result = array_slice($filtred, 0, 5);
    echo "Time: ". (microtime(true) - $time) . "\r\n";
    return $result;
  }

  public function searchByPart(&$data, $text, $offset){    
    $dt = 0;
    foreach ($data as $row){
      $db_id    = $row['id'];
      $db_text  = mb_substr($row['text'], $offset, mb_strlen($text));
      $db_text1 = mb_substr($row['text'], $offset-1, mb_strlen($text));
      $db_text2 = mb_substr($row['text'], $offset+1, mb_strlen($text));
      $time = microtime(true);
      /* Внимание!!!
       * Функция находится в файле console/php_extension/dl_core/modules
       * Необходимо добавить ini-файл c текстом extension=dl_core.so
       * И скопировать сам файл dl_core.so в папку с расширениями php
       */
      $text_distance = min(
          dl_core($db_text,$text),
          dl_core($db_text1,$text),
          dl_core($db_text2,$text)
          );
      $dt += (microtime(true) - $time);
      if ( !isset($data[$db_id]['distance']) ){
        $data[$db_id]['distance'] = 0;
      }

      $data[$db_id]['distance'] += $text_distance;      
    }
    echo "DT: $dt\r\n";
  }

  public function timeTest(){
    $text1 = "qwertyuiop";
    $text2 = "asd";
    $arr = [0=>0,1=>0];
    $i = 0;

    $time = microtime(true);

    for( $i = 0; $i< 100000; $i++){
      $time1 = microtime(true);
      $arr[1] = ($arr[1] + dl_core($text1, $text2)) /2;
      $time1 = microtime(true)-$time1;
      $arr[0] = ($arr[0] + $time1)/2;
    }

    $time = microtime(true) - $time;

    echo "Timer 2: $time s.\r\n";
    var_dump($arr);
  }

}
