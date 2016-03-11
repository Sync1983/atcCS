<?php

/**
 * @author Sync
 */
namespace backend\models\soap;
use yii\base\Object;
use backend\models\xml\XmlAttribute;

/**
 * Для описания функций используется DocComment с тэгом @wsdl
 * Входные и выходные параметры должны иметь описание типов
 */
class WSDL extends Object{
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
  protected $cname      = "";
  protected $functions  = [];
  protected $parameters = [];
  protected $call_args  = [];
  protected $args       = [];
  /* @var $reflection \ReflectionClass */
  protected $reflection = null;


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


  public function __construct($class = false,$config = array()) {

    if( !$class ){
      throw new \InvalidArgumentException("Описываемый класс должен быть указан в конструкторе");
    }

    if( !is_object($class) && !is_string($class) ){
      throw new \InvalidArgumentException("Класс должен задаваться обектом, либо строкой имени");
    }

    if( is_string($class ) ){
      $newClass = \yii::createObject($class);
      if( !$newClass ){
        throw new \yii\base\InvalidParamException("Ошибка при создании указанного класса");
      }
      $this->class = $newClass;
    } else {
      $this->class = $class;
    }

    $cname        = $this->class->className();
    $name_split   = explode("\\", $cname);
    $this->cname  = array_pop($name_split);

    $this->reflection = new \ReflectionClass($this->class);

    return parent::__construct($config);
  }

  public function init() {
    $this->root     = new \backend\models\xml\XmlAttribute('wsdl:definitions');
    $this->document = new \backend\models\xml\XmlAttribute('wsdl:documentation');    
    $this->types    = new \backend\models\xml\XmlAttribute('wsdl:types');
    $this->portType = new \backend\models\xml\XmlAttribute('wsdl:portType');
    $this->binding  = new \backend\models\xml\XmlAttribute('wsdl:binding');

    $this->root->appendChild($this->document);    
    $this->root->appendChild($this->types);
    $this->root->appendChild($this->portType);
    $this->root->appendChild($this->binding);

    $this->root->setAttributes($this->headerTags);

    $this->document->setAttributes(['xmlns:wsdl' => "http://schemas.xmlsoap.org/wsdl/"]);
    $this->document->value  = "Describe service for model " . $this->cname;

    $this->portType->setAttributes('name','service'.$this->cname);

    $schm = new XmlAttribute("wsdl:schema");
    $schm->setAttributes([
      'xmlns:xs'        => "http://www.w3.org/2001/XMLSchema",
      'targetNamespace' => "http://greath.example.com/2004/schemas/resSvc"
    ]);

    $this->types->appendChild($schm);
    $this->types = $schm;

    $this->describe();
    
    return parent::init();
  }

  public function getWSDL(){
    $this->compile();
    return $this->root;
  }

//======================================================================================================================
  protected function describeMethods(){
    $methods = $this->reflection->getMethods(\ReflectionMethod::IS_PUBLIC);
    foreach ($methods as $method){
      /* @var $method \ReflectionMethod */
      if( ($method->class !== $this->class->className()) ||
          (!$method->getDocComment()) ||
          (strpos($method->getDocComment(), '@wsdl') == -1) ){
        continue;
      }

      $this->describeMethod($method);
    }
  }

  protected function describeMethod(\ReflectionMethod $method){    
    $name     = $method->name;

    $first_symbol = strtoupper(substr($name, 0, 1));
    $op_name  = $first_symbol . substr($name, 1);

    $comment  = $method->getDocComment();

    list($params_in,$params_out) = $this->describeParams($method,$comment);

    $this->functions[$name] = [
      'opName'      => $op_name,
      'paramsIn'    => $params_in,
      'paramsOut'   => $params_out
    ];
  }

  protected function describeParams(\ReflectionMethod $method, $comment = ""){
    $in_name    = 'message_' . $method->name . "_input";
    $out_name   = 'message_' . $method->name . "_output";
    $this->call_args[$in_name] = [];

    $params         = $method->getParameters();
    $param_pos      = [];
    
    $comment_params = [];
    
    foreach ($params as $param){
      /* @var $param \ReflectionParameter */
      $pname  = $param->getName();
      $ppos   = $param->getPosition();
      $param_pos[$pname] = $ppos;
    }
    
    preg_match_all('/.*\@param (\S*) \$(\S*)/i', $comment, $comment_params, PREG_SET_ORDER);

    foreach ($comment_params as $param_descr ){
      list($tmp,$ptype,$pname) = $param_descr;

      if( !isset($param_pos[$pname]) ){
        continue;
      }
      
      $pos = intval($param_pos[$pname]);
      $this->call_args[$in_name][ $pos ] = [
        'name' => $pname,
        'type' => $this->describeParam($method, $ptype, $pname)
      ];
    }

    return [$in_name,$out_name];
  }

  protected function describeParam(\ReflectionMethod $method, $type, $name){
    $type_name = "type_" . $method->name . "_" . $name;

    if( class_exists($type) ){
      /* @var $class \yii\base\Model */
      $class = \yii::createObject($type);
      $attr = $class->getAttributes();
      
      $this->args[$type_name] = "complex$type_name";
      $this->args["complex$type_name"] = [];
      foreach (array_keys($attr) as $aname){
        $this->args["complex$type_name"][$aname] = "ws:string";
      }
    } else {
      return "ws:$type";
    }
    
    return $type_name;
  }

  protected function describe(){

    $this->describeMethods();
    
  }
  
  protected function compileMethods() {

    foreach ($this->functions as $function){
      $op_name    = $function['opName'];
      $params_in  = $function['paramsIn'];
      $params_out = $function['paramsOut'];

      $xml = new XmlAttribute('wsdl:operation');
      $xml->setAttributes('name',$op_name);

      $this->portType->appendChild($xml);      

      $in_xml = new XmlAttribute('wsdl:input');
      $in_xml->setAttributes('message',$params_in);
      $xml->appendChild($in_xml);
      
      $out_xml = new XmlAttribute('wsdl:output');
      $out_xml->setAttributes('output',$params_out);
      $xml->appendChild($out_xml);
      
    }
    
  }

  protected function compileMessages(){
    foreach ($this->call_args as $name => $message){
      $xml = new XmlAttribute('wsdl:message');
      $xml->setAttributes('name',$name);
      $this->root->appendChild($xml);
      
      foreach ($message as $part){
        $pxml = new XmlAttribute(('wsdl:part'));
        $pxml->setAttributes($part);
        $xml->appendChild($pxml);
      }      
    }
    return;
  }

  protected function compileTypes(){
    foreach ($this->args as $name => $type){

      if( is_string($type) ){
        $xml = new XmlAttribute('wsdl:element');
        $xml->setAttributes([
          'name'  => $name,
          'type'  => $type
        ]);
        $this->types->appendChild($xml);
      } else {
        $cxml  = new XmlAttribute('wsdl:complexType');
        $sqxml = new XmlAttribute('wsdl:sequence');

        $cxml->setAttributes('name',$name);
        $cxml->appendChild($sqxml);
        $this->types->appendChild($cxml);
        
        foreach ($type as $tname=>$atype){
          $txml = new XmlAttribute('wsdl:element');
          $txml->setAttributes('name',$tname);
          $txml->setAttributes('type',$atype);
          $sqxml->appendChild($txml);
        }
      }
      
    }
  }

  protected function compile(){

    $this->compileTypes();
    $this->compileMessages();
    $this->compileMethods();

  }
}
