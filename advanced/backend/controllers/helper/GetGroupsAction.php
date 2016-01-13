<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class GetGroupsAction extends Action{

  public function run($params){
    $data     = json_decode($params,true);
    /* @var $db yii\db\Connection */
    $db       = \yii::$app->getDb();
    $path     = $data['path'];
    $pid      = isset($data['pid'])?$data['pid']:0;
    $answer   = [];

    if( !$path || ($path=="null") ){
      $path = "*{1}";
    } else {
      $path .= ".*{1}";
    }

    $SQL = <<<SQL

        SELECT
          s.id,
          s.type,
          s.path,
          d.desc,
          subpath(s.path, -1) pid
        FROM "SearchTree" s
        LEFT JOIN
          "Description" as d ON d.id = s.des_id
        WHERE s.path ~ '$path';
SQL;

      $answer = [];

      $query  = $db->createCommand($SQL)->queryAll();      

      foreach ($query as $row){        
        if( !$row['desc'] ){
          $row['desc'] = "Категория [" . $row['id'] . "]";
        }
        $answer[] = [
          'type'  => 'request',
          'url'   => "http://rest.atc58.bit/index.php?r=helper/get-groups",
          'data'  => ['path'=>$row['path'], 'pid' => $row['pid']],
          'text'  => $row['desc']
        ];        
      }

      if( count($answer) == 0 ){
        return $this->getGroupByPID($pid);
      }

    return $answer;
  }

  public function getGroupByPID($pid){
    $SQL = <<<SQL
        SELECT
          gi.id,
          ds.desc
        FROM "StrLookup" sl
        INNER JOIN
          "GroupInfo" gi ON sl.ga_id = gi.id
        INNER JOIN
          "Description" ds ON ds.id = gi.std_id
        WHERE str_id = '$pid';
SQL;

      $answer = [];
      $query  = \yii::$app->getDb()->createCommand($SQL)->queryAll();
      foreach ($query as $row){
        $answer[] = [
          'type'  => 'group',
          //'url'   => "http://rest.atc58.bit/index.php?r=helper/get-groups",
          'data'  => ['gid'=>$row['id']],
          'text'  => $row['desc']
        ];
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
