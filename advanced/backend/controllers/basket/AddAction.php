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

    //$part->price        = $part->price / (1+($over_price/100));
    $part->rp           = floatval($part->rp);
    $part->is_original  = boolval($part->is_original);

    if( is_array($part->info) && (count($part->info)==0) ) {
      $part->info = null;
    }

    if( $part->lot_quantity <= 0 ){
      $part->lot_quantity = 1;
      $part->sell_count = 1;
    }
    
    if( !is_int($part->count) ){
      $digit            = preg_replace( '/[^0-9]/', '', $part->count);
      $part->count      = intval($digit);
      if( $part->count <=0 ){
        $part->count = $part->sell_count;
      }
    }
    
    if( !$part->validate(null,true) ){
      return ['error' => $part->getErrors() ];
    }

    try{
      $part->save(false);
      if( count($part->getErrors()) ){
        return ['error' => $part->getErrors()];
      }
      $part->refresh();
      return ['save'=>$part->sell_count];
      
    } catch (\yii\db\Exception $ex) {
      $message  = $ex->getMessage();      
      $message  = preg_replace('/CONTEXT:[.\s\S]*/im', '', $message);
      $message  = preg_replace('/[.\s\S]*ОШИБКА:/im', '', $message);
      return ['error' => [$ex->getCode()=>$message]];
    }
    

    return ['error' => [0=>'Неизвестная ошибка']];
  }
  
}
