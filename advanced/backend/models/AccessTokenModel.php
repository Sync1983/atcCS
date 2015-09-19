<?php

/**
 * @author sync1983
 */

namespace backend\models;
use yii\base\Model;
use backend\models\User;

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
  
}
