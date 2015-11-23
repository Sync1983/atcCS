<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgGroupInfo extends ActiveRecord{

  public function attributes() {
    return ['id','des_id','asm_id','std_id', 'itd_id'];
  }

  public function rules() {
    return [
      [['id','des_id','asm_id','std_id', 'itd_id'],'integer'],
      [['id','des_id','asm_id','std_id', 'itd_id'],'safe']
    ];
  }

  public static function tableName() {
    return 'GroupInfo';
  }
}
