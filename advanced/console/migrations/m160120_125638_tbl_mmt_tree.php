<?php

use yii\db\Schema;
use yii\db\Migration;

class m160120_125638_tbl_mmt_tree extends Migration {

 public function up(){
   $this->dropTable('MMTTree');
   $this->createTable('MMTTree', [
                  'path'      => 'LTREE',
                  'name'      => 'TEXT'
   ]);
   $SQL = " INSERT INTO \"MMTTree\" ("
       . "SELECT "
       . "  cast( CAST(mf.id AS text) as ltree) as path, "
       . "  mf.brand as name "
       . "FROM \"Manufacturers\" mf "
       . "ORDER BY mf.brand"
       . " )"
       . "UNION ("
       . "SELECT "
       . "  cast( CONCAT(CAST(mf.id AS text),'.', CAST(ms.model_id AS text)) as ltree) as path, "
       . "  ms.text_id as name "
       . "FROM \"Manufacturers\" mf "
       . "INNER JOIN \"Models\" ms "
       . "  ON ms.manufacturers_id=mf.id "
       . "ORDER BY mf.brand"
       . " )"
       . " UNION("
       . "SELECT "
       . "  cast(CONCAT(CAST(mf.id AS text),'.', CAST(ms.model_id AS text), '.', CAST(tp.type_id AS text)) as ltree) as path, "
       . "  tp.text_id as name "
       . "FROM \"Manufacturers\" mf "
       . "INNER JOIN \"Models\" ms "
       . "  ON ms.manufacturers_id=mf.id "
       . "INNER JOIN \"Types\" tp "
       . "  ON ms.model_id=tp.model_id order by tp.text_id) "
       . "ORDER BY path;";
   $this->execute($SQL);   
 }

 public function down() {
     return $this->dropTable('MMTTree');
 }
}
