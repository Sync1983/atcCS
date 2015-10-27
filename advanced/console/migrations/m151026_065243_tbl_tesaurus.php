<?php

use yii\db\Schema;
use yii\db\Migration;

class m151026_065243_tbl_tesaurus extends Migration {

 public function up(){
   $this->createTable('Tesaurus', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'text'                => 'varchar(100)',
                  'ids'                 => 'integer(11)[]',
   ]);

   echo "Create text index on \"text\"\r\n";
   $SQL = 'CREATE INDEX ts_by_text ON "Tesaurus" ("text" text_pattern_ops);';
   $this->db->createCommand($SQL)->execute();
 }

 public function down() {
     return $this->dropTable('Tesaurus');
 }
}
