<?php

use yii\db\Migration;

class m160414_083325_add_users_markup extends Migration{

 public function up(){
   $this->createTable('UserMarkup', [
                  'uid'                 => 'BIGSERIAL REFERENCES "Users"(id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE',
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'name'                => 'VARCHAR(25) DEFAULT \'*\' ',
                  'value'               => 'FLOAT DEFAULT 0'
   ]);
 }

 public function down() {
     return $this->dropTable('UserMarkup');
 }
}
