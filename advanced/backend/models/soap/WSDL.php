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
    'xmlns:s'           => "http://www.w3.org/2001/XMLSchema",    
    'xmlns:wsdl'        => "http://schemas.xmlsoap.org/wsdl/",    
  ];

  public $wsdlPrefix    = 'wsdl:';
  public $typePrefix    = 's:';

  public function getWSDL($class){
    $wsdl = new WSDLClass($class,['headerTags'=>  $this->headerTags]);
    return $wsdl->describe();
  }

  public function getXmlAttribute($name){
    return new XmlAttribute($this->wsdlPrefix . $name);
  }

  public function getTypeAttribute($name){
    return new XmlAttribute($this->typePrefix. $name);
  }
  
}
