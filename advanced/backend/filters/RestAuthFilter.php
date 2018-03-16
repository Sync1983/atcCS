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
  public $exceptMethods       = [];
  /**
   * @var Function called for user:password auth
   */
  public $auth                = null;
  /**
   * @var Function called for acces-token auth
   */
  public $authToken           = null;
  public $action              = null;
  public $exceptActions       = [];
  public $silentAuthtActions  = [];
  

  /**
   * @inheritdoc
   */
  public function init() {    
    /*array_map(function($item){
      return strtoupper($item);
    }, $this->exceptMethods);*/
    
    return parent::init();
  }
  /**
   * @inheritdoc
   */
  public function beforeAction($action) {    
    $request = $this->request ? : \yii::$app->getRequest();
    $response = $this->response ? : \yii::$app->getResponse();
    $method = $request->getMethod();

    $identity = $this->authenticate(
            $this->user ? : \yii::$app->getUser(),
            $this->request ? : \yii::$app->getRequest(),
            $response
        );
    
    if( $identity || 
        (!$identity && in_array($action->id, $this->silentAuthtActions)) ||
        (in_array($method, $this->exceptMethods)) ||
        in_array($action->id, $this->exceptActions)     ){
      return true;
    } elseif( !$identity ){
      $this->handleFailure($response);
      return false;
    }
    
    return false;
  }
  /**
   * @inheritdoc
   */
  public function authenticate($user, $request, $response) {
    /* @var $request \yii\web\Request */
    $username = $request->getAuthUser();
    $password = $request->getAuthPassword();
    $auth     = $request->getHeaders()->get('Authorization');

    if ( $this->auth && ($username !== null || $password !== null) ) {

      $identity = call_user_func($this->auth, $username, $password);
      if ($identity !== null) {
        $user->switchIdentity($identity);
        return $identity;
      }
      
      return null;

    }

    if( $this->authToken && $auth ){
      
      $matches = [];
      preg_match("/^Bearer\\s+(.*?)$/", $auth, $matches);
      $token = $matches[1];

      $identity = call_user_func($this->authToken,$token);
      
      if( $identity !== null ){
        $user->switchIdentity($identity);
        return $identity;
      }
      
      return null;

    }

    return null;
  }  

}
