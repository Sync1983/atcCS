<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class SearchTreeAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_SEARCH_TREE");

    $str    = 'type'  . "," .
              'des_id'. "," .
              'path'  .
              "\r";
    fputs($f, $str, strlen($str));
    
    $pos = 0;
    $tree = [];
    $max_level = 0;
    while( $row = odbc_fetch_array($data) ){
      $id         = $row['STR_ID'];
      $parent_id  = $row['STR_ID_PARENT'];
      $type       = $row['STR_TYPE'];
      $level      = $row['STR_LEVEL'];
      $descr      = $row['STR_DES_ID'];
      $tree[$id]  = [        
        'parent' => $parent_id,
        'type'   => $type,
        'level'  => $level,
        'descr'  => $descr,
        'child'  => []
      ];

      if( $level > $max_level ){
        $max_level = $level;
      }
      
      $pos++;      
    }
    echo "Data loaded! Lines: $pos. Max level: $max_level\r\n";

    do {
      Echo "check level $max_level\r\n";
      $cnt = 0;
      foreach ($tree as $key=>$value){

        if( !is_array($value) ||
            !isset($value['level']) || 
            !isset($value['parent']) ||
            !$value['parent'] ||
            ($value['level'] != $max_level) ){
          continue;
        }
        $cnt++;
        $parent = $value['parent'];
        if( !isset($tree[$parent]) ){
          echo "Undefined parent id: $parent \r\n";
        }

        $tree[$parent]['child'][$key] = $value;
        unset($tree[$key]);//['level'] = -1;
      }
      echo "check count: $cnt\r\n";
    } while( $max_level-- > 0 );


    $this->saveFile($f, $tree, false);

    fclose($f);
    odbc_close($odbc);
  }

  protected function saveFile($f,$tree, $path){
    foreach ($tree as $key=>$value){
      if( !is_array($value) ){
        continue;
      }
      if( !$path ){
        $path_str = $key;
      } else {
        $path_str = $path . "." .$key;
      }

      $str =  $value['type']  . "," .
              $value['descr'] . "," .
              $path_str       .
              "\r";
      fputs($f, $str, strlen($str));
      if(count($value['child']) ){
        $this->saveFile($f, $value['child'], $path_str);
      }
    }
  }
  
}
