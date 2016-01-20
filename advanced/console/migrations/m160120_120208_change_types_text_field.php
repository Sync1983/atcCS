<?php

use yii\db\Schema;
use yii\db\Migration;

class m160120_120208_change_types_text_field extends Migration{

 public function up(){
   $this->alterColumn('Types', 'text_id', 'text');
 }

 public function down() {
     return $this->alterColumn('Types', 'text_id', 'INTEGER');
 }
}
