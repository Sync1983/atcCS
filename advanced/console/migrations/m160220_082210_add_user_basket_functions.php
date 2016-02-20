<?php

use yii\db\Schema;
use yii\db\Migration;

class m160220_082210_add_user_basket_functions extends Migration{

 public function up(){
   $SQL = <<<SQL
    DROP TRIGGER IF EXISTS t_new_user ON "Users";
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       CREATE OR REPLACE FUNCTION set_active_basket(integer,integer) RETURNS BOOLEAN AS $$
       BEGIN
          UPDATE "UserBasket" SET active=false where uid=$2;
          UPDATE "UserBasket" SET active=true where uid=$2 and basket_id=$1;
          RETURN true;
       END;
       $$ LANGUAGE plpgsql;
SQL;
   $this->execute($SQL);
$SQL = <<<SQL
       CREATE OR REPLACE FUNCTION get_active_basket(integer) RETURNS TABLE(basket_id int) AS $$
          SELECT basket_id FROM "UserBasket" WHERE active=true and uid=$1;
       $$ LANGUAGE SQL;
SQL;
   $this->execute($SQL);
 }

 public function down() {
     return true;
 }
}
