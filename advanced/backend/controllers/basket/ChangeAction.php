<?php

/**
 * @author sync1983
 */
namespace backend\controllers\basket;

use yii\base\Action;

class ChangeAction extends Action {

  public function run($params){
    if( \yii::$app->user->isGuest ){
      return ['error' => 'Ошибка авторизации'];
    }

    $id = json_decode($params);
    if( !$params ){
      throw new \yii\base\InvalidParamException('Ошибка в параметрах вызова');
    }

    $uid = \yii::$app->user->getId();
    
    /* @var $db \yii\db\Connection */
    $db = \yii::$app->getDb();
    $db->createCommand("SELECT set_active_basket($id, $uid);")->execute();
    $gd_action = new GetDataAction();
    return $gd_action->run($params);
  }
  
}
