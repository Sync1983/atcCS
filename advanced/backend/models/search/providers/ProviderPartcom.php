<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderPartcom extends Provider{
  protected $_url = "http://www.part-kom.ru/engine/api/v1/";
  protected $_search_text = null;

  public function getBrands($search_text, $use_analog) {
    $data = ['number'=>$search_text];
    $this->_search_text = $search_text;
    return $this->prepareRequest($data,false,  $this->_url."search/brands");
  }

  public function getBrandsParse($json) {
    if( isset($json['status']) && ($json['status']==400) ){
      \yii::info("Partcom json error: " . json_encode($json));
      return [];
    }
    $answer   = [];
    foreach($json as $row){
			$maker = strtoupper($row['name']);
			$answer[ $maker ] = ['id'=> $this->getCLSID(), 'uid' => $row['id'] . '@@' . $this->_search_text];
    }
    
    return $answer;
  }

  public function getParts($ident) {
    list($maker,$code) = explode("@@", $ident);
    $data = ['number'=>$code,'maker_id'=>$maker,'reCross'=>"on"];
    $request 	= $this->prepareRequest($data,false,  $this->_url."search/parts");
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
      "Authorization: Basic ".  base64_encode($this->_default_params['Login']. ":" .$this->_default_params['Password']),
      "Accept: application/json",
      "Content-type: application/json'"
    ];
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
  }

  public function parseResponse($answer_string, $method) {    
    $json = json_decode($answer_string,true);

    if( !is_array($json) ){
      \yii::info("PartCom error: ".$answer_string);
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
  		"maker"  							=> "maker",
  		"makerId"       			=> "code",
		  "description"  				=> "name",
		  "price"     					=> "price",
		  "averageDeliveryDays" => "shiping",
      "quantity"      			=> "count",
      "minQuantity"    			=> "lot_quantity"     
    ];
  }

  protected function getRowName() {

  }

}
