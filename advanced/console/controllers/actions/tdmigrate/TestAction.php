<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class TestAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_MODELS m LEFT JOIN TOF_COUNTRY_DESIGNATIONS cd ON m.MOD_CDS_ID=cd.CDS_ID and cd.CDS_LNG_ID=16 LEFT JOIN TOF_DES_TEXTS dt ON dt.TEX_ID=cd.CDS_TEX_ID");
    
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){      
      print_r($row);      
    }
    /*echo "Collect all lang data\r\n";
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

    fclose($f);*/
    odbc_close($odbc);
  }
  
}
