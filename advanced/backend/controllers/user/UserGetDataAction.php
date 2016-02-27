<?php

/**
 * @author sync1983
 */

namespace backend\controllers\user;
use yii\base\Action;

class UserGetDataAction extends Action{

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return [
        'info'  => [
          'name'    => 'Гость',
          'surname' => '',
          'company' => '',
        ],
        'role'    => 0,
        'markup'  => [],
        'baskets' => [],
        'alerts'  => []              
      ];
    }

    $user = \yii::$app->user->getIdentity();
    $answer   = [];
    $baskets  = [];

    foreach(\backend\models\user\UserBasket::findAll(['uid' => $user->id]) as $row){
      $baskets[] = [
        'id'    => $row->basket_id,
        'name'  => $row->name,
        'active'=> $row->active
      ];
    }
    
    $answer['name']             = $user->getAttribute('user_name');
    $answer['info']['name']     = 'Не гость';
    $answer['info']['surname']  = 'Не гость s';
    $answer['info']['company']  = 'Компания';
    $answer['role']             = $user->getAttribute('role');
    $answer['baskets']          = $baskets;

    return $answer;
  }

}
