<?php

/**
 * @author Sync
 */
namespace backend\controllers\C1;
use yii\base\Action;

class GetBasketAction extends Action{

  public function run($params){
    $basket = \backend\models\parts\PartsBasketModel::find()->asArray()->all();    
  }
}
