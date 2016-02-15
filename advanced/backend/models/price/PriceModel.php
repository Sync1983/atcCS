<?php

namespace backend\models\price;
use yii\db\ActiveRecord;

class PriceModel extends ActiveRecord{

  public static function clearProvider($CLSID){
    return self::deleteAll(['pid' => intval($CLSID)]);
  }
  
  public static function searchBrands($articul,$clsid){
    $articul = strval($articul);
    $clsid   = intval($clsid);
    $SQL = <<<SQL
      WITH ids_ar AS (
      SELECT
        distinct part_search_number
      FROM "Article"
      WHERE
        part_id in (
          SELECT
            distinct part_id
          FROM "Article"
          WHERE part_search_number='$articul'
        )
      )
      SELECT
        distinct maker
      FROM "Prices"
      WHERE articul in (
        SELECT *
        FROM ids_ar)
      AND
        pid=$clsid;
SQL;

    $result = self::findBySql($SQL)->asArray()->all();
    $answer = [];

    foreach ($result as $row){
      $name = $row['maker'];
      $answer[$name] = ['id'=>$clsid,'uid'=>$name . "@@" . $articul];
    }

    return $answer;
  }

  public static function searchPart($ident, $clsid){
    list($name,$articul) = explode("@@", $ident);

    $SQL = <<<SQL
      WITH ids_ar AS (
      SELECT
        distinct part_search_number
      FROM "Article"
      WHERE
        part_id in (
          SELECT
            distinct part_id
          FROM "Article"
          WHERE part_search_number='$articul'
        )
      )
      SELECT
        *
      FROM "Prices"
      WHERE articul in (
        SELECT *
        FROM ids_ar)
      AND
        pid=$clsid
      AND
        maker='$name';
SQL;
    
    $result = self::findBySql($SQL)->asArray()->all();
    $answer = [];
    foreach ($result as $row){
      $item = $row;
      $item['shiping']  = 1;
      $item['price']    = floatval($item['price']);
      $item["articul"]        = $row['visual_articul'];
      $item["code"]           = $row['id'];
      $item["name"]           = $row['name'];
      $answer[] = $item;
    }    
    
    return $answer;
  }

  public function attributes(){
    return ['id','pid','articul','visual_articul','maker','name','price','count','lot_quantity'];
  }

  public function rules(){
    return [
      [['id','pid','count','lot_quantity'],'integer'],
      [['articul','visual_articul','maker','name'],'string','max'=>100],
      [['price'],'number']
    ];
  }

  public static function tableName() {
    return 'Prices';
  }

}
