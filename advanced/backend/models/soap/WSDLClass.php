<?php

/**
 * @author Sync
 */

namespace backend\models\soap;
use yii\base\Object;
use backend\models\xml\XmlAttribute;
/**
 * Описывает класс в формате WSDL
 * описание берется из PhpDoc класса
 * используются
 * @wsdl_describe   для описания порта,
 * @wsdl_publicate  для указания списка экспортируемых функций
 * @wsdl_name       для указания имени, отличающегося от имени класса
 */
class WSDLClass extends Object{

  private $config;

  /* @var $root XmlAttribute */
  protected $root       = null;
  /* @var $documents XmlAttribute */
  protected $document   = null;
  /* @var $types XmlAttribute */
  protected $types      = null;
  /* @var $portType XmlAttribute */
  protected $portType   = null;
  /* @var $binding XmlAttribute */
  protected $binding    = null;  
  /* @var $class Object */
  protected $class      = null;
  /* @var $reflection \ReflectionClass */
  protected $reflection = null;

  protected $name       = null;
  protected $populate   = [];

  public $headerTags    = [];

  public function __construct($class = false, $config = array()) {
    if( is_a($class,  Object::className()) ){
      $this->class = $class;
    } else {
      $this->class = \yii::createObject($class);
    }

    if( !$this->class ){
      throw new \InvalidArgumentException("Объект класса объявлен некоректно");
    }

    return parent::__construct($config);
  }

  public function init() {
    $this->root     = \yii::$app->wsdl->getXmlAttribute('definitions');
    $this->document = \yii::$app->wsdl->getXmlAttribute('documentation');
    $this->types    = \yii::$app->wsdl->getXmlAttribute('types');
    $this->portType = \yii::$app->wsdl->getXmlAttribute('portType');
    $this->binding  = \yii::$app->wsdl->getXmlAttribute('binding');

    $this->root->appendChild([$this->document,$this->types,$this->portType,$this->binding]);
    $this->root->setAttributes($this->headerTags);    

    $bindingXML = new XmlAttribute('soap:binding');
    $bindingXML->setAttributes(['style'=>"document", 'transport'=>"http://schemas.xmlsoap.org/soap/http"]);

    $this->binding->appendChild($bindingXML);    

    $this->reflection = new \ReflectionClass($this->class);

    $name = $this->class->className();
    $name_parts = explode('\\', $name);
    $this->name = "service" . array_pop($name_parts);
  }

  public function describe() {
    $this->parseComment();

    if( !count($this->populate) ){
      $this->set_publicate_all();
    }



    foreach ($this->populate as $operation){
      /* @var $operation WSDLFunction */
      $this->portType->appendChild($operation->describe());
      $this->root->appendChild($operation->getMessages());
      $this->binding->appendChild($operation->getOperation());
    }

    $this->portType->setAttributes('name',$this->name);
    $this->binding->setAttributes('name',  "bnd_" . $this->name);
    $this->binding->setAttributes('type',  $this->name);
    
    return $this->root;
  }
//======================================================================================================================
  protected function parseComment(){
    
    $comment = $this->reflection->getDocComment();
    $matches = [];
    preg_match_all('%^.*\* @wsdl_(\S*) (.*)\r?\n%mi', $comment, $matches, PREG_SET_ORDER);

    foreach ($matches as $directive){
      list($tmp,$name,$value) = $directive;
      $method = "set_$name";
      if( $this->hasMethod($method) ){
        $this->$method($value);
      }
    }

  }

  protected function set_name($value){
    $this->name = trim(strval($value));
  }

  protected function set_describe($value){
    $this->document->value = trim($value);
  }

  protected function set_publicate($value){
    $funct = explode(",", $value);
    
    foreach ($funct as $function){
      $name = trim($function);
      $this->populate[] = new WSDLFunction($this->reflection, $name);      
    }
  }

  protected function set_publicate_all(){
    $funct = $this->reflection->getMethods();
    
    $class_name = $this->class->classname();

    foreach ($funct as $function){
      /* @var $function \ReflectionMethod */
      $name   = $function->name;
      $class  = $function->class;
      
      if( $class !== $class_name ){
        continue;
      }
      
      $this->populate[] = new WSDLFunction($this->reflection, $name);
    }
  }

}
