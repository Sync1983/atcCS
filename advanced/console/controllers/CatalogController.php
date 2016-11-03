<?php

namespace console\controllers;
use yii\console\Controller;
use backend\models\catalog\CatalogItemModel;

class CatalogController extends Controller{

  public function actionLoad($path){
    $xml = simplexml_load_file($path);
    if ( !$xml ) {
      echo "XML Open Error\n";
      exit(1);
    }
    CatalogItemModel::deleteAll();
    $level  = 0;
    $id     = 0;

    $this->load_xml($xml, $level, $id);

  }
  
  /* @var $xml \SimpleXMLElement */
  protected function load_xml($xml, $level,$id){

    foreach ($xml->children() as $child){
      $id++;
      $type = $child->getName()==="G";
      $path = $level . "." . $id . ($type?"":"P");

      if( $type ) {
        echo $path . ": " . $child['N'] . "\n";
        $model = new CatalogItemModel();
        $model->crm_id  = 0;
        $model->is_group = true;
        $model->name    = (string) $child['N'];
        $model->path    = $path;
        if( !$model->save() ) {
          var_dump($model->getErrors());
          die();
        }
        $this->load_xml($child, $path, 0);
      } else {
        echo $path .": ". $child['Номенклатура'] . "\n";
        $model = new CatalogItemModel();
        $model->crm_id  = 0;
        $model->is_group = false;
        $model->name    = (string) $child['Номенклатура'];
        $model->articul = (string) $child['Артикул'];
        $model->descr   = (string) $child['Описание'];
        $model->maker   = (string) $child['Производитель'];
        $model->path    = $path;
        if( !$model->save() ) {
          var_dump($model->getErrors());
          die();
        }
      }

    }
  }

}