<?php

/**
 * @author sync1983
 */
namespace backend\controllers\basket;

use yii\base\Action;

class DeleteAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    if( !$params ){
      return ['error' => 'Ошибка параметров'];
    }

    $user     = \yii::$app->user->getId();
    $pid      = intval($params);

    $SQL      = <<<SQL
      SELECT * FROM "Basket"
      WHERE id=$pid
      AND basket_id IN (SELECT * FROM get_active_basket($user));
SQL;
    $part     = \backend\models\parts\PartsBasketModel::findBySql($SQL)->one();

    try{
      return $part->delete()?['delete'=>'ok']:['error' => $part->getErrors()];
    } catch (\yii\db\Exception $ex) {
      $message  = $ex->getMessage();      
      $message  = preg_replace('/CONTEXT:[.\s\S]*/im', '', $message);
      $message  = preg_replace('/[.\s\S]*ОШИБКА:/im', '', $message);
      return ['error' => [$ex->getCode()=>$message]];
    }    

    return ['delete' => 'ok'];
  }
  
}
