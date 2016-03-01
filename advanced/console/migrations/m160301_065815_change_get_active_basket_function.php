<?php

use yii\db\Schema;
use yii\db\Migration;

class m160301_065815_change_get_active_basket_function extends Migration{

  public function up(){
    $this->execute("DROP FUNCTION IF EXISTS get_active_basket(integer)");

    $SQL = <<<SQL
      CREATE OR REPLACE FUNCTION get_active_basket(integer) RETURNS integer AS $$
        DECLARE
          crs RECORD;
        BEGIN

          BEGIN
            SELECT * INTO STRICT crs FROM "UserBasket" WHERE active=true and uid=$1;
          EXCEPTION
          WHEN NO_DATA_FOUND THEN
            INSERT INTO "UserBasket" (uid,name,active) VALUES($1,'Основная',true);
            RETURN get_active_basket($1);
          WHEN TOO_MANY_ROWS THEN
            RAISE EXCEPTION 'Ошибка целостности данных корзины. Несколько активных корзин';
          END;

          RETURN crs.basket_id;
        END;
      $$ LANGUAGE plpgsql;
SQL;
   $this->execute($SQL);
 }

 public function down() {
     return true;
 }
}
