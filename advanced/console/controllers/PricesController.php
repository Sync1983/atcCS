<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace console\controllers;

use yii\console\Controller;

class PricesController extends Controller {
  protected $providers = null;

  public function actionIndex() {
    $this->actionLoadAll();
  }
    
  public function actionLoadAll(){
    foreach ($this->providers as $provider){
      /* @var $provider \backend\models\search\ProviderFile */
      $provider->loadFromFile();
    }
  }

  public function actionGetList(){
    foreach ($this->providers as $provider){
      /* @var $provider \backend\models\search\ProviderFile */
      echo $provider->getName()."\r\n";
    }
  }

  public function actionLoad($name){
    if( !$name ){
      echo "Enter provider name. All name you can see by load get-list action.\r\n";
      return;
    }
    foreach ($this->providers as $provider){
      /* @var $provider \backend\models\search\ProviderFile */
      $pname = $provider->getName();
      if( $pname === $name ){
        $provider->loadFromFile();
      }
    }
  }

  public function init() {
    $provider_list    = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'providers',[]);
    $this->providers  = [];
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

      if( !is_subclass_of($new_class, \backend\models\search\ProviderFile::className()) ){
        continue;
      }
      $this->providers[$new_class->getCLSID()] = $new_class;
    }
    
    return parent::init();
  }
  
  

}
