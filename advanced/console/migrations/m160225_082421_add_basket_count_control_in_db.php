<?php

use yii\db\Schema;
use yii\db\Migration;

class m160225_082421_add_basket_count_control_in_db extends Migration{

 public function up(){
   $SQL = <<<SQL
    CREATE OR REPLACE FUNCTION basket_count_check() RETURNS trigger AS $$
DECLARE
BEGIN
  IF (NEW.sell_count - NEW.count) > 0
    THEN RAISE EXCEPTION 'Количество (%) больше максимально разрешеного (%)',NEW.sell_count,NEW.count;
  END IF;

  IF (NEW.sell_count % NEW.lot_quantity) <> 0
    THEN RAISE EXCEPTION 'Ошибка количество(%)-партия(%)',NEW.sell_count,new.log_quantity;
  END IF;

  RETURN NEW;
END; $$ LANGUAGE plpgsql;
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
CREATE OR REPLACE FUNCTION basket_insert() RETURNS trigger AS $$
DECLARE
  crs RECORD;
BEGIN

  BEGIN
    SELECT * INTO STRICT crs FROM "Basket" WHERE code=NEW.code and maker_id = NEW.maker_id and basket_id = NEW.basket_id and price = NEW.price;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RETURN NEW;
    WHEN TOO_MANY_ROWS THEN
      RAISE EXCEPTION 'Ошибка целостности данных корзины. Повторяющиеся записи';
  END;

  UPDATE "Basket" SET
    count = NEW.count,
    sell_count = NEW.sell_count + crs.sell_count WHERE id = crs.id;

  RETURN NULL;
END; $$ LANGUAGE plpgsql;
SQL;
   $this->execute($SQL);

   $this->execute('DROP TRIGGER IF EXISTS basket_check_count  ON "Basket";');
   $this->execute('DROP TRIGGER IF EXISTS basket_check_insert ON "Basket";');
   $this->execute('CREATE TRIGGER basket_check_count  BEFORE UPDATE ON "Basket" FOR EACH ROW EXECUTE PROCEDURE basket_count_check();');
   $this->execute('CREATE TRIGGER basket_check_insert BEFORE INSERT ON "Basket" FOR EACH ROW EXECUTE PROCEDURE basket_insert();');
}

 public function down() {
   $this->execute('DROP TRIGGER IF EXISTS basket_check_count  ON "Basket";');
   $this->execute('DROP TRIGGER IF EXISTS basket_check_insert ON "Basket";');
 }
}
