<?php

namespace backend\controllers\rest;
use yii\base\BaseObject;

abstract class RestItemController extends BaseObject{

  abstract public function all(     $id, $params );
  abstract public function get(     $id, $params );
  abstract public function add(     $id, $params );
  abstract public function update(  $id, $params );
  abstract public function delete(  $id, $params );
  
}
