<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class BrandsAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_BRANDS");
    $str    = 'bra_id'  . "," .
              'brand'   .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['BRA_ID']   . "," .
             $row['BRA_BRAND'].
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
