<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class ArticulInfoAction extends Action{

  public function run($params){
    $data   = json_decode($params,true);
    
    if( !$data || !isset($data['articul_id']) ){
      return ['error' => 'Ошибка параметров'];
    }

    $answer = [];

    $articul = \common\models\PgArticleInfo::findOne(['id'=> $data['articul_id'] * 1]);
    if( !$articul ){
      return ['error' => 'Артикул не найден'];
    }

    $answer['id']     = $articul->getAttribute('id');
    $answer['number'] = $articul->getAttribute('number');

    $supplier = \common\models\PgSuppliers::findOne(['id' => $articul->getAttribute('supplier')]);
    $answer['supplier'] = $supplier->getAttribute('brand');

    $description = \common\models\PgDescription::findOne(['id' => $articul->getAttribute('description')]);
    $answer['description'] = $description->getAttribute('desc');

    $cross_articles = \common\models\PgArticle::find()->where(['part_id' => $answer['id']])->andWhere(['NOT IN','part_type', [2,5]])->asArray(true)->all();
    
    $answer['cross'] = [];
    foreach ($cross_articles as $cross){
      $cross_item = [
        'id'          => $cross['part_id'],
        'number'      => $cross['part_search_number'],
        'full_number' => ($cross['part_type'] == 1)?$cross['part_search_number']:$cross['part_full_number'],
        'type'        => $cross['part_type']
      ];
      if( $cross['part_type'] == 1){
        $cross_item['brand'] = $answer['supplier'];
      } else {
        $brand = \common\models\PgBrand::findOne(['id' => $cross['brand']]);
        $cross_item['brand'] = $brand->getAttribute('brand');
      }
      $answer['cross'][] = $cross_item;
    }
    
    return $answer;
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
