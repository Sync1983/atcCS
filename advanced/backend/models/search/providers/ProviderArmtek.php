<?php

namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderArmtek extends Provider{
  protected $_url = "http://ws.armtek.ru/api/";
  
  protected function getNamesMap() {
    
  }

  protected function getRowName() {
    
  }

  protected function onlineRequestHeaders($ch) {
    parent::onlineRequestHeaders($ch);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 50);

    curl_setopt($ch, CURLOPT_USERPWD, $this->_default_params['login'] . ':' . $this->_default_params['pass']);
  }

  public function getBrands($search_text, $use_analog) {
    $data = [
      'PIN'         => $search_text,
      'QUERY_TYPE'  => $use_analog?2:1
    ];
    $request = $this->prepareRequest($data, true, $this->_url . "ws_search/search?format=json");
    return $request;
  }

  public function getBrandsParse($json) {
    var_dump($json);
  }

  public function getParts($ident, $searchText) {

  }

}
