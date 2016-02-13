<?php

use yii\db\Schema;
use yii\db\Migration;

class m160213_055921_add_prices_table extends Migration{

 public function up(){
   $this->createTable('Prices', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'pid'                 => 'INTEGER',
                  'articul'             => 'VARCHAR(100)',
                  'visual_articul'      => 'VARCHAR(100)',
                  'maker'               => 'VARCHAR(100)',
                  'name'                => 'TEXT',
                  'price'               => 'FLOAT',
                  'count'               => 'INTEGER',
                  'lot_quantity'        => 'INTEGER DEFAULT 1',
   ]);
 }

 public function down() {
     return $this->dropTable('Prices');
 }
}
