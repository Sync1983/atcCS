<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class GenArtAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $f      = $this->openFileToWrite();

    $data   = odbc_exec($odbc, "SELECT * FROM TOF_GENERIC_ARTICLES");

    $str    = 'gr_id'       . "," .
              'des_id'      . "," .
              'des_std_id'  . "," .
              'des_asm_id'  . "," .
              'des_prt_id'  .
             "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['GA_ID']              . "," .
             $row['GA_DES_ID']          . "," .
             $row['GA_DES_ID_STANDARD'] . "," .
             $row['GA_DES_ID_ASSEMBLY'] . "," .
             $row['GA_DES_ID_INTENDED'] .
             "\r";
      fputs($f, $str, strlen($str));
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }
  
}
