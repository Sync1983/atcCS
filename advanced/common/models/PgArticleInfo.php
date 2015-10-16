<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgArticleInfo extends ActiveRecord {

  public function attributes() {
    return [
      'id',
      'number',
      'supplier',
      'description',
      'type'
    ];
  }

  public function rules() {
    return [
      [['id','supplier','description'],'integer'],
      [['number'],'string','max'=>100],
      [['type'],'bitfield','params'=>[ 'length'=>4 ]],
      [['id','number','supplier','description','type'],'safe']
    ];
  }

  public function bitfield($attr,$param){
    $str = $this->$attr;
    $length = \yii\helpers\ArrayHelper::getValue($param, 'length',1);

    if( is_int($str) ){
      $str = decbin($str);
    }
    
    $str = str_pad($str, $length, "0", STR_PAD_LEFT);
    $str = preg_replace("/'/", "", $str);
    $str = substr($str, 0, $length);

    $this->$attr = new \yii\db\Expression("B'$str'");
    
  }

  public static function tableName() {
    return 'ArticleInfo';
  }

}
