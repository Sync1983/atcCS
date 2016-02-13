<?php

namespace backend\models\price;
use yii\db\ActiveRecord;

class PriceModel extends ActiveRecord{

  public static function clearProvider($CLSID){
    return self::deleteAll(['pid' => intval($CLSID)]);
  }

  public function attributes(){
    return ['id','pid','articul','visual_articul','maker','name','price','count','lot_quantity'];
  }

  public function rules(){
    return [
      [['id','pid','count','lot_quantity'],'integer'],
      [['articul','visual_articul','maker','name'],'string','max'=>100],
      [['price'],'number']
    ];
  }

  public static function tableName() {
    return 'Prices';
  }

}
