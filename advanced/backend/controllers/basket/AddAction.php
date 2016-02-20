<?php

/**
 * @author sync1983
 */
namespace backend\controllers\basket;

use yii\base\Action;

class AddAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    if( !($params = json_decode($params)) ){
      return ['error' => 'Ошибка параметров'];
    }

    $user = \yii::$app->user->getIdentity();
    $over_price = $user->getAttribute('over_price');

    $part = new \backend\models\parts\PartsBasketModel();

    foreach ($params as $key=>$value){
      if ( $part->hasAttribute($key) && $key!=='id') {
        $part->setAttribute($key, $value);
      }
    }

    $part->price = $part->price / (1+($over_price/100));
    $part->is_original  = boolval($part->is_original);    

    if( !$part->validate() ){
      return ['error' => $part->getErrors() ];
    }
    
    if( $part->save() ){
      return ['save' => $part->count];
    }

    return ['error' => 'Ошибка сохранения'];
  }
  
}
