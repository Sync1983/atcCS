<?php

/**
 * @author Sync
 */
namespace backend\models\parts;
use yii\db\ActiveRecord;

class PartsBasketModel extends ActiveRecord{
  const STATE_IN_WORK         = 1;
  const STATE_WAIT_PAY        = 2;
  const STATE_WAIT_PLACEMENT  = 3;
  const STATE_PLACEMENT       = 4;
  const STATE_IN_WAY          = 5;
  const STATE_IN_STORAGE      = 6;
  const STATE_IN_PLACE        = 7;
  const STATE_REJECTED        = 8;

  public static $states = [
    self::STATE_IN_WORK         => "В работе",
    self::STATE_WAIT_PAY        => "Ожидает оплаты",
    self::STATE_WAIT_PLACEMENT  => "Ожидает размещения",
    self::STATE_PLACEMENT       => "Заказано",
    self::STATE_IN_WAY          => "В пути",
    self::STATE_IN_STORAGE      => "На складе",
    self::STATE_IN_PLACE        => "Выдано",
    self::STATE_REJECTED        => "Отказ",
  ];

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
