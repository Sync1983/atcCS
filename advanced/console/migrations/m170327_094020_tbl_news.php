<?php

use yii\db\Migration;

class m170327_094020_tbl_news extends Migration {

 public function up(){
   $this->createTable('News', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'date'                => 'datetime',
                  'title'               => 'VARCHAR(120)',
                  "url"                 => 'VARCHAR(250)',
                  "full_text"           => 'TEXT',
                  "show"                => 'BOOLEAN'
   ]);
 }

 public function down() {
     return $this->dropTable('News');
 }
}
