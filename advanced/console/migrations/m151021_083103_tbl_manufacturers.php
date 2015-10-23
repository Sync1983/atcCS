<?php

use yii\db\Schema;
use yii\db\Migration;

class m151021_083103_tbl_manufacturers extends Migration{

 public function up(){
   $this->createTable('Manufacturers', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'brand'               => 'VARCHAR(100)',
                  'type'                => 'BIT(4) DEFAULT B\'0000\'',
   ]);

   $this->createIndex('by_type','Manufacturers','type');

   echo "Create text index on \"brand\"\r\n";
   $SQL = 'CREATE INDEX by_brand ON "Manufacturers" ("brand" text_pattern_ops);';
   $this->db->createCommand($SQL)->execute();

 }

 public function down() {
     return $this->dropTable('Manufacturers');
 }
}
