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
  
  protected function getNamesMap() {
    return [      
    ];
  }

  protected function getRowName() {
    return 'detail';
  }


}
