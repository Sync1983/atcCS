<?php

/**
 * @author Sync
 */

namespace console\controllers\actions\tdmigrate;
use console\controllers\actions\tdmigrate\TdMigrateAction;

class ShowTablesAction extends TdMigrateAction {

  public function run() {
    $odbc = $this->connect();
    $tables = odbc_tables($odbc);
    while ( odbc_fetch_row($tables) ){
      echo odbc_result($tables, "TABLE_NAME") . "\r\n";
    }
    odbc_close($odbc);
  }
  
}
