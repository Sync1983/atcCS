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
    $this->actionEDet();
  }
    
  public function actionEDet(){
    $url = "www.e-det.ru/web/getprice.php";
    $vars = [
      "key"     => urlencode("b800c715d13b98909cd4e5587048d05d"),
      "number"  => urlencode("6203"),
      "format"  => urldecode("json")
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($vars));  //Post Fields
    curl_setopt($ch, CURLINFO_HEADER_OUT, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    /*$headers = [
      'Accept: application/json',
      'Content-Type: application/x-www-form-urlencoded; charset=utf-8'      
    ];*/

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    var_dump(http_build_query($vars));

    $answer = curl_exec($ch);

    $headerSent = curl_getinfo($ch, CURLINFO_HEADER_OUT );

    curl_close($ch);

    var_dump($headerSent);

    var_dump($answer);

  }

  public function actionTestSearch(){
    $engine = new \backend\models\search\SearchEngine();
    $answer   = $engine->getBrands("5632", true);
    var_dump($answer);
  }

  public function actionTestParts(){
    $provider_list    = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'providers',[]);
    $providers  = [];
    foreach ($provider_list as $provider_data){

      if( !is_array($provider_data) ){
        throw new InvalidConfigException('Provider data must be array with values [class,name,CLSID]');
      }

      $class  = \yii\helpers\ArrayHelper::getValue($provider_data, 'class',false);
      $name   = \yii\helpers\ArrayHelper::getValue($provider_data, 'name', false);
      $CLSID  = \yii\helpers\ArrayHelper::getValue($provider_data, 'CLSID',false);
      $fields = \yii\helpers\ArrayHelper::getValue($provider_data, 'fields',[]);

      if( !$class || !$name || !$CLSID){
        throw new InvalidConfigException('Provider data must be array with values [class,name,CLSID]');
      }

      $new_class = \yii::createObject($class,[$CLSID,$name,$fields]);

      $providers[$new_class->getCLSID()] = $new_class;

    }

    foreach($providers as $provider){
      var_dump($provider->getCLSID());
      $answer   = $provider->getParts("AILERON@@62031");
      var_dump($answer);
    }
  }
  
  

}
