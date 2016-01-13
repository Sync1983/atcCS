<?php

use yii\db\Schema;
use yii\db\Migration;

class m151222_124723_tbl_search_tree extends Migration {

 public function up(){
   $this->createTable('SearchTree', [
                  'id'        => 'BIGSERIAL PRIMARY KEY',
                  'type'      => 'BIGSERIAL',
                  'des_id'    => 'BIGSERIAL',
                  'path'      => 'LTREE'
   ]);

 }

 public function down() {
     return $this->dropTable('SearchTree');
 }
}
