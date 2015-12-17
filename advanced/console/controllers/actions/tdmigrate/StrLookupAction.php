<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class StrLookupAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_STR_LOOKUP where STL_LNG_ID = 16 OR STL_LNG_ID=255 ORDER BY STL_STR_ID");

    $str    = 'ga_id' . "," .
              'str_id'. "," .
              'text'  .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $text = $row['STL_SEARCH_TEXT'];      
      $text = mb_convert_encoding($text, "UTF-8","WINDOWS-1251");
      $str = $row['STL_GA_ID']        . "," .
             $row['STL_STR_ID']       . "," .
             $text  .
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;      
      if( ($pos % 1000) == 0) {
        echo "Save $pos Lines \r\n";
      }
    }
    fclose($f);
    
    odbc_close($odbc);
  }
  
}
