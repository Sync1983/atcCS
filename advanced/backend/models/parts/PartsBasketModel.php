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
      'wait_time',
      'code',
      'date',
      'basket_id',
      'rp'
    ];
  }

  public function rules(){
    return [
      [['id',"provider","maker_id","count","lot_quantity","sell_count",'wait_time',"shiping"],'integer'],
      [['articul',"maker","name","stock","info","comment","code"],'string'],
      [["price","rp"],'number'],
      [["is_original","price_change"],'boolean'],
      ['date',  \backend\controllers\validators\DateValidator::className()],      
      ['basket_id', \backend\controllers\validators\BasketValidator::className()],
    ];
  }

  public static function tableName() {
    return 'Basket';
  }
  
}
