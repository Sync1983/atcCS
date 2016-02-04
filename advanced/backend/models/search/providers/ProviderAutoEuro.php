<?php

/**
 * @author Sync
 */
namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderAutoEuro extends Provider{
  protected $_url = "http://online.autoeuro.ru/ae_server/srv_main.php";

  public function getBrands($search_text, $use_analog) {
    $param = [
      'postdata' => serialize([
        'command' => [
          'proc_id' => 'Search_By_Code',
          'parm'    => [0=>$search_text,1=>1]
         ],
        'auth'    => [
          'client_name' => $this->_default_params['Login'],
          'client_pwd'  => $this->_default_params['Password']
        ]
      ]),
    ];
    $data = array_map("base64_encode", $param);
    return $this->prepareRequest($data, true);
  }

  public function getBrandsParse($array) {
    $answer   = [];
    foreach ($array as $row){      
      $maker  = strtoupper($row['maker']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['maker']. "@@" .$row['code']];
    }
    return $answer;
  }

  public function getParts($ident) {
    list($maker,$code) = explode("@@", $ident);
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
