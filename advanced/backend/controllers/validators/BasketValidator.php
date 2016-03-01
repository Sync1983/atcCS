<?php

/**
 * @author Sync
 */
namespace backend\controllers\validators;
use yii\validators\Validator;

class BasketValidator extends Validator {

  public $skipOnEmpty = false;
  public $skipOnError = false;


  public function validateAttribute($model, $attribute) {
    if( \yii::$app->user->isGuest ){
      $this->addError($model, $attribute, "Работа с корзиной доступна только авторизированым пользователям");
    }

    $uid = \yii::$app->user->getId();

    $active_basket = $model->getDb()->createCommand("SELECT get_active_basket($uid) as basket_id")->queryOne();
    
    if( !$active_basket ){
      $this->addError($model, $attribute, "Ошибка целостности данных активной корзины. Попробуйте сменить корзину для работы");
    }
    
    $model->setAttribute($attribute, intval($active_basket['basket_id']));
    return true;
  }
  
}
