<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;
use common\validators\BitFieldValidator;

class PgManufacturers extends ActiveRecord{
  const isCar = 0b1000;
  const isBus = 0b0100;
  const isEng = 0b0010;
  const isAxl = 0b0001;


  public function attributes() {
    return ['id','brand','type'];
  }

  public function rules() {
    return [
      ['id','integer'],
      ['brand','string'],
      ['type',  BitFieldValidator::className(),'length'=>4],
      [['id','brand','type'],'safe']
    ];
  }

  public static function tableName() {
    return 'Manufacturers';
  }
}
