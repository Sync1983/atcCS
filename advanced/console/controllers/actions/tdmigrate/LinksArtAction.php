<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class LinksArtAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $f      = $this->openFileToWrite();

    $data   = odbc_exec($odbc, "SELECT * FROM TOF_LINK_ART" );
    $str    = 'LA_ID'           . "," .
              'LA_ART_ID'       .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    $str = "";
    while( $row = odbc_fetch_array($data) ){
      $article      = $row['LA_ART_ID'];
      $id           = $row['LA_ID'];

      $str         .= $id. "," .
                      $article .
                      "\r";
      if( ($pos++ % 1500) == 0 ){
        fputs($f, $str, strlen($str));
        echo "Write $pos lines \r\n";
        $str = "";
      }
    }
    odbc_close($odbc);

    fclose($f);
  }
  
}
