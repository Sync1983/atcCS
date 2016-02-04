<?php

use yii\db\Schema;
use yii\db\Migration;

class m160204_073825_tbl_user_basket extends Migration{

 public function up(){
   $this->createTable('UserBasket', [
                  'uid'                 => 'BIGSERIAL REFERENCES "Users"(id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE',
                  'basket_id'           => 'BIGSERIAL REFERENCES "Basket"(id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE',
   ]);
 }

 public function down() {
     return $this->dropTable('UserBasket');
 }
}
