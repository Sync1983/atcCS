<?php

namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderArmtek extends Provider{
  protected $_url = "http://ws.armtek.ru/api/";
  
  protected function getNamesMap() {
    return [
			"NR"      			=> "articul",
  		"BRAND"  				=> "maker",
		  "NAME"  				=> "name",
		  "PRICE"     		=> "price",
		  "D_DELIV"       => "shiping",
      "NUM"      			=> "count",
      "KR"            => "lot_quantity"
    ];
  }

  protected function getRowName() { return ['detail'];}

  protected function onlineRequestHeaders($ch) {
    parent::onlineRequestHeaders($ch);
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
    if( !isset($json['STATUS']) || ($json['STATUS']!=200) || !isset($json['RESP']) ){
      return [];
    }
       
    $data = $json['RESP'];
    $answer = [];
    foreach( $data as $row) {
      $maker  = strtoupper($row['BRAND']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['BRAND']];
    }
    
    return $answer;
  }

  public function parseResponse($answer_string, $method){
    $xml = json_decode($answer_string, true);
    if($this->hasMethod($method."Parse") ){      
      return call_user_func([$this,$method."Parse"],$xml);
    }
    return [];
  }

  public function getParts($ident, $searchText) {
    $data = [
      'PIN'         => $searchText,
      'QUERY_TYPE'  => 2,
      'BRAND'       => $ident
    ];

    $request = $this->prepareRequest($data, true, $this->_url . "ws_search/search?format=json");
    $response	= $this->executeRequest($request);
		$answer		= $this->parseResponse($response,'getParts');
    return $answer;
  }

  public function getPartsParse($json){
    if( !isset($json['STATUS']) || ($json['STATUS']!=200) || !isset($json['RESP']) ){
      return [];
    }

    $data = $json['RESP'];
    $answer = [];
    var_dump($json);
    return [];
  }

}
