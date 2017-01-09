<?php

/**
 * @author Sync
 */
namespace backend\controllers\catalog;
use yii\base\Action;
use backend\models\catalog\CatalogItemModel;

class GetDataAction extends Action{
  
  public function run($params){    
    $data = json_decode($params, true);
    $path = (string) (isset($data['path'])?$data['path']:'');

    $items = CatalogItemModel::loadNode($path);

    return $items;

  }
  
}
