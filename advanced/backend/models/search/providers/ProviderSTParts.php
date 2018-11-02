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
      $maker_utf = mb_convert_encoding($row['maker'],"UTF-8","Windows-1251");
      $maker  = strtoupper($maker_utf);
//      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$maker_utf. "@@" .$row['code']];
    }
    return $answer;
  }

  public function getParts($ident, $searchtext) {
    list($maker,$code) = explode("@@", $ident);
    $maker = mb_convert_encoding($maker,"Windows-1251","UTF-8");
    $param = [
      'postdata' => serialize([
        'command' => [
          'proc_id' => 'Get_Element_Details',
          'parm'    => [0=>$maker,1=>$code,2=>"1"]
         ],
        'auth'    => [
          'client_name' => $this->_default_params['Login'],
          'client_pwd'  => $this->_default_params['Password']
        ]
      ]),
    ];

    $data = array_map("base64_encode", $param);
    $request  = $this->prepareRequest($data, true);

    $answer   = $this->executeRequest($request);
    $data     = $this->parseResponse($answer, false);
    $result   = [];
    foreach ($data as $row){
      $converted  = $this->renameByMap($row, $this->getNamesMap());
      $converted['name'] = mb_convert_encoding($converted['name'], 'UTF8','CP1251');
      $converted['maker']= mb_convert_encoding($converted['maker'],"UTF-8","Windows-1251");
      
      if( $converted['shiping'] && strpos($converted['shiping'],'-') ){
        list($min_time,$max_time) = explode('-', $converted['shiping']);
        $converted['shiping'] = intval($max_time);
      } else {
        $converted['shiping'] = 0;
      }
      $result[]   = $converted;
    }

    return $result;
  }

  protected function onlineRequestHeaders($ch) {
    $headers = [
      "Content-type: application/x-www-form-urlencoded",
      "Accept-Charset: windows-1251",
      "Accept:"
    ];
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
  }

  public function parseResponse($answer_string, $method) {
    \Yii::info($answer_string);
    $decode_string  = base64_decode($answer_string);
    $ustring        = unserialize($decode_string);
    
    if( $this->hasMethod($method."Parse") ){
      return call_user_func([$this,$method."Parse"],$ustring);
    }

    return $ustring;
  }

  protected function getNamesMap() {
    return [
      "code"      => "articul",
      "maker"     => "maker",      
      "name"      => "name",
      "price"     => "price",
      "order_time"=> "shiping",
      "is_kross"  => "is_original",
      "amount"    => "count",
      "packing"   => "lot_quantity"
    ];
  }

  protected function getRowName() {
    return 'detail';
  }

}
