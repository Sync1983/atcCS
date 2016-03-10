<?php

/**
 * @author Sync
 */
namespace backend\models\response;
use yii\web\XmlResponseFormatter;

class SoapXmlResponse extends XmlResponseFormatter{

  public function format($response) {
    $charset = $this->encoding === null ? $response->charset : $this->encoding;
    if (stripos($this->contentType, 'charset') === false) {
      $this->contentType .= '; charset=' . $charset;
    }
    $response->getHeaders()->set('Content-Type', $this->contentType);

    if( !$response->data || !is_object($response->data) || is_subclass_of($response->data, \backend\models\xml\XmlAttribute::className()) ){
      throw new \yii\base\InvalidValueException("Для формирования ответа обработчики должны вернуть тип XmlAttribute или его наследника");
    }

    if( $this->rootTag ){
      $root = new \backend\models\xml\XmlAttribute($this->rootTag);
      $root->appendChild($response->data);
    }

    $response->content = sprintf("%s",$root);
  }

}
