<?php

use yii\db\Schema;
use yii\db\Migration;

class m151015_122252_tbl_suppliers extends Migration {

 public function up(){
   $this->createTable('Supplier', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'brand'               => 'varchar(100)',
   ]);
 }

 public function down() {
     return $this->dropTable('Supplier');
 }
}
