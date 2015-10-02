<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;
use common\models\RedisArticle;

class ArticulAction extends Action{

  public function run($params){
    $value = strval($params);

    $value = trim($value);
    $value = strtoupper($value);

    $items = RedisArticle::findByPattern($params . "*");

    return $items;
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
