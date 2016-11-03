<?php

/**
 * @author Sync
 */
namespace backend\controllers\helper;
use yii\base\Action;
use backend\models\catalog\CatalogItemModel;

class GetCatalogNodeAction extends Action{
  
  public function run($params){    
    $data = json_decode($params, true);
    $path = (string) (isset($data['path'])?$data['path']:'');

    $items = CatalogItemModel::loadNode($path);

    return $items;

  }
  
}
