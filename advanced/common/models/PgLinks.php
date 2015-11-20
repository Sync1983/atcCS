<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgLinks extends ActiveRecord{

  public function attributes() {
    return ['id','type_id','group_id','supplier_id','articul_id'];
  }

  public function rules() {
    return [
      [['id','type_id','group_id','supplier_id','articul_id'],'integer'],
      [['id','type_id','group_id','supplier_id','articul_id'],'safe']
    ];
  }

  public static function tableName() {
    return 'Links';
  }
}
