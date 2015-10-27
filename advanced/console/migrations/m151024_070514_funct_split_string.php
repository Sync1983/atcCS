<?php

use yii\db\Schema;
use yii\db\Migration;

class m151024_070514_funct_split_string extends Migration {

    public function up() {
      /*$SQL = <<<SQL
CREATE OR REPLACE  FUNCTION string_split ( str text, data integer ) RETURNS integer AS
'utils', 'string_split'
LANGUAGE C STRICT VOLATILE COST 100;;
SQL;

      $this->execute($SQL);*/
      return true;

    }

    public function down() {
      /*$SQL = "DROP FUNCTION string_split ( str text, data integer )";
      return $this->execute($SQL);*/
      return true;
    }

}
