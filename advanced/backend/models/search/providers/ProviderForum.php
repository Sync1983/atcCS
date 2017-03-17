<?php

namespace backend\models\search\providers;
use backend\models\search\Provider;

class ProviderForum extends Provider{
  protected $_url = "http://api.forum-auto.ru/service.php#";


  public function loadFromFile() {
    $path = $this->getPath();

    if( !is_dir($path) ){
      throw new \yii\base\InvalidValueException('Field "path" must be directory');
    }
    $timestamp = time();
    $files = scandir($path);
    foreach ($files as $file){
      if(is_dir($file) ){
        continue;
      }
      echo "loading $file \r\n";
      $fp = fopen($path . "/" . $file, "r");
      $this->loadFile($fp);
      fclose($fp);
      unlink($path . "/" . $file);
    }
    $timestamp = time() - $timestamp;
    echo "Load by $timestamp sec. \r\n";
  }

  protected function loadFile($fp){
    if( !$fp ){
      return;
    }
    
    $header = fgetcsv($fp);
    $header = implode(",", $header);
    $header = mb_convert_encoding($header, "UTF-8", "CP1251");
    if( !feof($fp) ){
      $this->clearPrice();
    }
    while( !feof($fp) ){
      $data           = fgetcsv($fp,0,";");
      $visula_articul = $data[1];
      $articul        = preg_replace('/\W*/i', "", $visula_articul);
      $maker          = mb_convert_encoding($data[0], 'UTF-8', 'CP1251');
      $name           = mb_convert_encoding($data[2], 'UTF-8', 'CP1251');
      if( !$articul || !$maker ){
        continue;
      }
      $newPriceRecord = new \backend\models\price\PriceModel();
      
      $newPriceRecord->setAttribute('pid',            $this->_CLSID);
      $newPriceRecord->setAttribute('articul',        $articul);
      $newPriceRecord->setAttribute('visual_articul', $visula_articul);
      $newPriceRecord->setAttribute('maker',          $maker);
      $newPriceRecord->setAttribute('name',           $name);
      $newPriceRecord->setAttribute('price',          floatval($data[3]));
      $newPriceRecord->setAttribute('count',          intval($data[4]));
      $newPriceRecord->setAttribute('lot_quantity',   intval($data[5]));
      try{
        $newPriceRecord->save();
      } catch (\yii\db\Exception $ex) {        
      }
    }
  }

  protected function getNamesMap() {

  }

  public function getBrands($search_text, $use_analog) {
    $data = [
      'tovnum'  => $search_text,
      'cross'  => $use_analog?1:0
    ];
    $request = $this->prepareRequest($data, true, $this->_url, 'fa.getTov');
    return $request;
  }

  public function getBrandsParse($xml) {
    var_dump($xml);
    return []; 
  }

  public function getParts($ident, $searchText) {

  }

  public function onlineRequestHeaders($ch, $action = "", $content = "") {
    $headers = [
      "Content-type: text/xml;charset=\"utf-8\"",
      "Accept: text/xml",
      "Cache-Control: no-cache",
      "Pragma: no-cache",
      "SOAPAction: " . $this->_url . $action,
      "Content-length: ".strlen($content),
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_USERPWD, $this->_default_params['login'].":".$this->_default_params['password']);
  }

  public function generateContext($action){
    $context = <<<CEND
      <?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tns="urn:api" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
          <SOAP-ENV:Body>
            <mns:fa.getTov xmlns:mns="" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <jrlid xsi:type="xsd:integer"></jrlid>
              <tovnum xsi:type="xsd:string"></tovnum>
              <cross xsi:type="xsd:string"></cross>
              <login xsi:type="xsd:string"></login>
              <password xsi:type="xsd:string"></password>
            </mns:fa.getTov>
          </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
CEND;
    return $context;
  }

  public function prepareRequest($data, $is_post = false, $url = false, $action = false) {
    $ch = curl_init();

    $content = $this->generateContext($action);

    curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_PORT, $is_post);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, true);

    $this->onlineRequestHeaders($ch, $action, $content);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
    
    return $ch;
  }

  protected function getRowName() { return 'detail'; }

}
