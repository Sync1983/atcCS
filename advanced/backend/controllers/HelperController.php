<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\web\Controller;

class HelperController extends Controller{

  public $enableCsrfValidation = false;
  
  public function actions() {
    return [
      'mmodel-search' =>[
        'class'  => helper\MModelSearchAction::className(),
      ],      
      'description-search' =>[
        'class'  => helper\DescriptionSearchAction::className(),
      ],      
      'articul-info' =>[
        'class'  => helper\ArticulInfoAction::className(),
      ],
      'get-groups' =>[
        'class'  => helper\GetGroupsAction::className(),
      ],
      'get-mmt' =>[
        'class'  => helper\GetMMTAction::className(),
      ],
      'get-type-description' =>[
        'class'  => helper\GetTypeDescrAction::className(),
      ],
      'get-typed-helper' =>[
        'class'  => helper\GetTypedHelperAction::className(),
      ]
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
        /*'authFilter' => [
          'class'       => \backend\filters\RestAuthFilter::className(),
          'auth'        => [\backend\controllers\user\LoginAction::className(),'authHttpBasic'],
          'authToken'   => [\backend\controllers\user\LoginAction::className(),'authToken'],
          'exceptMethods' => ['OPTIONS'],
        ],*/
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
