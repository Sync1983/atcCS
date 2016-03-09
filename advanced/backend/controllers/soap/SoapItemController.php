<?php

namespace backend\controllers\soap;
use yii\base\Object;

abstract class SoapItemController extends Object{

  abstract public function all();
  abstract public function view($id);
  abstract public function create($data);
  abstract public function update($id,$params);
  abstract public function delete($id);

  public function wsdl(){    
    return ['wsdl'=>'asd','items'=>['a'=>'1','b'=>2]];
  }

}
