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
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['brand'] . "@@" .$row['nr']];
    }
    return $answer;
  }

  public function parseResponse($answer_string, $method) {
    $json = json_decode($answer_string,true);

    if( $this->hasMethod($method."Parse") ){
      return call_user_func([$this,$method."Parse"],$json);
    } 

    return $json;
  }
  
  public function getParts($ident, $searchtext) {
    list($maker,$code) = explode("@@", $ident);

    $param = [
      'act' => 'price_by_nr_firm',
      'nr'  => $code,
      'f'   => $maker,
      'avail' => 1,
      'alt' => 1,
      'oe'  => 1
    ];

    $request = $this->prepareRequest($param,true);
    $answer  = $this->executeRequest($request);
    $data    = $this->parseResponse($answer, false);
    $rows    = $data[$this->getRowName()];
    $result  = [];
    foreach ($rows as $row){
      $converted  = $this->renameByMap($row, $this->getNamesMap());
      $converted['shiping'] = intval($converted['shiping']);
      $result[] = $converted;
    }    
    return $result;
  }

  protected function getNamesMap() {
    return [
      "nr"      => "articul",
      "brand"  => "maker",
      "name"   => "name",
      "price"     => "price",
      "delivery" => "shiping",
      "stock"      => "count",
      "minq"    => "lot_quantity"
    ];
  }

  protected function getRowName() {
    return 'result';
  }


}
