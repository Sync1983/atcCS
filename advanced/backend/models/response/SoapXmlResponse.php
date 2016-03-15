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

    if( !$response->data || !is_object($response->data) || is_a($response->data, 'XmlAttribute') ){
      throw new \yii\base\InvalidValueException("Для формирования ответа обработчики должны вернуть тип XmlAttribute или его наследника");
    }

    $response->content = sprintf("<?xml version=\"%s\" encoding=\"%s\"?>\r%s", $this->version,  $charset, $response->data);
  }

}
