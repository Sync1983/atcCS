<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\web\Controller;

class SearchController extends Controller{

  public $enableCsrfValidation = false;
  
  public function actions() {
    return [
      'get-brands' => [
        'class'  => search\GetBrandsAction::className(),
      ],
      'get-parts' => [
        'class'  => search\GetPartsAction::className(),
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
            'Access-Control-Allow-Credentials' => true,
            'Access-Control-Allow-Origin' => ['*']
          ]
        ],
        'authFilter' => [
          'class'       => \backend\filters\RestAuthFilter::className(),
          'auth'        => [\backend\controllers\user\LoginAction::className(),'authHttpBasic'],
          'authToken'   => [\backend\controllers\user\LoginAction::className(),'authToken'],
          'exceptMethods' => ['OPTIONS'],
          'exceptActions' => ['get-brands'],
          'silentAuthtActions' => ['get-parts']
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
