<?php

use yii\db\Schema;
use yii\db\Migration;

class m160204_131427_add_user_shiping extends Migration {

 public function up(){
   $this->addColumn("Users", 'shiping', 'INTEGER');
 }

 public function down() {
    return true;
 }
}
