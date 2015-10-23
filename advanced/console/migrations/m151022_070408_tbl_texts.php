<?php

use yii\db\Schema;
use yii\db\Migration;

class m151022_070408_tbl_texts extends Migration{

 public function up(){
   $this->createTable('Texts', [
                  'id'          => 'BIGSERIAL PRIMARY KEY',
                  'text'        => 'TEXT',
   ]);
 }

 public function down() {
     return $this->dropTable('Texts');
 }
}
