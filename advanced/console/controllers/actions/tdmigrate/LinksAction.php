<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class LinksAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $f      = $this->openFileToWrite();

    $data   = odbc_exec($odbc, "SELECT * FROM TOF_LINK_LA_TYP" );
    $str    = 'type_id'           . "," .
              'group_id'          . "," .
              'supplier_id'       . "," .
              'articul_id'        .
              "\r";
    fputs($f, $str, strlen($str));

    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $type         = $row['LAT_TYP_ID'];
      $articles_id  = $row['LAT_LA_ID'];
      $group_id     = $row['LAT_GA_ID'];
      $supp_id      = $row['LAT_SUP_ID'];
      $str          = $type     . "," .
                      $group_id . "," .
                      $supp_id  . "," .
                      $articles_id .
                      "\r";

      fputs($f, $str, strlen($str));
      if( ($pos++ % 1000) == 0 ){
        echo "Write $pos lines \r\n";
      }
    }
    odbc_close($odbc);

    fclose($f);
  }
  
}
