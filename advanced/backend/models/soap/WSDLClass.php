<?php

/**
 * @author Sync
 */

namespace backend\models\soap;
use backend\models\soap\WSDL;
/**
 * Описывает класс в формате WSDL
 * описание берется из PhpDoc класса
 * используются
 * @wsdl_describe   для описания порта,
 * @wsdl_publicate  для указания списка экспортируемых функций
 * @wsdl_name       для указания имени, отличающегося от имени класса
 */
class WSDLClass extends WSDL{  
  protected $description = null;
  protected $name        = null;
  protected $functions   = null;

  public function init() {
    parent::init();
  }

  protected function publicate($txt){

  }

  protected function describe() {
    $comment = $this->reflection->getDocComment();
    $matches = [];
    preg_match_all('%^ \* @wsdl_(.*) (.*)\r?\n?$%im', $comment, $matches, PREG_SET_ORDER);
    
    foreach ($matches as $directive){
      list($tmp,$name,$value) = $directive;
      switch ($name){
        case 'describe':
          $this->description = $value;
          break;
        case 'name':
          $this->name = $value;
          break;
        case 'publicate':
          $this->publicate($value);
          break;
      }
    }

   if ( !$this->name ){
     $name = $this->class->className();
     $name_parts = explode('\\', $name);
     $this->name = "service" . array_pop($name_parts);
   }

  }

  protected function compile() {    
    $this->portType->setAttributes('name',  $this->name);

    if( $this->description ){      
      $this->document->value = $this->description;
      $this->portType->appendChild($this->document);
    }
  }
  
}
