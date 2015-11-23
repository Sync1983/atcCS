<?php

use yii\db\Schema;
use yii\db\Migration;

class m151123_085105_tbl_group_info extends Migration {

 public function up(){
   $this->createTable('GroupInfo', [
                  'id'       => 'BIGSERIAL PRIMARY KEY',
                  'des_id'   => 'BIGSERIAL',
                  'std_id'   => 'BIGSERIAL',
                  'asm_id'   => 'BIGSERIAL',
                  'itd_id'   => 'BIGSERIAL',
   ]);

 }

 public function down() {
     return $this->dropTable('GroupInfo');
 }
}
