<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class GetTypeDescrAction extends Action{

  public function run($params){
    $data     = json_decode($params,true);
    /* @var $db yii\db\Connection */
    $db       = \yii::$app->getDb();    
    $type     = isset($data['type'])?$data['type']:false;

    if( !$type ){
      return [];
    }
    
    $SQL = <<<SQL
        SELECT
          tp.text_id    as name,
          tp.hp || '/' || tp.kw as power,
          tp.volume     as volume,
          tp.cylinder   as cylinder,
          tp.valves     as valves,
          tp.start      as start,
          tp.end        as end,
          ds1.desc      as fuel,
          ds2.desc      as drive,
          ds3.desc      as side
        FROM "Types" tp
        LEFT JOIN "Description" ds1
          ON ds1.id=tp.fuel_id
        LEFT JOIN "Description" ds2
          ON ds2.id=tp.drive_id
        LEFT JOIN "Description" ds3
          ON ds3.id=tp.side_id
        WHERE tp.type_id = $type
SQL;

    $result = $db->createCommand($SQL)->queryAll();
    $answer = [];
    foreach ($result as $row){
      $answer[] = $row;
    }

    return $answer;
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
