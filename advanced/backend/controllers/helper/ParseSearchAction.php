<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class ParseSearchAction extends Action{

  public function run($params){
    if( !($data = json_decode($params,true)) ){
      return ['error'=>'data error'];
    }
    
    $search_engine = new \backend\models\search_engine\SearchEngine();    
    $by_brand = $search_engine->getByBrand($data['text']);
    $by_sup   = $search_engine->getBySupplier($data['text']);
    $by_descr = $search_engine->getByDescription($data['text']);
    
    return ['sup'   => $by_sup,
            'brand' => $by_brand,
            'descr' => $by_descr];
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
