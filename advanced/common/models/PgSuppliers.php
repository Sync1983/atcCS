<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgSuppliers extends ActiveRecord{

  public function attributes() {
    return ['id','brand'];
  }

  public function rules() {
    return [
      ['id','integer'],
      ['brand','string','max'=>100],
      [['id','brand'],'safe']
    ];
  }

  public static function tableName() {
    return 'Supplier';
  }
}
