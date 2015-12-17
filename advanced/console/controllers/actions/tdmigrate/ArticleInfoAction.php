<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class ArticleInfoAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_ARTICLES");
    $str    = 'art_id'      . "," .
              'number'      . "," .
              'supplier'    . "," .
              'description' . "," .
              'type'        .
             "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['ART_ID']             . "," .
             $row['ART_ARTICLE_NR']     . "," .
             $row['ART_SUP_ID']         . "," .
             $row['ART_COMPLETE_DES_ID']. "," .
             "B('" . $row['ART_PACK_SELFSERVICE'] . $row['ART_MATERIAL_MARK'] . $row['ART_REPLACEMENT'] . $row['ART_ACCESSORY'] . "')".
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
