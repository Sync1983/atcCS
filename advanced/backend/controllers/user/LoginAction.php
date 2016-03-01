<?php

/**
 * @author sync1983
 */
namespace backend\controllers\user;

use yii\base\Action;
use common\models\User;
use backend\models\AccessTokenModel;

class LoginAction extends Action {
  
  public $modelClass = 'backend\models\UserModel';
  public $avaibleParams = ['get-token','get-token-hash'];

  public static function authHttpBasic($name, $pass){
    /* @var $user User */
    $user = User::findByUsername($name);
    
    if( $user && ( $user->validatePassword($pass) || ($user->user_pass === $pass) ) ){
      //\yii::$app->user->setIdentity($user);
      \yii::$app->user->login($user);
      return $user;
    }    
    \yii::error("AuthError! user-name: $name  pass: $pass");
    return null;
  }

  public static function authToken($token){
    /* @var $user User */
    
    $user = AccessTokenModel::getUserByToken($token);
    
    if( $user ){
      //\yii::$app->user->setIdentity($user);
      \yii::$app->user->login($user);
      return $user;
    }

    \yii::error("AuthError! token: $token");
    return null;
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
