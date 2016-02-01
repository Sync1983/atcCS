<?php

/**
 * @author Sync
 */
namespace backend\models\search;
use yii\base\Object;

class SearchEngine extends Object{
  protected $providers;
  
  public function init() {
    $provider_list    = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'providers',[]);
    $this->providers  = [];
    foreach ($provider_list as $provider){
      /* @var $new_class SearchInterface */
      $new_class = \yii::createObject($provider,[]);
      $this->providers[$new_class->getID()] = $new_class;
    }
    return parent::init();
  }

  public function getBrands($search_text,$use_analog){

  }

  protected function providersMap($method,$data){    
    $forks = [];
    foreach ($this->providers as $provider){
      if( !method_exists($provider, $method) ){
        continue;
      }
      $id = pcntl_fork();
      if( $id ){
        $forks[] = $id;
      }elseif( $id == -1){
        \yii::error("Fork not work");
      }else {
        call_user_method_array($method, $provider, $data);
        exit(0);
      }
    }
   for( $i=0; $i<count($forks);$i++){

   }

  }
  
}
