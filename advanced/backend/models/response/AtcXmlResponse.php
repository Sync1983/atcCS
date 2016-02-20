<?php

/**
 * @author Sync
 */
namespace backend\models\response;
use yii\web\ResponseFormatterInterface;

class AtcXmlResponse implements ResponseFormatterInterface{

  protected function isAssoc(array $array) {
    return count(array_filter(array_keys($array), 'is_string')) > 0;
  }

  public function createXml($root,$name="item"){
    $str = "";
    $isAssoc = $this->isAssoc($root);

    foreach ($root as $key=>$value){
      $key = preg_replace("/\s/","-",$key);
      if( !is_array($value) ){
        $str .= "<$key>$value</$key>";
      } else {
        $str .= !$isAssoc?($this->createXml($value)):"<$key>" . $this->createXml($value) . "</$key>";
      }
    }
    return $str;
  }

  public function format($response) {
    $response->getHeaders()->set('Content-Type', 'application/xml; charset=UTF-8');    
    $response->content = "<response>" . $this->createXml($response->data) . "</response>";
  }

}
