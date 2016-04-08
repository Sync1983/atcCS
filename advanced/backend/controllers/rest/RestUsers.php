<?php

/**
 * @author Sync
 */

namespace backend\controllers\rest;
use backend\controllers\rest\RestItemController;
use backend\models\xml\XmlAttribute;

class RestUsers extends RestItemController{

  public function delete($id, $params) {
    
  }
  
  public function update($id, $params) {
    
  }

  public function all($id, $params) {
    return new XmlAttribute('test');
  }

  public function add($id, $params) {
    
  }

  public function get($id, $params) {

  }

}
