<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class ArticleAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_ART_LOOKUP");

    $str    = 'part_id'             . "," .
              'part_search_number'  . "," .
              'part_type'           . "," .
              'part_full_number'    . "," .
              'brand'               .
             "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['ARL_ART_ID']         . "," .
             $row['ARL_SEARCH_NUMBER']  . "," .
             $row['ARL_KIND']           . "," .
             $row['ARL_DISPLAY_NR']     . "," .
             $row['ARL_BRA_ID']         .
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }
  
}
