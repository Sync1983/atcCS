<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderAutotrade extends Provider{
  protected $_url = "https://api2.autotrade.su/?json";

  public function getBrands($search_text, $use_analog) {
    $data= ['method'    => "getItemsByQuery",
            'params'    => [
                    'q' => [$search_text],
                    'strict'        => 0,
                    'page'          => 1,
                    'limit'         => 500,
                    'cross'         => $use_analog?1:0,
                    'replace '      => $use_analog?1:0,
                    'with_stocks_and_prices ' => 0,
                    'withPriceUst'  => 0,
                    'check_transit' => 0
            ]];
    $ch = $this->prepareRequest($data,true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);    
    return $ch;
  }

  public function getBrandsParse($json) {    
    $brands = [];
    if( !$json || ( $json['code'] != 0 ) ){
      return $brands;
    }


    foreach ($json["brands"] as $b_key => $brand){
      $ub = strtoupper($brand);
      $brands[$ub] = ['id'=>$this->getCLSID(), 'uid'=>$b_key];
    }    
    
    return $brands;
  }
  
  public function getParts($ident, $searchText) {    
    $data= ['method'    => "getItemsByQuery",
            'params'    => [
                    'q' => [$searchText],
                    'strict'        => 0,
                    'page'          => 1,
                    'limit'         => 500,
                    'cross'         => 1,
                    'replace'       => 1,
                    'with_stocks_and_prices' => 1,
                    'with_delivery' => 1,
                    'withPriceUst'  => 0,
                    'check_transit' => 0,
                    'filter_brands' => [$ident]
            ]];
    $request  = $this->prepareRequest($data,true);
    curl_setopt($request, CURLOPT_SSL_VERIFYPEER, false);
    $answer = $this->executeRequest($request);

    $array  = json_decode($answer,true);
    if( !isset($array['items']) ){
      return [];
    }

    $items = $array['items'];
     
    $result = [];
    foreach ($items as $row){

      $row['is_original'] = !$row['type'];
      foreach ($row['stocks'] as $subrow){
        if($subrow['quantity_unpacked'] <= 0 ){
          continue;
        }
        
        $result[] = [
          'id'            => $row['id'],
          'articul'       => $row['article'],
          'maker'         => $row['brand_name'],
          'name'          => $row['name'],
          'price'         => $row['price'],
          'shiping'       => $subrow['delivery_period'],
          'stock'         => $subrow['legend'],
          'is_original'   => $row['is_original'],
          'count'         => $subrow['quantity_unpacked'],
          'lot_quantity'  => $subrow['quantity_packed']
        ];
      }
      
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

  public function prepareRequest($data,$is_post = false, $url=false){
    $ch = curl_init();

    $this->onlineRequestHeaders($ch);
    if( !$url ){
      $url = $this->_url;
    }

    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, $is_post==1);
    $params = "data=" . json_encode(array_merge($data,$this->_default_params));
    if( $is_post ) {
      curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    } else  {
      $url.="?".$params;
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    return $ch;
  }

}
