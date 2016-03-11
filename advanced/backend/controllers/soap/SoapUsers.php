<?php

/**
 * @author Sync
 */

namespace backend\controllers\soap;
use backend\controllers\soap\SoapItemController;

class SoapUsers extends SoapItemController{
  /**
   * @wsdl
   * Создает пользователя
   * @param \common\models\User $data
   * @param string $text
   */
  public function create($data) {

  }

  public function delete($id) {
    
  }
  /**
   * @wsdl
   * Обновляет пользователя
   * @param integer $id
   * @param \common\models\User $params
   */
  public function update($id, $params) {
    
  }

  public function view($id) {

  }

  public function all() {
        
  }  

}
