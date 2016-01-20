<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class TextsAction extends TdMigrateAction {

  public function run() {
    $odbc   = $this->connect();
    $f      = $this->openFileToWrite();

    $data   = odbc_exec($odbc, "SELECT * FROM TOF_TEXT_MODULES tm LEFT JOIN TOF_TEXT_MODULE_TEXTS tt ON tt.TMT_ID = tm.TMO_TMT_ID WHERE TMO_LNG_ID = 16 OR TMO_LNG_ID = 255");

    $str    = 'text_id' . "," .
              'text'    .
              "\r";
    fputs($f, $str, strlen($str));

    $pos      = 0;
    $lng_rus  = [];
    $lng_all  = [];
    $ids      = [];
    
    while( $row = odbc_fetch_array($data) ){
      $id     = $row['TMO_ID'];
      $text   = $row['TMT_TEXT'];
      $lng_id = $row['TMO_LNG_ID'];
      
      $text   = mb_convert_encoding($text,'UTF-8','byte2le');
      $text   = str_replace(["\0","\r","\n","\t"], "", $text);
      $text   = str_replace(["\""], "'", $text);
      $text   = str_replace(["@"], "(c)", $text);

      if( $lng_id == 16 ){
        $lng_rus[$id] = $text;
      } else {
        $lng_all[$id] = $text;
      }

      $ids[$id] = $id;
      
      if( ($pos++ % 100000) == 0 ){
        echo "Load $pos lines \r\n";
      }
    }
    odbc_close($odbc);

    sort($ids);

    foreach ($ids as $id){
      if( isset($lng_rus[$id]) ){
        $str = $id . "@" . $lng_rus[$id] . "\r";
      } else {
        $str = $id . "@" . $lng_all[$id] . "\r";
      }
      fputs($f, $str, strlen($str));
    }

    fclose($f);    
  }
  
}
