<?php

namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderArmtek extends Provider{
  protected $_url = "http://ws.armtek.ru/api/";
  
  protected function getNamesMap() {
    return [
      "PIN"       => "articul",
      "BRAND"  	 => "maker",
      "NAME"  	 => "name",
      "PRICE"    => "price",
      "RVALUE"   => "count",
      "RDPRF"    => "lot_quantity"
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
    if( !isset($json['STATUS']) || ($json['STATUS']!=200) || !isset($json['RESP']) || isset($json['RESP']['MSG'])  ){
      return [];
    }
       
    $data = $json['RESP'];
    $answer = [];
    foreach( $data as $row) {
      $maker  = strtoupper($row['BRAND']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['BRAND'] . "@@" . $row['PIN']];
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
    list($brand,$articul) = explode('@@',$ident);
    $data = [
      'PIN'         => $articul,
      'QUERY_TYPE'  => 1,
      'BRAND'       => $brand
    ];

    $request    = $this->prepareRequest($data, true, $this->_url . "ws_search/search?format=json");
    $response	= $this->executeRequest($request);
    $answer	= $this->parseResponse($response,'getParts');
    return $answer;
  }

  public function getPartsParse($json){
    if( !isset($json['STATUS']) || ($json['STATUS']!=200) || !isset($json['RESP']) || isset($json['RESP']['MSG']) ){
      return [];
    }
    
    $data = $json['RESP'];
    $answer = [];
    $date_n = new \DateTime("now");

    foreach($data as $row){
      $converted = $this->renameByMap($row, $this->getNamesMap());
      $converted['is_analog'] = isset($row['ANALOG']) && ($row['ANALOG'] == 'X');
      if( isset($row['DLVDT']) ){
        $date = date_parse_from_format("YmdHis", $row['DLVDT']);
        $date2 = new \DateTime($date['year'] . '-' . $date['month'] . '-' .$date['day']);
        $interval = date_diff($date_n, $date2);
        $converted['shiping'] = $interval->days;
      } else {
        $converted['shiping'] = 99;
      }
      if( !isset($converted['price']) ) {
        continue;
      }
      $answer[] = $converted;
    }
    return $answer;
  }

}
