<?php

use yii\db\Migration;

class m171107_085139_tbl_basket_add_real_price extends Migration{

 public function up(){
   $this->addColumn('Basket', 'rp', 'FLOAT ');
 }

 public function down() {
     return true;
 }
}
