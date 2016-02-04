<?php

use yii\db\Schema;
use yii\db\Migration;

class m160204_071322_tbl_basket extends Migration{

 public function up(){
   $this->createTable('Basket', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'provider'            => 'INTEGER',
                  'maker_id'            => 'INTEGER',
                  "shiping"             => 'INTEGER',
                  "count"               => 'INTEGER',
                  "sell_count"          => 'INTEGER',
                  "lot_quantity"        => 'INTEGER',
                  'wait_time'           => 'INTEGER',
                  "price"               => 'FLOAT',

                  "is_original"         => 'BOOLEAN',
                  "price_change"        => 'BOOLEAN',

                  "articul"             => 'VARCHAR(100)',
                  "maker"               => 'VARCHAR(100)',
                  "name"                => 'VARCHAR(100)',
                  "stock"               => 'VARCHAR(100)',
                  "info"                => 'TEXT',
                  "comment"             => 'TEXT'
   ]);
 }

 public function down() {
     return $this->dropTable('Basket');
 }
}