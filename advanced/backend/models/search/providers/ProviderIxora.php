<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderIxora extends Provider{
  protected $_url = "http://ws.ixora-auto.ru/soap/ApiService.asmx";

  public function getBrands($search_text, $use_analog) {
    $data= ['Number'=>$search_text];
    return $this->prepareRequest($data,true,  $this->_url."/GetMakersXML");
  }

  public function getBrandsParse($xml) {
    var_dump($xml);
    /*$field = $this->getRowName();
    if( !is_array($xml) || !isset($xml[$field]) ){
      return [];
    }
    $data     = $xml[$field];
    if( isset($data['producer']) ){
      $data = [$data];
    }*/
    $answer   = [];
    //foreach ($data as $row){
    //  $maker  = strtoupper($row['producer']);
    //  $maker  = preg_replace('/\W*/i', "", $maker);
    //  $answer[ $maker ] = ['id' => $this->getCLSID(),'uid' => $row['ident']];
    //} 
    return $answer;
  }
  
  public function getParts($ident) {
    list($code,$maker) = explode('@@', $ident);
    $data   = ['Maker'=>$maker,'Number'=>$code,'StockOnly'=>'false','SubstFilter'=>'All'];
    $reqest = $this->prepareRequest($data);

    $answer = $this->executeRequest($reqest);
    
    $array  = $this->xmlToArray($answer);
    /*if( isset($array['uid']) ){
      $array = ['detail' => $array];
    }

    $data   = $array[$this->getRowName()];
    */
    $result = [];
    /*foreach ($data as $item){
      $converted = $this->renameByMap($item, $this->getNamesMap());
      if( is_array($converted["lot_quantity"]) ){
        $converted["lot_quantity"] = 0;
      }
      if( is_array($converted["is_original"]) ){
        $converted["is_original"] = false;
      }
      if( is_array($converted["name"]) ){
        $converted["name"] = "--";
      }

      $result[] = $converted;
    }*/
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
