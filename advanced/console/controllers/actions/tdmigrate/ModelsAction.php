<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class ModelsAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_MODELS m LEFT JOIN TOF_COUNTRY_DESIGNATIONS cd ON m.MOD_CDS_ID=cd.CDS_ID and cd.CDS_LNG_ID=16");
    $str    = 'model_id'          . "," .
              'manufacturers_id'  . "," .
              'start'             . "," .
              'end'               . "," .
              'type'              . "," .
              'text_id'           .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $start = $row['MOD_PCON_START'];
      $end   = $row['MOD_PCON_END'];
      if( $start == 0 ){
        $start  = "197701";
      }
      if( $end == 0){
        $end    = "201512";
      }

      $start_y  = substr($start, 0, 4);
      $start_m  = substr($start, 4, 2);
      $start    = "01-$start_m-$start_y";

      $end_y    = substr($end, 0, 4);
      $end_m    = substr($end, 4, 2);
      $end      = "01-$end_m-$end_y";
      $end_time = new \DateTime($end);
      $end      = $end_time->format("t-m-Y");

      $str = $row['MOD_ID']     . "," .
             $row['MOD_MFA_ID'] . "," .
             $row['MOD_MFA_ID'] . "," .
             $start             . "," .
             $end               . "," .
             "B('" . $row['MOD_PC'] . $row['MOD_CV'] . $row['MOD_AXL'] . "')" . "," .
             $row['CDS_TEX_ID'] .
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
