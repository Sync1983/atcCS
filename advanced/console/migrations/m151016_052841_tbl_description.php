<?php

use yii\db\Schema;
use yii\db\Migration;

class m151016_052841_tbl_description extends Migration {

 public function up(){
   $this->createTable('Description', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'desc'                => 'text',
   ]);
   
   echo "Create text index on \"desc\"";
   $SQL = 'CREATE INDEX by_desc_text ON "Description" ("desc" text_pattern_ops);';
   $this->db->createCommand($SQL)->execute();   
 }

 public function down() {
     return $this->dropTable('Description');
 }
}
