<?php

/**
 * @author sync1983
 */
namespace backend\models\user;
use yii\db\ActiveRecord;

class UserBasket extends ActiveRecord{
  public function attributes(){
    return ['uid','basket_id','name','active'];
  }

  public function rules(){
    return [
      [['uid','basket_id'],'integer'],
      [['active'],'boolean'],
      [['name'],'string', 'max'=>100],
    ];
  }

  public static function tableName() {
    return 'UserBasket';
  }
}
