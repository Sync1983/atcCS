<?php

/**
 * @author Sync
 */
namespace console\controllers\actions\tdmigrate;

use yii\base\Action;

class TdMigrateAction extends Action{

  protected function connect(){
    $dsn  = " DSN=TECDOC_CD_1_2015;Database=TECDOC_CD_1_2015;Server=localhost;Port=;UID=tecdoc;PWD=tcd_error_0;Client_CSet=UTF-8;";
    $odbc = odbc_connect($dsn,'','');
    if( !$odbc ){
      echo "Error connect\r\n";
      throw new \yii\base\ErrorException("ODBC Error: " . odbc_errormsg());
    }
    return $odbc;
  }

  protected function openFileToWrite(){
    $path   = \yii::getAlias("@migrate_data_dir");
    $file   = "tbl_" . $this->id . ".csv";
    echo "Open File $path/$file\r\n";
    return fopen($path . "/" . $file, "w+");
  }
}
