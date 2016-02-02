<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderMoskovia extends Provider{
  protected $_url = "http://portal.moskvorechie.ru/portal.api";

  public function getBrands($search_text, $use_analog) {
    $data = [
      'act' => 'brand_by_nr',
      'nr'=>$search_text];
    if( $use_analog ){
      $data['alt'] = 1;
      $data['oe'] = 1;
    }

    return $this->prepareRequest($data);
  }

  public function getBrandsParse($xml) {    
    $field = $this->getRowName();
    if( !isset($xml[$field]) ){
      return [];
    }
    $data     = $xml[$field];
    $answer   = [];
    foreach ($data as $row){
      $maker  = strtoupper($row['brand']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['nr']];
    }
    return $answer;
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
    return 'result';
  }


}
