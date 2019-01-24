<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderVoshod extends Provider{
  protected $_url = "http://voshod-avto.ru.public.api.abcp.ru/";
  protected $_search_text = null;

  public function getBrands($search_text, $use_analog) {
    $data = ['number'=>$search_text];
    $this->_search_text = $search_text;
    return $this->prepareRequest($data,false,  $this->_url."search/brands");
  }

  public function getBrandsParse($json) {
    if( isset($json['status']) && ($json['status']==400) ){
      \yii::info("Voshod json error: " . json_encode($json));
      return [];
    }
    $answer   = [];
    foreach($json as $row){
      if(!isset($row['brand'])){
        continue;
      }
			$maker = strtoupper($row['brand']);
			$answer[ $maker ] = ['id'=> $this->getCLSID(), 'uid' => $row['brand'] . "@@" . $row['numberFix']];
    }
    
    return $answer;
  }

  public function getParts($ident, $searchtext) {
    list($maker,$number) = explode("@@", $ident);
    $data = ['number'=>$number,'brand'=>$maker];
    $request = $this->prepareRequest($data,false,  $this->_url."search/articles");
		$response	= $this->executeRequest($request);
		$answer		= $this->parseResponse($response,false);
		$result 	= [];
    
		foreach($answer as $row){
			$converted = $this->renameByMap($row, $this->getNamesMap());
			$result[] = $converted;
		}
		return $result;
  }

  protected function onlineRequestHeaders($ch) {
    $headers = [
      "Accept: application/json",
      "Content-type: application/json'"
    ];
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
  }

  public function parseResponse($answer_string, $method) {    
    $json = json_decode($answer_string,true);

    if( !is_array($json) ){
      \yii::info("Voshod error: ".$answer_string);
      return [];
    }

    if( $this->hasMethod($method."Parse") ){
      return call_user_func([$this,$method."Parse"],$json);
    }

    return $json;
  }


  protected function getNamesMap() {
    return [ 
			"number"      				=> "articul",
  		"brand"  							=> "maker",
  		"code"                => "code",
		  "description"  				=> "name",
		  "price"     					=> "price",
		  "deliveryPeriod"      => "shiping",
      "quantity"      			=> "count",
      "packing"             => "lot_quantity"
    ];
  }

  protected function getRowName() {

  }

}
