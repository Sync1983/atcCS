<?php

/**
 * @author sync1983
 */
namespace backend\controllers\helper;
use yii\base\Action;

class GetMMTAction extends Action{

  public function run($params){
    $data     = json_decode($params,true);
    /* @var $db yii\db\Connection */
    $db       = \yii::$app->getDb();
    $path     = $data['path'];
    $pid      = isset($data['pid'])?$data['pid']:0;    

    if( !$path || ($path=="null") ){
      $path = "*{1}";
    } else {
      $path .= ".*{1}";
    }

    $SQL = <<<SQL

        SELECT
          s.path,
          s.name,
          subpath(s.path, -1) tid
        FROM "MMTTree" s        
        WHERE s.path ~ '$path'
        ORDER BY s.name;
SQL;

      $answer = [];

      $query  = $db->createCommand($SQL)->queryAll();      

      foreach ($query as $row){
        $answer[] = [
          'type'  => 'request',
          'url'   => "http://rest.atc58.bit/index.php?r=helper/get-mmt",
          'data'  => ['path'=>$row['path']],
          'text'  => $row['name']
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
