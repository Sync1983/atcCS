<?php

/**
 * @author Sync
 */
namespace backend\models\parts;
use yii\db\ActiveRecord;

class PartsBasketModel extends ActiveRecord{

  public function attributes(){
    return [
      'id',      
      "provider",
      "articul",
      "maker",
      "maker_id",
      "name",
      "price",
      "shiping",
      "stock",
      "info",
      "is_original",
      "count",
      "lot_quantity",
      "price_change",
      "sell_count",
      "comment",      
      'wait_time'
    ];
  }

  public function rules(){
    return [
      [['id',"provider","maker_id","count","lot_quantity","sell_count",'wait_time',"shiping"],'integer'],
      [['articul',"maker","name","stock","info","comment"],'string'],
      [["price"],'number'],
      [["is_original","price_change"],'boolean'],      
    ];
  }

  public static function tableName() {
    return 'Basket';
  }
  
}
