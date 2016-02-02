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
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['code']];
    }
    return $answer;
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

    return [];
  }

    protected function getNamesMap() {
    return [      
    ];
  }

  protected function getRowName() {
    return 'detail';
  }


}
