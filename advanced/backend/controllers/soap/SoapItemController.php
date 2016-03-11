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

  protected $deprecated_functions = ['model', 'getTypes'];

  abstract public function all();
  abstract public function view($id);
  abstract public function create($data);
  abstract public function update($id,$params);
  abstract public function delete($id);  

//======================================================================================================================
  protected function getParameters(\ReflectionMethod $method){
    $parameters = $method->getParameters();
    $types      = $this->getTypes();
    $result     = [];
    foreach ($parameters as $parameter){
      /* @var $parameter \ReflectionParameter */
      $name = $parameter->getName();      
      if( !array_key_exists($name, $types) ){
        throw new \yii\base\InvalidParamException("Имена параметров должны быть описаны в функции getTypes");
      }
      $result[$name] = $types[$name];
    }
    
    return $result;
  }

  protected function getActions(){
    $reflection = new \ReflectionClass($this);
    $methods    = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);
    $method_info = [];
    foreach ($methods as $method){
      /* @var $method \ReflectionMethod */
      if( ($this->className() !== $method->class) || in_array($method->name, $this->deprecated_functions) ){
        continue;
      }

      $method_info[$method->name] = $this->getParameters($method);
    }

    return $method_info;
  }

  public function wsdl(){    
    /* @var $model \yii\db\ActiveRecord */    
    /*$model_path = explode('\\',$this->model()->className());
    $model_name = array_pop($model_path);
    /*$db         = $model->getDb();
    $attributes = $model->safeAttributes();
    $table_name = $model->tableName();
    
    foreach ($attributes as &$attr){
      $attr     = $db->quoteValue($attr);
    }
    
    /*$SQL        = "SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$table_name' and column_name IN (" . implode(",", $attributes) . ");";
    $db_answer  = $db->createCommand($SQL)->queryAll();

    $fields     = [];

    foreach ($db_answer as $row){
      $fields[$row['column_name']] = $row['data_type'];
    }*/

    /*$types    = new \backend\models\xml\XmlAttribute('wsdl:types');
    $interface= new \backend\models\xml\XmlAttribute('wsdl:interface');
    $service  = new \backend\models\xml\XmlAttribute('wsdl:service');

    $root     = $this->header();
    $actions  = $this->getActions();

    foreach ($actions as $name=>$params){
      $functions = new \backend\models\xml\XmlAttribute('wsdl:operation');
      $functions->setAttributes([
        'name'    => 'op_' . $name,
        'pattern' => "http://www.w3.org/ns/wsdl/in-out",
        'style'   => "http://www.w3.org/ns/wsdl/style/iri"
      ]);
      
      $interface->appendChild($functions);
    }

    $interface->setAttributes([
       'name' => 'interface_' . $model_name
    ]);
    $service->setAttributes([
       'name' => 'service' . $model_name,
       'interface' => 'interface_' . $model_name
    ]);

    $root->appendChild($interface);
    $root->appendChild($service);
    
    return $root;
    //$fields;*/
    return (new \backend\models\soap\WSDL($this))->getWSDL();
  }

}
