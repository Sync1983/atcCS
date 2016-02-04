<?php

use yii\db\Schema;
use yii\db\Migration;

class m160204_080507_fix_tbl_basket extends Migration{

 public function up(){
   $this->alterColumn('Basket','price','FLOAT');
   $this->addColumn('Basket', 'code', 'TEXT');
 }

 public function down() {
     return true;
 }

}