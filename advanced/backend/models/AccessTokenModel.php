<?php

/**
 * @author sync1983
 */

namespace backend\models;
use yii\base\Model;
use common\models\User;

class AccessTokenModel extends Model{
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
    $db->executeCommand("EXPIRE",[$token, ( 60 * 5 )]);

    return $token;
  }
  /**
   * Возвращает пользователя по переданному access-token
   * @param string $token Access-token для получения пользователя
   * @result User|boolean Пользователь или false
   */
  public static function getUserByToken($token){
    /* @var $db \yii\redis\Connection */
    \yii::info("Connect Redis db");
    $db = \yii::$app->get('redis');
    if( !$db->executeCommand("EXISTS",[$token]) ){
      return false;
    }

    \yii::info("Token user uid");
    $uid = $db->executeCommand("GET",[$token]);
    \yii::info($uid);
    $db->executeCommand("EXPIRE",[$token, ( 60 * 5 )]);
    if( !$uid ){
      return false;
    }

    $user = User::findOne([ 'id'=> strval($uid) ]);
    \yii::info("User");
    \yii::info($user);

    return $user;
  }
  
}
