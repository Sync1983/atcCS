<?php

namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderForum extends Provider{
  protected $_url = "http://api.forum-auto.ru/service.php";

  public function getBrands($search_text, $use_analog) {
    $data = [
      'tovnum'  => $search_text,
      'cross'  => $use_analog?1:0
    ];
    $request = $this->prepareRequest($data, true, $this->_url, 'fa.getTov');
    return $request;
  }

  public function getBrandsParse($xml) {    
    if( !is_array($xml) || !isset($xml['Body']) ){
      return [];  
    }
    $data     = array_pop($xml['Body']);
    if( !isset($data['return']) || !isset($data['return']['item']) || !isset($data['return']['item']['item']) ) {
      return [];
    }
    $data = $data['return']['item']['item'];
    $answer   = [];
    foreach ($data as $row){      
      $maker  = strtoupper($row['BRAND']);
      $maker  = preg_replace('/\W*/i', "", $maker);
      $answer[ $maker ] = ['id'=>$this->getCLSID(), 'uid'=>$row['BRAND']];
    }
    
    return $answer;
  }

  public function getParts($ident, $searchText) {
    $data = [
      'tovnum'  => $searchText,
      'cross'   => 1,
      'brand'   => $ident
    ];
    
    $request = $this->prepareRequest($data, true, $this->_url, 'fa.getTov1');
    $response	= $this->executeRequest($request);    
		$answer		= $this->parseResponse($response,'getParts');
    return $answer;
  }

  public function getPartsParse($xml){    
    if( !is_array($xml) || !isset($xml['Body']) ){
      return [];
    }
    $data     = array_pop($xml['Body']);
    if( !isset($data['return']) || !isset($data['return']['item']) || !isset($data['return']['item']['item']) ) {
      return [];      
    }
    $data = $data['return']['item']['item'];
    if( isset($data['TOVNUM']) ){
      $data = [$data];
    }
    
    $result  = [];
    foreach ($data as $row){
      $converted  = $this->renameByMap($row, $this->getNamesMap());
      $converted['maker'] = utf8_decode($converted['maker']);
      $converted['name'] = utf8_decode($converted['name']);      
      $result[] = $converted;
    }    
    return $result;
  }

  public function onlineRequestHeaders($ch, $action = "", $content = "") {
    $headers = [
      "Content-type: text/xml;charset=\"utf-8\"",
      "Accept: text/xml",
      "Cache-Control: no-cache",
      "Pragma: no-cache",
      "SOAPAction: " . $this->_url ."/". $action,
      "Content-length: ".strlen($content),
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_USERPWD, $this->_default_params['login'].":".$this->_default_params['password']);
  }

  public function generateContext($data, $action){
    $context = <<<CEND
<?xml version="1.0" encoding="UTF-8"?>
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tns="urn:api" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
    <SOAP-ENV:Body>
      <mns:%s xmlns:mns="" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <jrlid xsi:type="xsd:integer">%s</jrlid>
        <tovnum xsi:type="xsd:string">%s</tovnum>
        %s
        <cross xsi:type="xsd:string">%s</cross>
        <login xsi:type="xsd:string">%s</login>
        <password xsi:type="xsd:string">%s</password>
      </mns:$action>
    </SOAP-ENV:Body>
  </SOAP-ENV:Envelope>
CEND;
    $brand = "";
    if( isset($data['brand']) ){
      $brand = '<brand xsi:type="xsd:string">' . $data['brand'] . '</brand>';
    }

    $result = sprintf($context,
                      $action,
                      $data['jrlid'],
                      $data['tovnum'],
                      $brand,
                      $data['cross'],
                      $data['login'],
                      $data['password']);
    return $result;
  }

  public function prepareRequest($data, $is_post = false, $url = false, $action = false) {
    $ch = curl_init();

    $data_m = array_merge($this->_default_params, $data);
    $content = $this->generateContext($data_m, $action);
    
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, $is_post);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, true);

    $this->onlineRequestHeaders($ch, $action, $content);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $content);    
    return $ch;
  }

  public function parseResponse($answer_string, $method) {    
    $answer_string = preg_replace('/xmlns:SOAP.*>/U', '>', $answer_string);    
    $clean_xml = str_ireplace(['SOAP-ENV:', 'SOAP:','SOAP-ENC:','SOAP-ENV','SOAP-ENC'], '', $answer_string);    
    return parent::parseResponse($clean_xml, $method);
  }

  protected function getNamesMap() {
    return [
			"NR"      			=> "articul",
  		"BRAND"  				=> "maker",
		  "NAME"  				=> "name",
		  "PRICE"     		=> "price",
		  "D_DELIV"       => "shiping",
      "NUM"      			=> "count",
      "KR"            => "lot_quantity"
    ];
  }

  protected function getRowName() { return 'detail'; }

}
