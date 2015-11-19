<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class MModelSearchAction extends Action{

  public function run($params){
    if( !($data = json_decode($params,true)) ){
      return ['error'=>'data error'];
    }
    $mmodel = $data['mmodel'];
    $models = $data['model'];
    $mfcs   = $data['mfc'];

    $search_engine = new \backend\models\search_engine\SearchEngine();        
    $answer = $search_engine->getByMFC($mmodel, $mfcs, $models);
    
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
