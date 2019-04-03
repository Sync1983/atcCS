<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\web\Controller;

class CatalogController extends Controller{

  public $enableCsrfValidation = false;
  
  public function actions() {
    return [      
      'get-data' => [
        'class'  => catalog\GetDataAction::className(),
      ],      
    ];
  }

  public function behaviors() {    
    return [
        'corsFilter' => [
          'class' => \yii\filters\Cors::className(),
          'cors'  => [
            'Origin' => \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'server_origin',['*']),
            'Access-Control-Request-Headers' => ['*'],            
            'Access-Control-Allow-Credentials' => true
          ]
        ],
        'authFilter' => [
          'class'       => \backend\filters\RestAuthFilter::className(),
          'auth'        => [\backend\controllers\user\LoginAction::className(),'authHttpBasic'],
          'authToken'   => [\backend\controllers\user\LoginAction::className(),'authToken'],
          'exceptMethods' => ['OPTIONS'],
          'exceptActions' => ["get-data"],
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
