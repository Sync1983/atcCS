<?php

/**
 * @author Sync
 */
namespace backend\models\news;

class NewsItemModel extends \yii\db\ActiveRecord{

  public function attributes(){
    return [
      'id','date','title','image','full_text','show','url'];
  }

  public function rules(){
    return [
      [['id'],'integer'],
      [['date'],'datetime'],
      [['url'],'url'],
      [['title',"full_text"],'string'],
      [["show"],'boolean'],
    ];
  }

  public static function tableName() {
    return 'News';
  }
  
}
