<?php

/**
 * @author sync1983
 */
namespace backend\controllers\user;

use yii\rest\Action;

class LoginAction extends Action {

  public $modelClass = 'backend\models\User';

  public function run($params){
    return ['a'=>'b'];
  }
}
