<?php

use yii\db\Schema;
use yii\db\Migration;

class m151016_054646_tbl_articul_info extends Migration {

 public function up(){
   $this->createTable('ArticleInfo', [
                  'id'                  => 'BIGSERIAL PRIMARY KEY',
                  'number'              => 'VARCHAR(100)',
                  'supplier'            => 'INTEGER DEFAULT 0',
                  'description'         => 'INTEGER DEFAULT 0',
                  'type'                => 'BIT(4) DEFAULT B\'0000\'',
   ]);
   echo "Create text index on \"number\"\r\n";
   $SQL = 'CREATE INDEX by_part_number ON "ArticleInfo" ("number" text_pattern_ops);';
   $this->db->createCommand($SQL)->execute();
   
 }

 public function down() {
     return $this->dropTable('ArticleInfo');
 }
}
