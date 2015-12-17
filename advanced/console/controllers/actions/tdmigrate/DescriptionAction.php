<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class DescriptionAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    odbc_exec($odbc, "SET NAMES 'UTF8'");
    odbc_exec($odbc, "SET client_encoding='UTF-8'");
    $data   = odbc_exec($odbc, "SELECT des.DES_ID as DES_ID, txt.TEX_TEXT as TEXT FROM TOF_DESIGNATIONS des INNER JOIN TOF_DES_TEXTS txt ON txt.TEX_ID = des.DES_TEX_ID where des.DES_LNG_ID=16");
    $str    = 'des_id'  . "\t" .
              'descr'   .
              "\r";
    fputs($f, $str, strlen($str));
    $texts = [];
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $str = $row['DES_ID']   . "\t" .
             $row['TEXT']     .
             "\r";
      $texts[$row['DES_ID']] = $str;
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines\r\n";
      }
    }
    echo "Collect all lang data\r\n";
    $data_255  = odbc_exec($odbc, "SELECT des.DES_ID as DES_ID, txt.TEX_TEXT as TEXT FROM TOF_DESIGNATIONS des INNER JOIN TOF_DES_TEXTS txt ON txt.TEX_ID = des.DES_TEX_ID where des.DES_LNG_ID=255");
    $pos = 0;
    while( $row = odbc_fetch_array($data_255) ){
      $str = $row['DES_ID']   . "\t" .
             $row['TEXT']     .
             "\r";
      if( !isset($texts[$row['DES_ID']]) ){
        $texts[$row['DES_ID']] = $str;
      }
      $pos++;
      if( ($pos % 10000) == 0) {
        echo "Save $pos Lines FROM\r\n";
      }
    }

    ksort($texts);

    foreach ($texts as $text){
      $text = mb_convert_encoding($text,'UTF-8','windows-1251');
      fputs($f, $text, strlen($text));
    }

    fclose($f);
    odbc_close($odbc);
  }
  
}
