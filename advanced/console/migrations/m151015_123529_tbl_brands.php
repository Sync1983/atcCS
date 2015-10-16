<?php

use yii\db\Schema;
use yii\db\Migration;

class m151015_123529_tbl_brands extends Migration {

 public function up(){
   $this->createTable('Brands', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'brand'               => 'varchar(100)',
   ]);
 }

 public function down() {
     return $this->dropTable('Brands');
 }
}
