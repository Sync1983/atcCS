<?php

/**
 * @author sync1983
 */

namespace backend\models\search_engine;
use yii\base\Object;

class SearchEngine extends Object {

  private function data_from_filter($filter, $name){
    return (isset($filter[$name]) && count($filter[$name]))?$filter[$name]:false;
  }

  protected function filter_text($text_in, $mfc = [], $model = []){
    $text       = mb_strtoupper($text_in);
    $answer     = [];

    $answer['part']   = $this->getByPartId($text);
    if( count($answer['part']) == 0 ){
      unset($answer['part']);
    }

    $mfc_model        = $this->getByMFC($text, $mfc, $model);
    if( isset($mfc_model['mfc']) || isset($mfc_model['model'])){
      return array_merge($answer,$mfc_model);
    }

    $answer = array_merge($answer,['desc'=>$this->getByDescription($text_in)]);
    return $answer;
  }

  public function parse($filter_struct){
    
    $mfc    = $this->data_from_filter($filter_struct, "mfc");
    $model  = $this->data_from_filter($filter_struct, "model");
    $descr  = $this->data_from_filter($filter_struct, "descr");
    $undef  = $this->data_from_filter($filter_struct, "undef");

    if( !$undef ){
      return $filter_struct;
    }

    mb_internal_encoding("UTF-8");
    $answer = [];

    foreach ($undef as $text){
      $text = trim($text);
      $answer[$text] = $this->filter_text($text, $mfc, $model);
    }
    
    return $answer;
  }

  public function getByPartId($text){
    $articles = new \common\models\PgArticle();
    $expression = new \yii\db\Expression("'$text%'");
    $data = $articles->find()
              -> where(['LIKE','part_search_number',$expression])
              -> andWhere(['part_type'=>3])
              -> distinct()
              -> select(['part_id as ids','part_search_number as number'])              
              -> asArray(true)
              -> limit(25)
              -> all();
    $answer = [];
    foreach ($data as $row){
      $answer[$row['ids']] = $row['number'];
    }

    return $answer;
  }

  public function getByDescription($text){
    mb_internal_encoding("UTF-8");    
    $text       = mb_strtoupper($text);
    $text_len   = mb_strlen($text);
    $part_len   = 4;//$text_len;

    $tesaurus   = new \common\models\PgTesaurus();
    $rows       = $tesaurus->find()->indexBy('id')->asArray(true)->select(['id','text'])->all();
    
    for( $i = 1; $i < $text_len; $i += $part_len ){      
      $search_result = dl_array($rows, $text, $i-1, $part_len);
    }
    // Возврщаем 10 подходящих значений
    $result = dl_filter($rows,$search_result,50);
    
    $answer = [];
    foreach ($result as $value){      
      $answer[$value['id']]     = $value['text'];
    }
    return $answer;
  }

  public function getBySupplier($text){
    mb_internal_encoding("UTF-8");
    $text       = mb_strtoupper($text);
    $text_len   = mb_strlen($text);    

    $suppliers  = new \common\models\PgSuppliers();
    $rows       = $suppliers->find()->indexBy('id')->asArray(true)->select(['id','brand as text'])->all();

    $search_result = dl_array($rows, $text);

    // Возврщаем 10 подходящих значений
    $result = dl_filter($rows,$search_result,10);

    $answer = [];
    foreach ($result as $value){
      $answer[$value['id']]     = $value['text'];
    }
    return $answer;
  }

  public function getByBrand($text){
    mb_internal_encoding("UTF-8");
    $text       = mb_strtoupper($text);
    $text_len   = mb_strlen($text);

    $brands     = new \common\models\PgBrand();
    $rows       = $brands->find()->indexBy('id')->asArray(true)->select(['id','brand as text'])->all();

    $search_result = dl_array($rows, $text);

    // Возврщаем 10 подходящих значений
    $result = dl_filter($rows,$search_result,10);

    $answer = [];
    foreach ($result as $value){
      $answer[$value['id']]     = $value['text'];
    }
    return $answer;
  }

  public function getByMFC($text, $mfc = [], $model = []){
    $mfcm     = new \common\models\PgMfcModels();
    $text_len = mb_strlen($text);
    $part_len = round($text_len/4);

    $mfcs         = $mfcm->findByFilter(['mfc_id as id','mfc_txt as text','(mfc_txt) as full_name'],  "model", $model)->distinct()->asArray(true)->all();
    $mfc_models   = $mfcm->findByFilter(['model as id','model_txt as text','(mfc_txt ||\' \' || model_txt) as full_name'], "mfc_id",  $mfc)->distinct()->asArray(true)->all();

    foreach ($mfcs as $key=>$value){
      $mfcs[$key]['type'] = 'mfc';
    }

    foreach ($mfc_models as $key=>$value){
      $mfc_models[$key]['type'] = 'model';
    }

    $data = array_merge($mfcs,$mfc_models);

    for($i = 0; $i< $text_len; $i += $part_len){
      $min_distance = dl_array($data, $text, $i, $part_len);
    }

    if( $min_distance > $text_len/2 ){
      return [];
    }

    $result   = dl_filter($data, $min_distance);


    $answer   = [];
    foreach ($result as $row){
      if( !isset($answer[$row['type']]) ){
        $answer[$row['type']] = [];
      }
      $answer[$row['type']][$row['id']] = $row['full_name'];
    }

    if( isset($answer['mfc'])){
      asort($answer['mfc'],SORT_NATURAL);
    }

    if( isset($answer['model'])){
      asort($answer['model'],SORT_NATURAL);
    }

    return $answer;
  }



}
