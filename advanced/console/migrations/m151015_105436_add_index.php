<?php

use yii\db\Schema;
use yii\db\Migration;

class m151015_105436_add_index extends Migration {

 public function up(){
   $this->createIndex('by_part_id', "Article", 'part_id');
   
   echo "Create text index on \"part_search_number\"";
   $SQL = 'CREATE INDEX by_part_sn ON "Article" ("part_search_number" text_pattern_ops);';
   $this->db->createCommand($SQL)->execute();

   $this->createIndex('by_part_type', "Article", 'part_type');
   //$this->createIndex('by_part_sn_type', "Article", ['part_search_number text_pattern_ops','part_type']);
   /*
    * 'id'                  => 'BIGSERIAL PRIMARY KEY',
    * 'part_id'             => 'integer',
    * 'part_search_number'  => 'varchar(50)',
    * 'part_type'           => 'smallint',
    * 'part_full_number'    => 'varchar(250)',
    * 'brand'               => 'integer',
    *
    */
   return true;
 }

 public function down() {
     $this->dropIndex('by_part_id', 'Article');
     $this->dropIndex('by_part_sn','Article');
     $this->dropIndex('by_part_type', 'Article');
     //$this->dropIndex('by_part_sn_type','Article');
     return true;
 }
}
