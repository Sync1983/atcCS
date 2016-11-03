<?php

use yii\db\Migration;

class m161031_072514_tbl_add_catalog extends Migration {

 public function up(){
   $this->createTable('Catalog', [
                  'id'        => 'BIGSERIAL PRIMARY KEY',
                  'name'      => 'VARCHAR(150)',
                  'crm_id'    => 'BIGSERIAL',
                  'articul'   => 'VARCHAR(100)',
                  'descr'     => 'TEXT',
                  'maker'     => 'VARCHAR(50)',
                  'is_group'  => 'BOOLEAN',
                  'path'      => 'LTREE'
   ]);

 }

 public function down() {
     return $this->dropTable('Catalog');
 }
}