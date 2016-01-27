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
    $path     = isset($data['path'])?$data['path']:false;
    $filter   = isset($data['filter'])?$data['filter']:false;

    if ($filter && !$path){
      return $this->filter($filter);
    }

    if( !$path ){
      $path = "*{1}";
    } else {
      $path .= ".*{1}";
    }


    $SQL = <<<SQL
        SELECT
          s.path,
          s.name,
          nlevel(s.path) as level,
          subpath(s.path, -1) tid
        FROM "MMTTree" s        
        WHERE s.path ~ '$path'
        ORDER BY s.name;
SQL;

      $answer = [];

      $query  = $db->createCommand($SQL)->queryAll();      

      foreach ($query as $row){
        $level    =  $row['level'];
        $answer[] = [
          'type'  => ($level<4)?'request':'node',
          'url'   => "http://rest.atc58.bit/index.php?r=helper/get-mmt",
          'data'  => ($level<4)?['path'=>$row['path']]:$row['tid'],
          'text'  => $row['name']
        ];        
      }

    return $answer;
  }

  public function filter($filter){
     /* @var $db yii\db\Connection */
    $db       = \yii::$app->getDb();
    $filter   = strtoupper( strval($filter) );

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
          mt.name as name,
          nlevel(mt.path) as level,
          subpath(mt.path,-1) as id
        FROM items it
        INNER JOIN "MMTTree" mt ON  mt.path @> it.path
        ORDER BY level;
SQL;

    $query  = $db->createCommand($SQL)->queryAll();
    
    $answer = ['isRoot'=>true];
    foreach ($query as $row){
      $level = $row['level'];
      $name  = $row['name'];
      $path  = $row['path'];
      $id    = $row['id'];

      $item_data = [
          'path'  => $path,
          'open'  => ($level==1)?true:false,
          'type'  => ($level<4)?'request':'node car',
          'url'   => "http://rest.atc58.bit/index.php?r=helper/get-mmt",
          'data'  => ($level<4)?['path'=>$row['path']]:$id,
          'text'  => $name
        ];      
      $this->insertByPath($item_data, $answer);
    }

    return $answer;
  }

  protected function insertByPath($data, &$array){
    $path = explode('.', $data['path']);
    array_pop($path);
    $root     = implode('.', $path);    
    
    if( !$root ){
      $array[] = $data;
    }

    foreach ($array as &$row){
      if( !is_array($row)){
        continue;
      }

      if( $row['path'] == $root ){        
        if( !isset($row['subItems']) ){
          $row['subItems'] = [];          
        }
        $row['subItems'][] = $data;
        continue;
      }

      if( isset($row['subItems']) ){
        $this->insertByPath($data, $row['subItems']);
      }
    }

    return true;
  }

  public function beforeRun() {
    $method = \yii::$app->request->getMethod();
    if( $method === "OPTIONS" ){
      return FALSE;
    }
    return parent::beforeRun();
  }
  
}
