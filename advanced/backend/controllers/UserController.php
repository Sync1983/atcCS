<?php

/**
 * @author sync1983
 */

namespace backend\controllers;

use yii\rest\Controller;

class UserController extends Controller{

  public function actions() {
    return [
      'login' => [
        'class'  => user\LoginAction::className(),
      ]
    ];
  }

  public function verbs() {
    return [
      'login' => ['post','get'],
    ];
  }
}
