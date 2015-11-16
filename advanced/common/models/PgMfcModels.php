<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgMfcModels extends ActiveRecord{

  public function attributes() {
    return ['mfc_id','model','mfc_txt','model_txt'];
  }

  public function rules() {
    return [
      [['mfc_id','model'],'integer'],
      [['brand'],'string','max'=>100],
      [['model_txt'],'string'],
      [['mfc_id','model','mfc_txt','model_txt'],'safe']
    ];
  }

  public static function tableName() {
    return 'MFC-Models';
  }
  /**
   * Возвращает запрос с фильтрацией $field IN $filter
   * @param mixed  $select Массив выбираемых полей
   * @param string $field  Поле по которому проходит фильтрация
   * @param mixed  $filter Массив значений $field
   * @return \yii\db\Query
   */
  public function findByFilter($select = [], $field = '', $filter = []){
    
    if( $filter && count($filter) ){
      return $this->find()->select($select)->where([$field => $filter]);
    }

    return $this->find()->select($select);
  }
}
