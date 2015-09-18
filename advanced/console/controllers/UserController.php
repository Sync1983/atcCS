<?php

/**
 * @author sync1983
 */
namespace console\controllers;

use yii\console\Controller;
use backend\models\User;

class UserController extends Controller{

  public function actionInitUser(){    
    echo "\r\n";
    $user = User::findOne(['user_name' => "admin"]);
    if( $user ){
      echo "User exist!\r\n";      
    } else {
      echo "Create new user \r\n";
      if ( User::createNew('admin','test','admin') ){
        echo "Ok";
      } else {
        echo "Err";
      }    
    }
  }
  
}
