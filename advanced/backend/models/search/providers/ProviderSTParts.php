<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderSTParts extends Provider{
  protected $_url = "http://stparts.ru.public.api.abcp.ru";

  public function getBrands($search_text, $use_analog) {
    $param = [      
        'number' => $search_text      
    ];    
    return $this->prepareRequest($param, false, $this->_url."/search/brands/");
  }

  public function getBrandsParse($array) {    
    $answer   = [];
    if(!is_array($array)) {
      return $answer;
    }
    foreach ($array as $row){       
      if($row['availability'] == 0){
        continue;
      }      
      $maker  = strtoupper($row['brand']);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$maker . "@@" . $row['numberFix']];
    }    
    return $answer;
  }

  public function getParts($ident, $searchtext) {
    list($maker,$number) = explode("@@", $ident);        
    
    $data     = [      
        'number'  => $number,
        'brand'   => $maker,
        'useOnlineStocks' => "0"
    ];   
    
    $request  = $this->prepareRequest($data, false, $this->_url."/search/articles/");

    $answer   = $this->executeRequest($request);
    $data     = $this->parseResponse($answer, false);    
    
    $result   = [];
    foreach ($data as $row){
      $converted  = $this->renameByMap($row, $this->getNamesMap());
      
      $converted['shiping'] /= 24;      
      $result[]   = $converted;
    }

    return $result;
  }

  public function parseResponse($answer_string, $method) {    
   
    $result = json_decode($answer_string,true);
    
    if( $this->hasMethod($method."Parse") ){
      return call_user_func([$this,$method."Parse"],$result);
    }

    return $result;
  }

  protected function getNamesMap() {
    return [
      "number"          => "articul",
      "brand"           => "maker",      
      "description"     => "name",
      "price"           => "price",
      "deliveryPeriodMax"  => "shiping",      
      "availability"    => "count",
      "packing"         => "lot_quantity"
    ];
  }

  protected function getRowName(){
    
  }

}
