<?php

use yii\db\Schema;
use yii\db\Migration;

class m151021_145531_tbl_link extends Migration{

 public function up(){
   $this->createTable('Links', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'type_id'             => 'INTEGER',
                  'group_id'            => 'INTEGER',
                  'supplier_id'         => 'INTEGER',
                  'articul_id'          => 'INTEGER',
   ]);
 }

 public function down() {
     return $this->dropTable('Links');
 }
}
