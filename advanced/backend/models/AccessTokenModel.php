<?php

/**
 * @author sync1983
 */

namespace backend\models;
use yii\base\Model;
use common\models\User;

class AccessTokenModel extends Model{
  const EXPIRE_TIME = 60*60*5;
  /**
   * Создаем связку между acces-token и пользователем
   * @param User $user
   * @result boolean
   */
  public static function generate($user){
    $id = strval($user->getId());
    /* @var $db \yii\redis\Connection */
    $db = \yii::$app->get('redis');    
    do{
      $token = \yii::$app->security->generateRandomString();
    } while ($db->executeCommand("EXISTS",[$token]) === 1);

    $db->executeCommand("SET",[$token,$id]);
    $db->executeCommand("EXPIRE",[$token, ( self::EXPIRE_TIME )]);

    return $token;
  }
  /**
   * Возвращает пользователя по переданному access-token
   * @param string $token Access-token для получения пользователя
   * @result User|boolean Пользователь или false
   */
  public static function getUserByToken($token){
    /* @var $db \yii\redis\Connection */    
    $db = \yii::$app->get('redis');
    if( !$db->executeCommand("EXISTS",[$token]) ){
      return false;
    }
    
    $uid = $db->executeCommand("GET",[$token]);
    
    $db->executeCommand("EXPIRE",[$token, ( self::EXPIRE_TIME )]);
    if( !$uid ){
      return false;
    }

    $user = User::findOne([ 'id'=> strval($uid) ]);    

    return $user;
  }
  
}
