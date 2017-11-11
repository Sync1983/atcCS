<?php

/**
 * @author Sync
 */
namespace backend\controllers\news;
use yii\base\Action;
use backend\models\news\NewsItemModel;

class GetDataAction extends Action{
  
  public function run($params){    
    $data = json_decode($params, true);
    $full = (integer) (isset($data['full'])?$data['full']:0);
    $page = (integer) (isset($data['page'])?$data['page']:0);

    $count = 20;
    $start = $page * $count;

    $SQL = "SELECT * FROM \"News\" ORDER BY date LIMIT $count OFFSET $start";
    $items = NewsItemModel::findBySql($SQL)->all();
    $pages = round(NewsItemModel::find()->count() / $count) + 1;

    return ['data'=>$items,
            'page'=>$page,
            'pages'=>$pages];

  }
  
}
