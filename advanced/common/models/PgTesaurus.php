<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgTesaurus extends ActiveRecord{

  /**
   * После полуения данных array возвращается как строка
   * Необходимо преобразовать её к массиву, для избежания ошибок
   *   при перезаписи и доступе
   */
  public function afterFind() {
    $text_ids = $this->ids;
    $text_ids = str_replace("{", "", $text_ids);
    $text_ids = str_replace("}", "", $text_ids);
    $ids = explode(",", $text_ids);
    $this->ids = $ids;
    parent::afterFind();
  }

  public function attributes() {
    return ['id','text','ids'];
  }

  public function rules() {
    return [
      ['id','integer'],
      ['text','string'],
      ['ids', \common\validators\ArrayValidator::className()],
      [['id','text','ids'],'safe']
    ];
  }

  public static function tableName() {
    return 'Tesaurus';
  }
}
