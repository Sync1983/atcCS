<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderEDet extends Provider{
  protected $_url = "http://www.e-det.ru/web/getprice.php";

  public function getBrands($search_text, $use_analog) {
    $data= ['number'    => $search_text];    
    return $this->prepareRequest($data,true);
  }

  public function getBrandsParse($json) {

    $brands = [];
    if( !$json ){
      return $brands;
    }

    foreach ($json as $answer_type){

      if( !isset($answer_type['offers'])){
        continue;
      }
      
      foreach ($answer_type['offers'] as $row){
        
        if( !isset($row['brand'])){
          continue;
        }

        $ub = strtoupper($row['brand']);
        $brands[$ub] = ['id'=>$this->getCLSID(), 'uid'=>$ub. "@@" .$row['number']];

      }
    }    
    
    return $brands;
  }
  
  public function getParts($ident) {
    list($brand,$number) = explode("@@", $ident);

    $data   = ['number'=>$number];
    $reqest = $this->prepareRequest($data);

    $answer = $this->executeRequest($reqest);
    
    $array  = json_decode($answer,true);

    $data = [];
    foreach ($array as $searchType){
      $is_original = $searchType['type']=="pricelists_by_number";

      foreach ($searchType['offers'] as $row){
        $row['analog'] = $is_original;
        $data[] = $row;
      }
      
    }
    
    $result = [];
    foreach ($data as $item){
      $result[] = $this->renameByMap($item, $this->getNamesMap());
    }
    
    return $result;
  
  }

  protected function onlineRequestHeaders($ch) {
    $headers = [
      "Content-type: application/x-www-form-urlencoded",
      "Accept: application/json"
    ];
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
  }

  public function parseResponse($answer_string, $method){
    $json = json_decode($answer_string, true);

    if($this->hasMethod($method."Parse") ){
      return call_user_func([$this,$method."Parse"],$json);
    }
    
    return [];
  }

  protected function getNamesMap() {
    return [
      "number"    => "articul",
      "brand"     => "maker",
      "name"      => "name",
      "price"     => "price",
      "maxperiod" => "shiping",
      "supplier"  => "stock",
      "analog"    => "is_original",
      "quantity"  => "count",
      "minpart"   => "lot_quantity"
    ];
  }

  protected function getRowName() {
    return 'detail';
  }

}
