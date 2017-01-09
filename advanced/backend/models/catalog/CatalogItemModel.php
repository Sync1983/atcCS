<?php

/**
 * @author Sync
 */
namespace backend\models\catalog;

class CatalogItemModel extends \yii\db\ActiveRecord{

  public static function loadNode($start = "0.1"){
    if( !$start || ($start=='false') ){
      $start = "0.1";
    }
    $start = (string) $start;    
    $Query = "SELECT * FROM \"Catalog\" where path~'$start.*{1}'";
    $QueryP= "SELECT name,path,is_group FROM \"Catalog\" where path @> '$start'";

    $result = CatalogItemModel::findBySql($Query)->all();

    if( !$result ){
      $result = [];
    }

    $resultPath = CatalogItemModel::findBySql($QueryP)->all();
    if( !$resultPath ){
      $resultPath = [];
    }

    return ['nodes' => $result, 'path' => $resultPath];
  }

  public function attributes(){
    return [
      'id','name','crm_id','articul','descr','maker','is_group','path'];
  }

  public function rules(){
    return [
      [['id',"crm_id"],'integer'],
      [['articul',"descr","name","maker","path"],'string'],      
      [["is_group"],'boolean'],
    ];
  }

  public static function tableName() {
    return 'Catalog';
  }
  
}
