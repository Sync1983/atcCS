<?php

/**
 * @author sync1983
 */
namespace backend\models\user;
use yii\db\ActiveRecord;

class UserBasket extends ActiveRecord{
  public function attributes(){
    return ['uid','basket_id'];
  }

  public function rules(){
    return [
      [['id','basket_id'],'integer'],
    ];
  }

  public static function tableName() {
    return 'UserBasket';
  }
}
