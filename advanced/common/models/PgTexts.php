<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;
use common\validators\BitFieldValidator;

class PgTexts extends ActiveRecord{
  
  public function attributes() {
    return ['id','text'];
  }

  public function rules() {
    return [
      [['id'],'integer'],
      ['text','string'],
      [['id','text'],'safe']
    ];
  }

  public static function tableName() {
    return 'Texts';
  }
}
