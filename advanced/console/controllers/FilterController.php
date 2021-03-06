<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;

class FilterController extends Controller{

  public function actionGetModels(){        

  }

  public function actionFind($text = null,$filters = null){
    $data = [
      'mfc'   => [],
      'model' => false,
      'undef' => ['nissan', 'ad',' порш ', "1134"]
    ];
    $engine = new \backend\models\search_engine\SearchEngine();
    $result = $engine->parse($data);
    print_r($result);
  }

  public function actionCreateTesaurus(){
    $descr = new \common\models\PgDescription();
    $rows = $descr->find()->asArray()->all();
    $tesaurus = [];
    foreach ($rows as $row) {
      $id     = $row['id'];
      $text   = $row['desc'];
      $text   = mb_strtoupper($text);
      $text   = str_replace('"', '', $text);
      $text   = preg_replace('/[\(\)\[\];\.,\/\\\\_]+/', ' ', $text);
      $parts  = preg_split('/[ ]+/', $text);

      foreach ($parts as $part){
        if( mb_strlen($part) < 3 ){
          continue;
        }
        if( !isset($tesaurus[$part]) ){
          $tesaurus[$part] = [];
        }
        $tesaurus[$part][] = $id;
      }
    }
    ksort($tesaurus,SORT_NATURAL);
    foreach ($tesaurus as $text=>$ids){
      $link = new \common\models\PgTesaurus();
      $link->setAttribute('text', $text);
      $link->setAttribute('ids', $ids);
      $link->save();
    }
    Echo "Ok\r\n";
  }

  public function actionConvertFile($file,$file_out){
    echo "Обрабатываем файл '$file' => '$file_out' \r\n";
    $fout = fopen($file_out, "w");
    $f = fopen($file, "r");
    $pos = 0;
    while( !feof($f)){
      $line   = fgets($f);
      $line   = preg_replace("/[\r\n\?\.]*/im",'', $line);
      $line   = preg_replace('/(.{1})\1*/i','$1',$line);
      $line   = utf8_decode($line);
      $parts  = explode("\t", $line);
      $id     = $parts[0] * 1;
      $number = $parts[1];
      $length = strlen($number);

      if( $length < 3 ){
        continue;
      }

      $number_parts = str_split($number);

      $key = $number_parts[0] . $number_parts[1] . $number_parts[2];

      $str = "$key@$id";
      fputs($fout, $str, strlen($str));

      /*$node = new \common\models\FilterTreeItem([
              'primaryKey' => $key
      ]);

      $node->append($id);*/

      for( $i = 3; $i < $length; $i++){
        $key .= $number_parts[$i];
        /*$node = new \common\models\FilterTreeItem([
                'primaryKey' => $key
        ]);
        $node->append($id);*/
        $str = "$key@$id";
        fputs($fout, $str, strlen($str));
      }
      
      $pos ++;
      if( ($pos % 1000) === 0){
        echo "Обрабатываем линию $pos " . $key . "\r\n \033[2F";
      }
    }
    fclose($f);
    fclose($file_out);
  }

}
