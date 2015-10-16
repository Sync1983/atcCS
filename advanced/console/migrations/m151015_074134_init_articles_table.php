<?php

use yii\db\Schema;
use yii\db\Migration;

class m151015_074134_init_articles_table extends Migration {

 public function up(){
   return $this->createTable('Article', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'part_id'             => 'integer',
                  'part_search_number'  => 'varchar(50)',
                  'part_type'           => 'smallint',
                  'part_full_number'    => 'varchar(250)',
                  'brand'               => 'integer',

   ]);
 }

 public function down() {
     return $this->dropTable('Article');
 }
}
