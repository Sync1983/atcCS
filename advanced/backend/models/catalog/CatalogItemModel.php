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
    //$Query = "SELECT * FROM \"Catalog\" where path~'$start.*{1}'";
    $Query = "SELECT c.*,s.price,s.count FROM \"Catalog\" c
              LEFT JOIN \"Stock\" s ON ((s.articul = c.articul) and (s.maker = c.maker))
              WHERE path~'$start.*{1}'";    
    $QueryP= "SELECT name,path,is_group FROM \"Catalog\" where path @> '$start'";

    $isGuest  = \yii::$app->user->isGuest;
    $user     = \yii::$app->user->getIdentity();
    $standart_markup  = \yii\helpers\ArrayHelper::getValue(\yii::$app->params, 'guestOverPrice', 23);
    $markup   = $isGuest?$standart_markup :$user->over_price * 1;
    
    $result = CatalogItemModel::findBySql($Query)->asArray()->all();
    
    if( !$result ){
      $result = [];
    }
    
    foreach ($result as $key=>$row){
      $price = $row['price'];
      $result[$key]['rp']    = round($price + ($price*$markup)/100,2);
      $result[$key]['price'] = round($price + ($price*$markup)/100,2);
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
