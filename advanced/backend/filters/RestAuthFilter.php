<?php

/**
 * @author sync1983
 */

namespace backend\filters;
use yii\filters\auth\AuthMethod;

class RestAuthFilter extends AuthMethod{
  /**
   * @var Array of reuqest methods, which will n`t use Auth system
   */
  public $exceptMethods = [];
  /**
   * @var Function called for user:password auth
   */
  public $auth          = null;
  /**
   * @var Function called for acces-token auth
   */
  public $authToken     = null;
  

  /**
   * @inheritdoc
   */
  public function init() {
    array_map(function($item){
      return strtoupper($item);
    }, $this->exceptMethods);
    return parent::init();
  }
  /**
   * @inheritdoc
   */
  public function beforeAction($action) {    
    $request = $this->request ? : \yii::$app->getRequest();
    $method = $request->getMethod();

    if( in_array($method, $this->exceptMethods) ){
      return true;
    }

    if( !$this->auth ){
      return true;
    }
    
    return parent::beforeAction($action);
  }
  /**
   * @inheritdoc
   */
  public function authenticate($user, $request, $response) {
    /* @var $request yii\web\Request */
    $username = $request->getAuthUser();
    $password = $request->getAuthPassword();
    $auth     = $request->

    if ( $this->auth && ($username !== null || $password !== null) ) {

      $identity = call_user_func($this->auth, $username, $password);
      if ($identity !== null) {
        $user->switchIdentity($identity);
        return $identity;
      }
      $this->handleFailure($response);
      return null;

    }



    return null;
  }  

}
