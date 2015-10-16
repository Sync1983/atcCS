<?php

/**
 * @author sync1983
 */

namespace common\models;
use yii\db\ActiveRecord;

class PgArticle extends ActiveRecord {  

  public function attributes() {
    return [
      'id',
      'part_id',
      'part_search_number',
      'part_type',
      'part_full_number',
      'brand'
    ];
  }

  public function rules() {
    return [
      [['id','part_id','part_type','brand'],'integer'],
      [['part_search_number'],'string','max'=>50],
      [['part_full_number'],'string','max'=>250],
      [['id','part_id','part_search_number','part_type','part_full_number','brand'],'safe']
    ];
  }

  public static function tableName() {
    return 'Article';
  }

}
