<?php

use yii\db\Schema;
use yii\db\Migration;

class m160220_062559_change_basket_fk extends Migration{

 public function up(){
   $SQL = <<<SQL
       ALTER TABLE "UserBasket"
         DROP CONSTRAINT IF EXISTS "UserBasket_basket_id_fkey";       
SQL;
   $this->execute($SQL);
   $this->addColumn("Basket", "basket_id", 'BIGSERIAL REFERENCES "UserBasket"(basket_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE');
 }

 public function down() {
     return true;
 }
}