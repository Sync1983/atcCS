<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class GraphicsDataAction extends TdMigrateAction {

  public function run() {
    $odbc   = $this->connect();
    $path   = \yii::getAlias("@migrate_data_dir") . "/graphics";
    if( !file_exists($path) ){
      mkdir($path);
    }
    
    $gra_tbl = 33;
    do{
      $data   = odbc_exec($odbc, "SELECT * FROM TOF_GRA_DATA_$gra_tbl");
      odbc_longreadlen($data, 1064000000);
      odbc_binmode($data, ODBC_BINMODE_RETURN);
      while( $row = odbc_fetch_array($data) ){      
          $row = odbc_fetch_array($data);
        $id     = $row['GRD_ID'];
        $graph  = $row['GRD_GRAPHIC'];
        $name   = $id . "_" . $gra_tbl . ".tmp";
        echo "File name: $name\r\n";
        file_put_contents($path . "/" . $name, $graph);
      }
    }while ($gra_tbl++<1);    
    
    odbc_close($odbc);
  }
  
}
