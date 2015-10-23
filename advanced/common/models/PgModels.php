<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;
use common\validators\BitFieldValidator;

class PgModels extends ActiveRecord{
  const isCar = 0b100;
  const isBus = 0b010;  
  const isAxl = 0b001;


  public function attributes() {
    return ['id','model_id','manufacturers_id','text_id','type','start','end'];
  }

  public function rules() {
    return [
      [['id','model_id','manufacturers_id','text_id'],'integer'],
      [['start','end'],'date','format'=>'dd-mm-yyyy'],
      ['type',  BitFieldValidator::className(),'length'=>3],
      [['id','model_id','manufacturers_id','text_id','type','start','end'],'safe']
    ];
  }

  public static function tableName() {
    return 'Models';
  }
}
