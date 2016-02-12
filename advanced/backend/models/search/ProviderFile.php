<?php

namespace backend\models\search;
use backend\models\search\Provider;

abstract class ProviderFile extends Provider{

  public function __construct($CLSID,$NAME,$FIELDS = false,$config=[]) {
    if( !$FIELDS || !isset($FIELDS['path']) ){
      throw new \yii\base\InvalidParamException('Provider params must have field "path" with path to files dir');
    }

    return parent::__construct($CLSID, $NAME, $FIELDS, $config);
  }
  
  protected function getPath(){
    return isset($this->_default_params['path'])?$this->_default_params['path']:false;
  }

  abstract public function loadFromFile();

}
