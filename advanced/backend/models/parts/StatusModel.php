<?php

/**
 * @author Sync
 */
namespace backend\models\parts;
use yii\db\ActiveRecord;

class StatusModel extends ActiveRecord{
  const STATE_IN_BASKET       = 0;
  const STATE_IN_WORK         = 1;
  const STATE_WAIT_PAY        = 2;
  const STATE_WAIT_PLACEMENT  = 3;
  const STATE_PLACEMENT       = 4;
  const STATE_IN_WAY          = 5;
  const STATE_IN_STORAGE      = 6;
  const STATE_IN_PLACE        = 7;
  const STATE_REJECTED        = 8;

  public static $states = [
    self::STATE_IN_BASKET       => "В корзине",
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
    return ['id', 'part_id','time','status'];
  }

  public function rules(){
    return [
      [['id',"part_id","time"],'integer'],
      [['status'],'in','range'=>  array_keys(self::$states)]
    ];
  }

  public function beforeSave($insert) {
    if( !$insert ){
      return false;
    }
    $this->setAttribute('time', time());
    return parent::beforeSave($insert);
  }

  public static function tableName() {
    return 'Status';
  }
  
}
