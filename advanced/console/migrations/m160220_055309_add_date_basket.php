<?php

use yii\db\Schema;
use yii\db\Migration;

class m160220_055309_add_date_basket extends Migration{

 public function up(){
   $this->addColumn('Basket', 'date', 'timestamp ');
 }

 public function down() {
     return true;
 }

}
