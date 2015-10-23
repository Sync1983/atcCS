<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgTypes extends ActiveRecord{

  public function attributes() {
    return ['id','type_id','model_id','text_id', 'kw','hp','volume','cylinder','valves','fuel_id','drive_id','side_id','start','end'];
  }

  public function rules() {
    return [
      [['id','type_id','model_id','text_id', 'kw','hp','volume','cylinder','valves'],'integer'],
      [['fuel_id','drive_id','side_id'],'integer'],
      [['start','end'],'date','format'=>'dd-mm-yyyy'],      
      [['id','model_id','text_id', 'kw','hp','volume','cylinder','valves','fuel_id','drive_id','side_id','start','end'],'safe']
    ];
  }

  public static function tableName() {
    return 'Types';
  }
}
