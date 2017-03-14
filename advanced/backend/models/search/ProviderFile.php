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

  public function getBrands($search_text, $use_analog) {
    return \backend\models\price\PriceModel::searchBrands($search_text, $this->_CLSID);
  }

  public function getParts($ident, $searchtext) {
    return \backend\models\price\PriceModel::searchPart($ident, $this->_CLSID);
  }
  
  protected function getPath(){
    return isset($this->_default_params['path'])?$this->_default_params['path']:false;
  }

  protected function clearPrice(){
   return \backend\models\price\PriceModel::clearProvider($this->_CLSID);
  }

  public function getBrandsParse($xml) {
    throw new \BadFunctionCallException('Function not allowed for this provider type.');
  }

  protected function getNamesMap() {
    throw new \BadFunctionCallException('Function not allowed for this provider type.');
  }

  protected function getRowName() {
    throw new \BadFunctionCallException('Function not allowed for this provider type.');
  }

  abstract public function loadFromFile();

}
