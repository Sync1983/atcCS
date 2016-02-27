<?php

/**
 * @author sync1983
 */
namespace backend\controllers\basket;

use yii\base\Action;

class GetDataAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    $uid = \yii::$app->user->getId();
    
    $SQL = <<<SQL
        SELECT 
          id, 
          EXTRACT(EPOCH FROM date) as date,
          shiping, 
          sell_count, 
          price, 
          articul, 
          maker, 
          name,
          comment,
          lot_quantity,
          count
        FROM "Basket" bs
        WHERE
          bs.basket_id IN (
            SELECT * FROM get_active_basket($uid)
          )
        ;
SQL;
    /* @var $db \yii\db\Connection */
    $db = \yii::$app->getDb();
    $result = $db->createCommand($SQL)->queryAll();    

    return $result;//['error' => 'Ошибка сохранения'];
  }
  
}
