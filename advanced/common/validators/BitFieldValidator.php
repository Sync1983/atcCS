<?php

/**
 * @author sync1983
 */
namespace common\validators;
use yii\validators\Validator;

class BitFieldValidator extends Validator{
  public $length = 1;

  public function validateAttribute($model, $attr) {
    $str = $model->$attr;

    if( is_int($str) ){
      $str = decbin($str);
    }

    $str = str_pad($str, $this->length, "0", STR_PAD_LEFT);
    $str = preg_replace("/'/", "", $str);
    $str = substr($str, 0, $this->length);

    $model->$attr = new \yii\db\Expression("B'$str'");
    return ;
  }
}
