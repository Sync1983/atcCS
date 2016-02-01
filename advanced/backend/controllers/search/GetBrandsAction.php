<?php

/**
 * @author sync1983
 */
namespace backend\controllers\search;
use yii\base\Action;

class GetBrandsAction extends Action{

  public function run($params){
    $value = strval($params);    

    return ['answer' => $value];
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
