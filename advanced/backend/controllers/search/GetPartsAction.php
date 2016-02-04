<?php

/**
 * @author sync1983
 */
namespace backend\controllers\search;
use yii\base\Action;

class GetPartsAction extends Action{

  public function run($params){
    $data   = json_decode($params);
    $clsid  = strval( \yii\helpers\ArrayHelper::getValue($data, 'clsid','') );
    $ident  = strval( \yii\helpers\ArrayHelper::getValue($data, 'ident','') );    
    
    if( !$clsid || !$ident ){
      return ['count' => 0];
    }

    $engine   = new \backend\models\search\SearchEngine();
    $answer   = $engine->getParts($clsid, $ident);

    return ['count'  => count($answer),
            'rows'    => $answer];
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
