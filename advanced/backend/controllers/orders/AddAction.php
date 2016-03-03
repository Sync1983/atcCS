<?php

/**
 * @author sync1983
 */
namespace backend\controllers\orders;

use yii\base\Action;

class AddAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    if( !($params = json_decode($params)) ){
      return ['error' => 'Ошибка параметров'];
    }
    
    $errors = [];
    $answer = [];

    foreach ($params as $id=>$price_change){
      $part = \backend\models\parts\PartsBasketModel::findOne(['id' => $id]);
      $part->setAttribute('price_change', $price_change);
      $part->save();
      if( count($part->getErrors()) ){
        \yii::error(json_encode($part->getErrors()));
      }
      $status = new \backend\models\parts\StatusModel();
      $status->setAttribute('part_id', $id);
      $status->setAttribute('status',0);
      $status->save();
      if( count($status->getErrors()) ){
        $errors[$part->articuls] = $status->getErrors();
        $answer[$id] = false;
      } else {
        $answer[$id] = true;
      }
    }

    return ['status' => $answer, 'error' => $errors];
  }
  
}
