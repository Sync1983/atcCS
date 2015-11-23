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
      'articul' => [
        'class'  => helper\ArticulAction::className(),
      ],
      'parse-search' => [
        'class'  => helper\ParseSearchAction::className(),
      ],
      'mmodel-search' =>[
        'class'  => helper\MModelSearchAction::className(),
      ],
      'mfcs-search' =>[
        'class'  => helper\MFCSearchAction::className(),
      ],
      'description-search' =>[
        'class'  => helper\DescriptionSearchAction::className(),
      ],
      'parts-search' =>[
        'class'  => helper\PartsSearchAction::className(),
      ],
      'articul-info' =>[
        'class'  => helper\ArticulInfoAction::className(),
      ],
      'get-groups' =>[
        'class'  => helper\GetGroupsAction::className(),
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
