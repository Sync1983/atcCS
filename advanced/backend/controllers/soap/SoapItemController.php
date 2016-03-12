<?php

namespace backend\controllers\soap;
use yii\base\Object;

abstract class SoapItemController extends Object{

  const VAR_STRING  = 'string';
  const VAR_BOOLEAN = 'boolean';
  const VAR_INTEGER = 'decimal';
  const VAR_FLOAT   = 'float';
  const VAR_DOUBLE  = 'double';
  const VAR_DATETIME= 'dateTime';
  const VAR_TIME    = 'tiem';
  const VAR_DATE    = 'date';
  const VAR_HEX     = 'hexBinary';
  const VAR_BASE64  = 'base64Binary';
  const VAR_URI     = 'anyUri';

  const VAR_CLASS   = 'class';
  const VAR_ARRAY   = 'array';

  abstract public function all();
  abstract public function view($id);
  abstract public function create($data);
  abstract public function update($id,$params);
  abstract public function delete($id);  

//======================================================================================================================

  public function wsdl(){
    return (new \backend\models\soap\WSDL($this))->getWSDL();
  }

}
