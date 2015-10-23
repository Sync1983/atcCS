<?php

use yii\db\Schema;
use yii\db\Migration;

class m151022_120953_db_function_dem_lev_distance extends Migration {

    public function up() {
      $SQL = <<<SQL
CREATE OR REPLACE  FUNCTION dem_lev_distance ( a text, b text )RETURNS integer AS
'utils', 'dem_lev_distance'
LANGUAGE C STRICT VOLATILE COST 100;;
SQL;

      $this->execute($SQL);
      
    }

    public function down() {
      $SQL = "DROP FUNCTION dem_lev_distance ( a text, b text )";
      return $this->execute($SQL);
    }
    
}
