<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderPartcom extends Provider{
  protected $_url = "http://www.part-kom.ru/engine/api/v1/";

  public function getBrands($search_text, $use_analog) {
    $data = ['number'=>$search_text];
    return $this->prepareRequest($data,false,  $this->_url."search/brands");
  }

  public function getBrandsParse($json) {
    if( isset($json['status']) && ($json['status']==400) ){
      \yii::info("Partcom json error: " . json_encode($json));
      return [];
    }
    $answer   = [];
    
    return $answer;
  }

  public function getParts($ident) {
    list($maker,$code) = explode("@@", $ident);
    $data = ['number'=>$code,'maker_id'=>$maker,'find_substitutes'=>"on"];
    return $this->prepareRequest($data,false,  $this->_url."search/parts");
  }

  protected function onlineRequestHeaders($ch) {
    $headers = [
      "Authorization: Basic ".  base64_encode($this->_default_params['Login']. ":" .$this->_default_params['Password']),
      "Accept: application/json",
      "Content-type: application/json'"
    ];
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
  }

  public function parseResponse($answer_string, $method) {
    $json = json_decode($answer_string,true);

    if( $this->hasMethod($method."Parse") ){
      return call_user_func([$this,$method."Parse"],$json);
    }
    
    return [];
  }


  protected function getNamesMap() {
    return [      
    ];
  }

  protected function getRowName() {

  }

}
