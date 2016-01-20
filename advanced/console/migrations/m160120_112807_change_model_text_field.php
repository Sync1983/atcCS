<?php

use yii\db\Schema;
use yii\db\Migration;

class m160120_112807_change_model_text_field extends Migration{

 public function up(){
   $this->alterColumn('Models', 'text_id', 'text');
 }

 public function down() {
     return $this->alterColumn('Models', 'text_id', 'INTEGER');
 }
}
