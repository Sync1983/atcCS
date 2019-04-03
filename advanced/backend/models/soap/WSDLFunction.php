<?php

/**
 * @author Sync
 */

namespace backend\models\soap;
use yii\base\BaseObject;
use backend\models\xml\XmlAttribute;
/**
 * Описывает функцию формате WSDL
 * описание берется из PhpDoc функции
 */
class WSDLFunction extends BaseObject{
  /* @var $method \ReflectionMethod */
  protected $method     = null;
  /* @var $root XmlAttribute */
  protected $root       = null;
  /* @var $documetn XmlAttribute */
  protected $document   = null;
  /* @var $input XmlAttribute */
  protected $input      = null;
  protected $operations = [];
  protected $name       = null;
  protected $funct_name = null;
  protected $types      = [];
  protected $type_convert = [
    'integer' => 's:decimal',
    'string'  => 's:string',
  ];

  public function __construct(\ReflectionClass $reflection, $name){
    
    if( $reflection->hasMethod($name) ) {
      $this->method = $reflection->getMethod($name);
    }

    $this->name = $name;
    $this->funct_name = strval($name)."";

    return parent::__construct();
  }

  public function init() {
    $this->root     = \yii::$app->wsdl->getXmlAttribute('operation');
    $this->document = \yii::$app->wsdl->getXmlAttribute('documentation');
    $this->input    = \yii::$app->wsdl->getXmlAttribute('input');

    $this->root->appendChild([$this->document, $this->input]);
  }

  public function describe() {
    if( !$this->method ){
      return null;
    }

    $this->parseComment();    
    $this->root->setAttributes('name',  $this->name);
    $this->input->setAttributes('message', $this->funct_name. "_msg");
    return $this->root;
  }

  public function getMessages(){
    if( !$this->method ){
      return null;
    }
    return $this->createMessages();
  }

  public function getOperation(){
    if( !$this->method ){
      return null;
    }
    return $this->createOperation();
  }

  public function getName(){
    return $this->name;
  }

//======================================================================================================================
  protected function parseComment(){
    
    $comment = $this->method->getDocComment();
    $matches = [];
    preg_match_all('%^.*\* @(\S*) (.*)%mi', $comment, $matches, PREG_SET_ORDER);
    
    foreach ($matches as $directive){
      list($tmp,$name,$data)  = $directive;

      $method = "set_$name";
      if( $this->hasMethod($method) ){
        $this->$method($data);
      }
    }

  }

  protected function set_wsdl_name($value){    
    $this->name = trim(strval($value));
  }

  protected function set_wsdl_description($value){
    $this->document->value = trim($value);
  }

  protected function set_param($value){
    $matches = [];
    preg_match('/^(.*) +\$(.*)/', $value, $matches);
    unset($matches[0]);

    $name = array_pop($matches);
    $type = array_shift($matches);

    if( isset($this->type_convert[$type]) ){
      $ws_type = $this->type_convert[$type];
      $this->types[$name] = $ws_type;
    }
  }

  protected function createMessages(){
    $name = $this->funct_name."_msg";
    $xml = \yii::$app->wsdl->getXmlAttribute('message');
    $xml->setAttributes('name',$name);
    foreach ($this->types as $pname => $ptype){
      if( is_string($ptype) ){
        $pxml = \yii::$app->wsdl->getXmlAttribute('part');
        $pxml-> setAttributes('name',$pname);
        $pxml-> setAttributes('type',$ptype);
        $xml -> appendChild($pxml);
      }
    }
    return $xml;
  }

  protected function createOperation(){
    $operation = \yii::$app->wsdl->getXmlAttribute('operation');

    $opin   = new XmlAttribute('soap:operation');
    $input  = \yii::$app->wsdl->getXmlAttribute('input');
    $output = \yii::$app->wsdl->getXmlAttribute('output');
    $body   = new XmlAttribute('soap:body');

    $opin->setAttributes('soapAction',"http://example.com/getTerm");
    $body->setAttributes('use',"literal");

    $input  ->appendChild($body);
    $output ->appendChild($body);

    $operation->appendChild($opin);
    $operation->appendChild($input);
    $operation->appendChild($output);

    $operation->setAttributes('name', $this->name);
    return $operation;
  }


}
