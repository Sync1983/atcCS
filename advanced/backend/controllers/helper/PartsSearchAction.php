<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class PartsSearchAction extends Action{

  public function run($params){
    $data   = json_decode(\yii::$app->request->getRawBody(),true);
    if( !$data || !(\yii::$app->getRequest()->getContentType()==="application/json;charset=UTF-8")){
      return ['error' => 'Ошибка параметров'];
    }
    
    $descr  = \yii\helpers\ArrayHelper::getValue($data, 'descr', []);
    $models = \yii\helpers\ArrayHelper::getValue($data, 'model', []);
    $mfcs   = \yii\helpers\ArrayHelper::getValue($data, 'mfc'  , []);

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
