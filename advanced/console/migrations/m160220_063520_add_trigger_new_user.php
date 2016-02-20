<?php

use yii\db\Schema;
use yii\db\Migration;

class m160220_063520_add_trigger_new_user extends Migration{

 public function up(){
   $SQL = <<<SQL
    DROP TRIGGER IF EXISTS t_new_user ON "Users";
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       CREATE OR REPLACE FUNCTION new_user() RETURNS TRIGGER AS $$
       BEGIN
          INSERT INTO "UserBasket" (uid,name,active) VALUES (NEW.id,'Основная',true);
          RETURN NEW;
       END;
       $$ LANGUAGE plpgsql;
SQL;
   $this->execute($SQL);
$SQL = <<<SQL
       CREATE TRIGGER t_new_user
        AFTER INSERT ON "Users" FOR EACH ROW EXECUTE PROCEDURE new_user();
SQL;
   $this->execute($SQL);
 }

 public function down() {
     return true;
 }
}
