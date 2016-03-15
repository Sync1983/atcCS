<?php

/**
 * @author sync1983
 */
namespace backend\controllers\orders;

use yii\base\Action;

class GetDataAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    $uid = \yii::$app->user->getId();
    
    $SQL = <<<SQL
        SELECT 
          bs.id,
          EXTRACT(EPOCH FROM bs.date) as date,
          bs.shiping,
          bs.sell_count,
          bs.price,
          bs.articul,
          bs.maker,
          bs.name,
          bs.comment,
          bs.lot_quantity,
          bs.count,
          ub.name     as basket_name,
          stt.id      as part_status_id,
          stt.txt     as part_status,
          sti.time    as change_time
        FROM "Basket" bs
        INNER JOIN "UserBasket" ub
          ON  ub.basket_id = bs.basket_id
          AND ub.uid = $uid
        INNER JOIN (
            SELECT
              part_id,
              MAX(time) as last_time
            FROM "Status"
            GROUP BY part_id ) st
          ON st.part_id = bs.id
        INNER JOIN "Status" sti
          ON sti.part_id = st.part_id
          AND sti.time = st.last_time
        INNER JOIN "StatusText" stt ON stt.id = sti.status ;

SQL;
    /* @var $db \yii\db\Connection */
    $db = \yii::$app->getDb();
    $result = $db->createCommand($SQL)->queryAll();    

    return $result;//['error' => 'Ошибка сохранения'];
  }
  
}
