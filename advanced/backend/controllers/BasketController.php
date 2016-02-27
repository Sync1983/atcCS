<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\web\Controller;

class BasketController extends Controller{

  public $enableCsrfValidation = false;
  
  public function actions() {
    return [
      'add' => [
        'class'  => basket\AddAction::className(),
      ],      
      'get-data' => [
        'class'  => basket\GetDataAction::className(),
      ],
      'change' => [
        'class'  => basket\ChangeAction::className(),
      ],
      'update' => [
        'class'  => basket\UpdateAction::className(),
      ],
      'delete' => [
        'class'  => basket\DeleteAction::className(),
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
          'exceptActions' => [],
        ],
        'contentNegotiator' => [
            'class' => \yii\filters\ContentNegotiator::className(),
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
                'application/xml' => \yii\web\Response::FORMAT_XML,
            ],
        ],        
    ];
  }
  
}
