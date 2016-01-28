<?php

use yii\db\Schema;
use yii\db\Migration;

class m160128_075341_add_index_links_by_type_group extends Migration {

 public function up(){
   $this->down();
   $SQL = <<<SQL
      CREATE INDEX by_type_and_group ON "Links" USING btree(type_id, group_id);
SQL;
   $this->execute($SQL);
 }

 public function down() {
   $SQL = <<<SQL
       DROP INDEX IF EXISTS by_type_and_group;
SQL;
   $this->execute($SQL);
    return true;
 }
}
