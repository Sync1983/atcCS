<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\web\Controller;

class LoginController extends Controller{
  
  public function actions() {
    return [
      'login' => [
        'class'  => user\LoginAction::className(),
      ],
      'get-data' => [
        'class'  => user\UserGetDataAction::className(),
      ],
    ];
  }

  public function behaviors() {    
    return [
        'corsFilter' => [
          'class' => \yii\filters\Cors::className(),
          'cors'  => [
            'Origin' => ['*'],
            'Access-Control-Request-Headers' => ['*'],
            'Access-Control-Allow-Credentials' => true
          ]
        ],
        'authFilter' => [
          'class'       => \backend\filters\RestAuthFilter::className(),
          'auth'        => [\backend\controllers\user\LoginAction::className(),'authHttpBasic'],
          'authToken'   => [\backend\controllers\user\LoginAction::className(),'authToken'],
          'exceptMethods' => ['OPTIONS'],
        ],
        'contentNegotiator' => [
            'class' => \yii\filters\ContentNegotiator::className(),
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
                'application/xml' => \yii\web\Response::FORMAT_XML,
            ],
        ],
        'verbFilter' => [
            'class' => \yii\filters\VerbFilter::className(),
        ],
    ];
  }
}
