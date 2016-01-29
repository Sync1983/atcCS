<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class GetTypedHelperAction extends Action{

  public function run($params){
    $value = strval($params);
    $value = trim($value);
    $value = strtoupper($value);
    $value = preg_replace('/\W*/i', "", $value);

    $SQL = <<<SQL
      WITH parts as (
        SELECT at.brand as tmp,part_id, part_full_number, bs.brand as brand
        FROM "Article" at
        INNER JOIN "Brands" bs
          ON at.brand = bs.id
        WHERE part_search_number LIKE '$value%'
        LIMIT 750
      )
      SELECT DISTINCT ON (brand) brand, part_id,part_full_number FROM parts ORDER BY brand limit 50;
SQL;
    $query  = \yii::$app->getDb()->createCommand($SQL)->queryAll();
    $answer = [];
    foreach ($query as $row){
      $answer[] = [
        'id' => $row['part_id'],
        'number'  => $row['part_full_number'],
        'brand'  => $row['brand']
      ];
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
