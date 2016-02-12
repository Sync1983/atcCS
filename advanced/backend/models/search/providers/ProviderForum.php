<?php

namespace backend\models\search\providers;
use backend\models\search\ProviderFile;

class ProviderForum extends ProviderFile{
  
  protected function getNamesMap() {
    
  }

  protected function getRowName() {

  }

  public function getBrands($search_text, $use_analog) {
    
  }

  public function getBrandsParse($xml) {

  }

  public function getParts($ident) {
    
  }

  public function loadFromFile() {
    $path = $this->getPath();

    if( !is_dir($path) ){
      throw new \yii\base\InvalidValueException('Field "path" must be directory');
    }

    echo $path;
    
  }

}
