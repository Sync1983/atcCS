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
    $filter   = isset($data['filter'])?$data['filter']:false;

    if ($filter){
      return $this->filter($filter);
    }

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

  public function filter($filter){
    $SQL = <<<SQL
        WITH items as (
          SELECT
            path
          FROM "MMTTree"
          WHERE
            path ~ '*{1,}'
            AND
            name like '$filter%'
        )
        SELECT
          DISTINCT mt.path as path,
          mt.name as name
          nlevel(mt.path) as level
        FROM items it
        INNER JOIN "MMTTree" mt ON  mt.path @> it.path
        ORDER BY level;
SQL;

    return [];
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
