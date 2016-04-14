<?php

/**
 * @author sync1983
 */
namespace backend\models\user;
use yii\db\ActiveRecord;

class UserMarkup extends ActiveRecord{
  
  public static function GetUserMarkups(){
    if( \yii::$app->user->isGuest ){
      return [];
    }
    
    $uid  = \yii::$app->user->getId();
    $rows = self::findAll(['uid'=>$uid]);

    $result = [];
    foreach ($rows as $row){
      $result[] = [
        'n' => $row['name'],
        'v' => $row['value']
      ];
    }

    return $result;
  }

  public function attributes(){
    return ['uid','id','name','value'];
  }

  public function rules(){
    return [
      [['uid','id'],'integer'],
      [['name'],'string', 'max'=>25],
      [['value'],'number', 'min'=>0, 'max' => 300],
    ];
  }

  public static function tableName() {
    return 'UserMarkup';
  }
}
