<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class SuppliersAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_SUPPLIERS");
    $str    = 'sup_id'  . "," .
              'brand'   .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['SUP_ID']   . "," .
             $row['SUP_BRAND'].
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 100) == 0) {
        echo "Save $pos Lines FROM $num\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }
  
}
