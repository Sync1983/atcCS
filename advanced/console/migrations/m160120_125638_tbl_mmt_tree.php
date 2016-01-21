<?php

use yii\db\Schema;
use yii\db\Migration;

class m160120_125638_tbl_mmt_tree extends Migration {

 public function up(){

   $SQL = <<<SQL
        DROP TABLE IF EXISTS "MMTTree";
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
        DROP FUNCTION IF EXISTS split_by_alphabet(text);
SQL;
   $this->execute($SQL);

   $this->createTable('MMTTree', [
                  'path'      => 'LTREE',
                  'name'      => 'TEXT'
   ]);
   $SQL = <<<SQL
        CREATE OR REPLACE FUNCTION split_by_alphabet(text) RETURNS text
        AS $$ select
          case
            when upper(substr($1,1,1)) SIMILAR TO '[A-D]%' THEN 'AD'
            when upper(substr($1,1,1)) SIMILAR TO '[E-H]%' THEN 'EH'
            when upper(substr($1,1,1)) SIMILAR TO '[I-L]%' THEN 'IL'
            when upper(substr($1,1,1)) SIMILAR TO '[M-P]%' THEN 'MP'
            when upper(substr($1,1,1)) SIMILAR TO '[Q-T]%' THEN 'QT'
            when upper(substr($1,1,1)) SIMILAR TO '[U-Z]%' THEN 'UZ'
            ELSE 'ZZ'
          END;$$
        LANGUAGE SQL
        IMMUTABLE
RETURNS NULL ON NULL INPUT
SQL;
   $this->execute($SQL);

   $SQL = <<<SQL
      INSERT INTO "MMTTree" (
      (
        SELECT
          cast( CONCAT(split_by_alphabet(mf.brand), '.', CAST(mf.id AS text)) as ltree) as path,
          mf.brand as name
        FROM "Manufacturers" mf
        ORDER BY mf.brand
      ) UNION (
        SELECT
          cast( CONCAT(split_by_alphabet(mf.brand), '.', CAST(mf.id AS text),'.', CAST(ms.model_id AS text) ) as ltree) as path,
          ms.text_id as name
        FROM "Manufacturers" mf
        INNER JOIN "Models" ms
          ON ms.manufacturers_id=mf.id
        ORDER BY mf.brand
      ) UNION (
        SELECT
          cast(CONCAT(split_by_alphabet(mf.brand), '.', CAST(mf.id AS text),'.', CAST(ms.model_id AS text), '.', CAST(tp.type_id AS text)) as ltree) as path,
          tp.text_id as name
        FROM "Manufacturers" mf
        INNER JOIN "Models" ms
          ON ms.manufacturers_id=mf.id
        INNER JOIN "Types" tp
          ON ms.model_id=tp.model_id order by tp.text_id)
        ORDER BY path);
SQL;
   $this->execute($SQL);
   $this->insert("MMTTree", ['path'=>'AD','name'=>'A-D']);
   $this->insert("MMTTree", ['path'=>'EH','name'=>'E-H']);
   $this->insert("MMTTree", ['path'=>'IL','name'=>'I-L']);
   $this->insert("MMTTree", ['path'=>'MP','name'=>'M-P']);
   $this->insert("MMTTree", ['path'=>'QT','name'=>'Q-T']);
   $this->insert("MMTTree", ['path'=>'UZ','name'=>'U-Z']);
 }

 public function down() {
     return $this->dropTable('MMTTree');
 }
}
