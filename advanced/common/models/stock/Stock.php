<?php

/**
 * @author Sync
 */
namespace common\models\stock;

class Stock extends \yii\db\ActiveRecord{

  public function attributes(){
    return ['id','articul','maker','name','count','crm_id'];
  }

  public function rules(){
    return [
      [['id','count'],'integer'],
      [['articul','maker','name'],'string', 'max'=>100],
      [['crm_id'],'string', 'max'=>37]
    ];
  }

  public static function tableName() {
    return 'Stock';
  }
  
}
