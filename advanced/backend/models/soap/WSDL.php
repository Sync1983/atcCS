<?php

/**
 * @author Sync
 */
namespace backend\models\soap;
use yii\base\Component;
use backend\models\xml\XmlAttribute;

/**
 * Для описания функций используется DocComment с тэгом @wsdl_*
 * Входные и выходные параметры должны иметь описание типов
 */
class WSDL extends Component{
 
  

  public $headerTags = [
    'xmlns:soap'        => "http://schemas.xmlsoap.org/wsdl/soap/",
    'xmlns:tm'          => "http://microsoft.com/wsdl/mime/textMatching/",
    'xmlns:soapenc'     => "http://schemas.xmlsoap.org/soap/encoding/",
    'xmlns:mime'        => "http://schemas.xmlsoap.org/wsdl/mime/",
    'xmlns:s'           => "http://www.w3.org/2001/XMLSchema",
    'xmlns:soap12'      => "http://schemas.xmlsoap.org/wsdl/soap12/",
    'xmlns:http'        => "http://schemas.xmlsoap.org/wsdl/http/",
    'xmlns:wsdl'        => "http://schemas.xmlsoap.org/wsdl/",
    'xmlns:tns'         => 'atc58.ru',
    'targetNamespace'   => 'atc58.ru'
  ];

  public $wsdlPrefix    = 'wsdl:';

  public function getWSDL($class){
    $wsdl = new WSDLClass($class,['headerTags'=>  $this->headerTags]);
    return $wsdl->describe();
  }

  public function getXmlAttribute($name){
    return new XmlAttribute($this->wsdlPrefix . $name);
  }
  
}
