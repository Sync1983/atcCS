<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class ManufacturersAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_MANUFACTURERS");
    $str    = 'id'    . "," .
              'brand' . "," .
              'type'  .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $row['MFA_BRAND'] = mb_convert_encoding($row['MFA_BRAND'], 'UTF-8', 'windows-1251');
      $str = $row['MFA_ID']   . "," .
             $row['MFA_BRAND']. "," .
             "B('" . $row['MFA_PC_MFC'] . $row['MFA_CV_MFC'] . $row['MFA_AXL_MFC'] . $row['MFA_ENG_MFC'] . "')" .
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
