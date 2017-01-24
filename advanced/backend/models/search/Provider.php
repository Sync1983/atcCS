<?php

/**
 * @author Sync
 */

namespace backend\models\search;
use yii\base\Object;
use backend\models\search\SearchInterface;

abstract class Provider extends Object implements SearchInterface{
  protected $_CLSID = 0;
  protected $_NAME  = "Provider";
  protected $_url   = "http://";
  protected $_default_params = [];  

  public function __construct($CLSID,$NAME,$FIELDS = false,$config=[]) {
    if( $CLSID ){
      $this->_CLSID = $CLSID;
    }
    if( $NAME ){
      $this->_NAME  = $NAME;
    }
    if ( $FIELDS ){
      $this->_default_params = $FIELDS;
    }

    return parent::__construct($config);
  }

  public function getCLSID(){
    return $this->_CLSID;
  }

  public function getName(){
    return $this->_NAME;
  }
  /**
   * Формирует заголовки запроса
   * @param resource $ch
   */
  protected function onlineRequestHeaders($ch){
    curl_setopt($ch, CURLOPT_HEADER, 0);
  }
  /**
   * Отправляет запрос по указаному URL с параметрами $data
   * POST или GET запрос определяется флагом is_post
   * @param array $data
   * @param boolean $is_post
   * @param string $url
   * @return mixed
   */
  public function prepareRequest($data,$is_post = false, $url=false){
    $ch = curl_init();

    $this->onlineRequestHeaders($ch);
    if( !$url ){
      $url = $this->_url;
    }

    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);    
    curl_setopt($ch, CURLOPT_POST, $is_post==1);
    $params = http_build_query(array_merge($data,$this->_default_params));
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

  public function parseResponse($answer_string, $method){
    $xml = $this->xmlToArray($answer_string);
    
    if($this->hasMethod($method."Parse") ){      
      return call_user_func([$this,$method."Parse"],$xml);
    }
    return [];
  }
  /**
   * Преобразуем входящую XML строку в массив
   * @param string $xml
   * @return array
   */
  protected function xmlToArray($xml){
    if( $xml === "[]" ){
      \yii::error("Xml error: []");
      return [];
    }

    $use_errors = libxml_use_internal_errors(true);

    $xml_string = simplexml_load_string($xml, "SimpleXMLElement", LIBXML_NOCDATA);
    if( $xml_string === false ){
      foreach(libxml_get_errors() as $error) {
        \yii::error($error->message);
      }
      \yii::error($xml);
      libxml_clear_errors();
      libxml_use_internal_errors($use_errors);
      $xml_string = false;
      return [];
    }
    libxml_clear_errors();
    libxml_use_internal_errors($use_errors);
    $json = json_encode($xml_string,JSON_FORCE_OBJECT);
    return json_decode($json,true);
  }

  protected function renameByMap($data,$renameMap, $append=false){
    $answer = [];
    if( !is_array($data) ){
      return [];
    }
    foreach ($data as $key=>$value){
      if( isset($renameMap[$key]) ){
        $answer[$renameMap[$key]] = $value;
      } elseif( $append ) {
        $answer[$key] = $value;
      }
    }
    return $answer;
  }

  protected function executeRequest($request){
    $answer = curl_exec($request);

    if(curl_errno($request) !== 0){
      \yii::info("Curl error: ". curl_error($request));
      return false;
    }

    return $answer;
  }

  protected abstract function getRowName();
  protected abstract function getNamesMap();

}
