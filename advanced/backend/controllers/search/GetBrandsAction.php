<?php

/**
 * @author sync1983
 */
namespace backend\controllers\search;
use yii\base\Action;

class GetBrandsAction extends Action{

  public function run($params){
    $data = json_decode($params);
    $searh_text = strval ( \yii\helpers\ArrayHelper::getValue($data, 'text','') );
    $use_analog = boolval( \yii\helpers\ArrayHelper::getValue($data, 'use_analog',false) );
    $clear_text = preg_replace('/\W*/i', "", $searh_text);

    if( !$clear_text ){
      return ['status' => 'Результатов не найдено'];
    }

    $engine   = new \backend\models\search\SearchEngine();
    $answer   = $engine->getBrands($clear_text, $use_analog);

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
