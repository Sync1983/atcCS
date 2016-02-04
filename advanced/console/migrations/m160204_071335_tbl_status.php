<?php

use yii\db\Schema;
use yii\db\Migration;

class m160204_071335_tbl_status extends Migration{

 public function up(){
   $this->createTable('Status', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'part_id'             => 'BIGSERIAL REFERENCES "Basket"(id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE',
                  'status'              => 'INTEGER',
                  'time'                => 'INTEGER'
   ]);
 }

 public function down() {
     return $this->dropTable('Status');
 }
}
