<?php

use yii\db\Migration;

/**
 * Class m180214_085155_tbl_stock
 */
class m180214_085155_tbl_stock extends Migration{

 public function up(){
   $this->createTable('Stock', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  "articul"             => 'VARCHAR(100)',
                  "maker"               => 'VARCHAR(100)',
                  "name"                => 'VARCHAR(100)',
                  "count"               => 'INTEGER',
                  'crm_id'              => 'BIGSERIAL',
   ]);
 }

 public function down() {
     return $this->dropTable('Stock');
 }
}