<?php

use yii\db\Migration;

class m161128_093718_add_catalog_functions extends Migration{

  public function up(){
//    $SQL = <<<SQL
//        CREATE OR REPLACE FUNCTION get_catalog_group(IN p text, IN g boolean)
//          RETURNS TABLE(id bigint, name character varying, path text) AS $$
//          SELECT "id","name",CAST("path" as text) FROM "Catalog" WHERE path ~ CAST(p || '.*{1}' AS lquery) and is_group = g;
//        $$ LANGUAGE sql;
//SQL;
//    $this->execute($SQL);
  }

 public function down() {
//     $SQL = <<<SQL
//       DROP FUNCTION IF EXISTS get_catalog_group()
//SQL;
//    return $this->execute($SQL);
 }
 
}
