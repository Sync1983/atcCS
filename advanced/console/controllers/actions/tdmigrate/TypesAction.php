<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class TypesAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();

    $f      = $this->openFileToWrite();
    $data   = odbc_exec($odbc, "SELECT * FROM TOF_TYPES tp INNER JOIN TOF_COUNTRY_DESIGNATIONS cds ON cds.CDS_ID=tp.TYP_MMT_CDS_ID  and cds.CDS_LNG_ID=16 LEFT JOIN TOF_DES_TEXTS dt ON dt.TEX_ID=cds.CDS_TEX_ID");
    $str    = 'type_id'          . "," .
              'model_id'  . "," .
              'kw'        . "," .
              'hp'        . "," .
              'volume'              . "," .
              'cylinders'           . "," .
              'valves'              . "," .
              'cylinders'           .
              "\r";
    fputs($f, $str, strlen($str));
    $pos = 0;
    while( $row = odbc_fetch_array($data) ){
      $start = $row['TYP_PCON_START'];
      $end   = $row['TYP_PCON_END'];
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

      $row['TEX_TEXT'] = mb_convert_encoding($row['TEX_TEXT'],'UTF-8','CP-1251');

      $str = $row['TYP_ID']         . "," .
             $row['TYP_MOD_ID']     . "," .
             $row['TYP_KW_FROM']    . "," .
             $row['TYP_HP_FROM']    . "," .
             $row['TYP_LITRES']*1000 . "," .
             $row['TYP_CYLINDERS']  . "," .
             $row['TYP_VALVES']     . "," .
             "\"" . $row['TEX_TEXT']     . "\"," .
             $row['TYP_KV_FUEL_DES_ID'] . "," .
             $row['TYP_KV_DRIVE_DES_ID']. "," .
             $row['TYP_KV_STEERING_SIDE_DES_ID'] . "," .
             $start             . "," .
             $end               .
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
