<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace console\controllers;

use yii\console\Controller;

class TestController extends Controller {
      
  public function actionIndex() {
    $this->actionTestSearch();
  }

  public function actionTestSearch(){
    $engine = new \backend\models\search\SearchEngine();
    $answer   = $engine->getBrands("7701474484", true);
    //$answer   = $engine->getParts(140,"RENAULT@@7701474484","14738");
    var_dump($answer);
  }  

}
