<?php

/**
 * @author Sync
 */
namespace backend\controllers\validators;
use yii\validators\Validator;

class DateValidator extends Validator {

  public $skipOnEmpty = false;
  public $skipOnError = false;


  public function validateAttribute($model, $attribute) {    
    $model->setAttribute($attribute, strftime("%Y-%m-%d %H:%M:%S",time()));
    return true;
  }
  
}
