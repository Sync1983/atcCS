<?php

/**
 * @author Sync
 */
namespace backend\models\parts;
use yii\db\ActiveRecord;

class PartsBasketModel extends ActiveRecord{

  public function attributes(){
    return [
      'id',      
      "provider",
      "articul",
      "maker",
      "maker_id",
      "name",
      "price",
      "shiping",
      "stock",
      "info",
      "is_original",
      "count",
      "lot_quantity",
      "price_change",
      "sell_count",
      "comment",      
      'wait_time',
      'code',
      'date',
      'basket_id'
    ];
  }

  public function rules(){
    return [
      [['id',"provider","maker_id","count","lot_quantity","sell_count",'wait_time',"shiping",'basket_id'],'integer'],
      [['articul',"maker","name","stock","info","comment","code"],'string'],
      [["price"],'number'],
      [["is_original","price_change"],'boolean'],
      [['date'],'date','format'=>'php:Y-m-d H:i:s']
    ];
  }

  public function setBasket(){
    $uid = \yii::$app->user->getId();
    $user_basket = \backend\models\user\UserBasket::findOne(['uid' => $uid, 'active'=>true]);
    if( !$user_basket ){
      $user_basket = new \backend\models\user\UserBasket();
      $user_basket->setAttribute('uid', $uid);
      $user_basket->setAttribute('name', 'Основная');
      $user_basket->setAttribute('active', true);
      $user_basket->insert();
    }

    $basket_id = $user_basket->getAttribute('basket_id');
    $this->setAttribute('basket_id', $basket_id);
  }

  public function beforeSave($insert) {
    if( $insert ){
      $this->date = strftime("%Y-%m-%d %H:%M:%S",time());
      $this->setBasket();
    }
    return parent::beforeSave($insert);
  }

  public static function tableName() {
    return 'Basket';
  }
  
}
