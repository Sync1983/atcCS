<?php

use yii\db\Schema;
use yii\db\Migration;

class m151222_122443_tbl_str_lookup extends Migration {

 public function up(){
   $this->createTable('StrLookup', [
                  'id'        => 'BIGSERIAL PRIMARY KEY',
                  'ga_id'     => 'BIGSERIAL',
                  'str_id'    => 'BIGSERIAL'
   ]);

 }

 public function down() {
     return $this->dropTable('StrLookup');
 }
}