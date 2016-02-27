<?php

/**
 * @author sync1983
 */
namespace backend\controllers\basket;

use yii\base\Action;

class UpdateAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    if( !($params = json_decode($params,true)) ){
      return ['error' => 'Ошибка параметров'];
    }

    $user     = \yii::$app->user->getId();
    $pid      = $params['id'];
    $comment  = $params['comment'];
    $count    = $params['count'];

    $SQL      = <<<SQL
      SELECT * FROM "Basket"
      WHERE id=$pid
      AND basket_id IN (SELECT * FROM get_active_basket($user));
SQL;
    $part     = \backend\models\parts\PartsBasketModel::findBySql($SQL)->one();

    $part->setAttribute('comment', strval($comment));
    $part->setAttribute('sell_count', intval($count));

    try{
      return $part->save()?['save'=>$part->sell_count]:['error' => $part->getErrors()];
    } catch (\yii\db\Exception $ex) {
      $message  = $ex->getMessage();      
      $message  = preg_replace('/CONTEXT:[.\s\S]*/im', '', $message);
      $message  = preg_replace('/[.\s\S]*ОШИБКА:/im', '', $message);
      return ['error' => [$ex->getCode()=>$message]];
    }
    

    return ['save' => 'ok'];
  }
  
}
