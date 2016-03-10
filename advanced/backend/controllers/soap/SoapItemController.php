<?php

namespace backend\controllers\soap;
use yii\base\Object;

abstract class SoapItemController extends Object{

  abstract public function all();
  abstract public function view($id);
  abstract public function create($data);
  abstract public function update($id,$params);
  abstract public function delete($id);

  abstract public function model();

  public function wsdl(){    
    /* @var $model \yii\db\ActiveRecord */
    $model      = $this->model();
    $db         = $model->getDb();
    $attributes = $model->safeAttributes();
    $table_name = $model->tableName();
    
    foreach ($attributes as &$attr){
      $attr     = $db->quoteValue($attr);
    }
    
    $SQL        = "SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$table_name' and column_name IN (" . implode(",", $attributes) . ");";
    $db_answer  = $db->createCommand($SQL)->queryAll();

    $fields     = [];

    foreach ($db_answer as $row){
      $fields[$row['column_name']] = $row['data_type'];
    }

    $root = new \backend\models\xml\XmlAttribute('import');
    $root->setAttributes(['namespace'=>\yii::$app->getUrlManager()->getBaseUrl(), 'location'=>\yii::$app->getUrlManager()->getBaseUrl()]);
    return $root;
    //$fields;
  }

}
