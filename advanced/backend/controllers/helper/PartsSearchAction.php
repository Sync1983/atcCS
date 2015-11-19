<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class PartsSearchAction extends Action{

  public function run($params){
    if( !($data = json_decode($params,true)) ){
      return ['error'=>'data error'];
    }
    $descr  = $data['descr'];
    $models = $data['model'];
    $mfcs   = $data['mfc'];

    $search_engine = new \backend\models\search_engine\SearchEngine();        
    $answer = $search_engine->getParts($mfcs, $models, $descr);
    
    return $answer;
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
