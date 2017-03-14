<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderOnline extends Provider{
  protected $_url = "http://onlinezakaz.ru/xmlprice.php";

  public function getBrands($search_text, $use_analog) {
    $data= ['sm'=>'1','code'=>$search_text];
    return $this->prepareRequest($data);
  }

  public function getBrandsParse($xml) {   
    $field = $this->getRowName();
    if( !is_array($xml) || !isset($xml[$field]) ){
      return [];
    }
    $data     = $xml[$field];
    if( isset($data['producer']) ){
      $data = [$data];
    }
    $answer   = [];
    foreach ($data as $row){
      $maker  = strtoupper($row['producer']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id' => $this->getCLSID(),'uid' => $row['ident']];
    }
    return $answer;
  }
  
  public function getParts($ident, $searchtext) {
    $data   = ['ident'=>$ident];
    $reqest = $this->prepareRequest($data);

    $answer = $this->executeRequest($reqest);
    
    $array  = $this->xmlToArray($answer);
    $data   = $array[$this->getRowName()];
    if( isset($data['uid']) ){
      $data = [$data];
    }
    
    $result = [];
    foreach ($data as $item){
      $converted = $this->renameByMap($item, $this->getNamesMap());
      
      if( is_array($converted["lot_quantity"]) ){
        $converted["lot_quantity"] = 1;
      }
      if( is_array($converted["is_original"]) ){
        $converted["is_original"] = false;
      }
      if( is_array($converted["name"]) ){
        $converted["name"] = "--";
      }   

      $result[] = $converted;
    }
    
    return $result;    
  }

  protected function getNamesMap() {
    return [
      "code"      => "articul",
      "producer"  => "maker",
      "uid"       => "code",
      "caption"   => "name",
      "price"     => "price",
      "deliverydays" => "shiping",
      "stock"     => "stock",
      "stockinfo" => "info",
      "analog"    => "is_original",
      "rest"      => "count",
      "amount"    => "lot_quantity"
    ];
  }

  protected function getRowName() {
    return 'detail';
  }

}
