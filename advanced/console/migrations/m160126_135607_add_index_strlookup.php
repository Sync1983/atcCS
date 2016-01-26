<?php

use yii\db\Schema;
use yii\db\Migration;

class m160126_135607_add_index_strlookup extends Migration {

 public function up(){
   $this->down();
   $SQL = <<<SQL
      CREATE INDEX by_str_id ON "StrLookup" USING btree(str_id);
SQL;
   $this->execute($SQL);
 }

 public function down() {
   $SQL = <<<SQL
       DROP INDEX IF EXISTS by_str_id;
SQL;
   $this->execute($SQL);
    return true;
 }
}
