<?php

/**
 * @author sync1983
 */
namespace backend\controllers\user;

use yii\rest\Action;
use backend\models\User;

class LoginAction extends Action {
  
  public $modelClass = 'backend\models\UserModel';
  public $avaibleParams = ['get-token','get-token-hash'];

  public static function authHttpBasic($name, $pass){
    /* @var $user User */
    $user = User::findByUsername($name);
    if( $user && ($user->validatePassword($pass) || ( $user->getAttribute('user_pass') === strval($pass) ) ) ){
      return $user;
    }    
    \yii::error("AuthError! user-name: $name  pass: $pass");
    throw new \yii\web\BadRequestHttpException("Auth Error");    
  }

  public function run($params){
    if( !in_array($params, $this->avaibleParams) ){
      throw new \yii\web\BadRequestHttpException("Undefined function request");
    }
    
    if( \yii::$app->getUser()->isGuest ){
      return ['error' => 'user undefined'];
    }

    $accessToken = \backend\models\AccessTokenModel::generate(\yii::$app->getUser());
    $hash = \yii::$app->getUser()->getIdentity()->user_pass;

    $answer = ['access-token'=>$accessToken];
    if( $params === "get-token-hash" ){
      $answer['hash'] = $hash;
    }
    
    return $answer;
  }
  
}
