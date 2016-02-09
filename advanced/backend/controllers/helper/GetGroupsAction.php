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
    $path     = isset($data['path'])?$data['path']:false;
    $filter   = isset($data['filter'])?$data['filter']:false;
    $pid      = isset($data['pid'])?$data['pid']:0;
    $answer   = [];
    
    if ( (!$path) && $filter ){
      return $this->getByFilter($filter,$path);
    }

    if( $path && $filter ){
      return $this->getByPathAndFilter($path, $filter);
    }

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
          'url'   => \yii\helpers\Url::to(['helper/get-groups'], true),
          'data'  => ['path'=>$row['path'], 'pid' => $row['pid']],
          'text'  => $row['desc']
        ];        
      }

      if( count($answer) == 0 ){
        return $this->getGroupByPID($pid);
      }

    return $answer;
  }

  public function getByPathAndFilter($path, $filter){
    $spath    = explode('.', $path);
    $path_id  = array_pop($spath);
    $filter   = intval($filter);
    
    $SQL = <<<SQL
      SELECT
        ln.articul_id as art_id,
        at.number as articul,
        ds.desc as name,
        sp.brand as supplier
      FROM "StrLookup" sl
      INNER JOIN "Links" ln
        ON ln.group_id=sl.ga_id AND ln.type_id=$filter
      INNER JOIN "ArticleInfo" at
        ON at.id = ln.articul_id
      LEFT JOIN "Description" ds
        ON ds.id=at.description
      LEFT JOIN "Supplier" sp
        ON sp.id=at.supplier
      WHERE str_id=$path_id
      ORDER BY at.number;
SQL;
    $query  = \yii::$app->getDb()->createCommand($SQL)->queryAll();
    $answer = [];
    foreach ($query as $row){
      $articul_id = $row['art_id'];
      $articul    = $row['articul'];
      $name       = $row['name'];
      $supplier   = $row['supplier'];

      $answer[] = [
          'type'  => 'node',
          //'url'   => "http://rest.atc58.bit/index.php?r=helper/get-groups",
          'data'  => ['aid' => $articul_id, 'number'=>$articul],
          'text'  => "<div class=\"search-btn\"></div><div class=\"info-btn\"></div><span class=\"item\"><b>$articul</b> <i>$supplier</i> [$name]</span>",
          'title' => "Артикул: $articul Производитель: $supplier Название: $name"
        ];
    }
    
    return $answer;
  }

  public function getByFilter($filter){
    $filter = intval($filter);
    
    $SQL = <<<SQL
      WITH path_id AS (
        SELECT
          DISTINCT group_id, 
          sl.str_id::text as str_id
        FROM "Links" ln
        INNER JOIN "StrLookup" sl
          ON sl.ga_id = ln.group_id
        WHERE type_id=$filter
        ORDER BY group_id )
        
        SELECT
          DISTINCT st1.path as path,
          ds.desc as desc,
          nlevel(st1.path) as level
        FROM path_id
        INNER JOIN "SearchTree" st
          ON st.path ~ ('*.' || str_id || '.*')::lquery
        INNER JOIN "SearchTree" st1
          ON st1.path @> st.path
        INNER JOIN "Description" ds
          ON ds.id = st1.des_id
        ORDER BY level ;
SQL;
    $query  = \yii::$app->getDb()->createCommand($SQL)->queryAll();
    $answer = [];
    foreach ($query as $row){
      $path   = $row['path'];
      $desc   = $row['desc'];
      $level  = $row['level'];
      
      $item_data = [
        'path'  => $path,
        'open'  => ($level==1)?true:false,
        'type'  => 'request',
        'url'   => \yii\helpers\Url::to(['helper/get-groups'], true),
        'data'  => ['path'=>$row['path']],
        'text'  => $desc
      ];
      $this->insertByPath($item_data, $answer);
    }
    $answer['isRoot'] = true;
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
          'type'  => 'node',
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
