<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class GetGroupsAction extends Action{

  public function run($params){
    $data     = json_decode($params,true);
    $articul  = false;
    $group    = false;
    $model    = true;
    $answer   = [];
    
    if( isset($data['group']) ){
      $articul  = true;
      $group    = true;
      $model    = false;
      unset($data['group']);
    }

    if( $model ){
      $types = \common\models\PgTypes::find()->where(['model_id' => $data])->select('type_id')->asArray(true)->all();
      $types_ids = [];
      foreach ($types as $row){
        $types_ids[] = $row['type_id'];
      }
      $groups = \common\models\PgLinks::find()
                  -> where(['type_id' => $types_ids])
                  -> select('group_id')
                  -> groupBy('group_id')
                  -> orderBy('group_id')
                  -> asArray(true)
                  -> all();

      $group_ids = [];
      foreach ($groups as $group){
        $group_ids[] = $group['group_id'];
      }
      
      $group_string = implode(",", $group_ids);

      $SQL = <<<SQL
          SELECT grp.id, ds.desc
          FROM "GroupInfo" as grp
          INNER JOIN "Description" as ds ON ds.id = grp.des_id
          WHERE grp.id IN ($group_string);
SQL;
      $descr = \yii::$app->getDb()->createCommand($SQL)->queryAll();
      $descrs = [];
      var_dump("stop");
      foreach ($descr as $row){
        $descrs[$row['id']] = $row['desc'];
      }
      foreach ($groups as $group){
        $answer[] = [
          'type'  => 'request',
          'url'   => \yii\helpers\Url::to(['helper/get-groups']),
          'data'  => ['group'=>1,$group['group_id']],
          'text'  => \yii\helpers\ArrayHelper::getValue($descrs, $group['group_id'],$group['group_id'])
        ];
      }
    }

    return $answer;
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
