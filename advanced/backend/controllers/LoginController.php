<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\rest\Controller;

class LoginController extends Controller{
  
  public function actions() {
    return [
      'login' => [
        'class'  => user\LoginAction::className(),
      ]
    ];
  }

  public function verbs() {
    return [
      'login' => ['post','get', 'options'],
    ];
  }

  public function behaviors() {
    $pre = parent::behaviors();

    $pre['auth'] = [
      'class' => \yii\filters\auth\CompositeAuth::className(),
      'authMethods' => [
        'http' => [
          'class' => \yii\filters\auth\HttpBasicAuth::className(),
          'auth'  => 'backend\controllers\user\LoginAction::authHttpBasic',
          'only'  => ['login'],
        ],
        //\yii\filters\auth\QueryParamAuth::className()
      ]
    ];

    $pre['corsFilter'] = [ 
          'class' => \yii\filters\Cors::className(),
          'cors'  => [
            'Access-Control-Allow-Credentials' => true
          ]];
    return $pre;
  }
}
