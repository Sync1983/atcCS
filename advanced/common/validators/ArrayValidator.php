<?php

/**
 * @author sync1983
 */
namespace common\validators;
use yii\validators\Validator;

class ArrayValidator extends Validator{
  public $length = 1;
  public $rule  = '';

  public function validateAttribute($model, $attr) {
    $array = $model->$attr;
    if( !is_array($array) ){
      $array = [$array];
    }

    foreach ($array as $key=>$value){
      if( !is_int($value) ){
        unset($array[$key]);
        continue;
      }
      $array[$key] = $value * 1;
    }

    $model->$attr = new \yii\db\Expression("'{" . implode(",", $array) . "}'");
    return ;
  }
}
