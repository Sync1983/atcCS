<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgDescription extends ActiveRecord{

  public function attributes() {
    return ['id','desc'];
  }

  public function rules() {
    return [
      ['id','integer'],
      ['desc','string'],
      [['id','desc'],'safe']
    ];
  }

  public static function tableName() {
    return 'Description';
  }
}
