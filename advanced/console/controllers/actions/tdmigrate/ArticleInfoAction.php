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
    $str    = 'part_id'      . "," .
              'number'      . "," .
              'supplier'    . "," .
              'description' . "," .
              'type'        .
             "\n";
    fputs($f, $str, strlen($str));
    $pos = 0;
    $str = "";
    while( $row = odbc_fetch_array($data) ){
      $str.= $row['ART_ID']                         . "," .
             "'" . $row['ART_ARTICLE_NR']           . "'," .
             $row['ART_SUP_ID']                     . "," .
             $row['ART_COMPLETE_DES_ID']            . "," .
             ($row['ART_PACK_SELFSERVICE']?"1":"0") .
             ($row['ART_MATERIAL_MARK']?"1":"0"   ) .
             ($row['ART_REPLACEMENT']?"1":"0"     ) .
             ($row['ART_ACCESSORY']?"1":"0"       ) .
             "\n";
      $pos++;
      if( ($pos % 10000) == 0) {
        fputs($f, $str, strlen($str));
        $str = "";
        echo "Save $pos Lines\r\n";
      }
    }
    fclose($f);
    odbc_close($odbc);
  }
  
}
