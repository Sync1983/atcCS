<?php

/**
 * @author Sync
 */

namespace backend\controllers\soap;
use backend\controllers\soap\SoapItemController;
/**
 * WSDL сервис для управления клиентами
 * @wsdl_describe Сервис управления пользователями
 * @wsdl_publicate create, delete, update, view, all, error
 */
class SoapUsers extends SoapItemController{
  /**
   * @wsdl_name СоздатьПользователя
   * @wsdl_description Создает пользователя
   * @param \common\models\User $data
   * @param string $text
   */
  public function create($data) {

  }

  public function delete($id) {
    
  }
  /**
   * @wsdl_description Обновляет пользователя
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
