<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class MFCSearchAction extends Action{

  public function run($params){
    if( !($data = json_decode($params,true)) ){
      return ['error'=>'data error'];
    }
    
    $models = $data['model'];    

    $search_engine = new \backend\models\search_engine\SearchEngine();        
    $answer = $search_engine->getByModels($models);
    
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
