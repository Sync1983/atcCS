<?php

/**
 * @author Sync
 */

namespace backend\models\soap;
use yii\base\Object;
use backend\models\xml\XmlAttribute;
/**
 * Описывает функцию формате WSDL
 * описание берется из PhpDoc функции
 */
class WSDLFunction extends Object{
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
    'integer' => 'ws:number',
    'string'  => 'ws:string',
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
    return $this->createMessages();
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
    $this->name = strval($value);
  }

  protected function set_wsdl_description($value){
    $this->document->value = strval($value);
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


}
