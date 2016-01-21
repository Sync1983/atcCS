<?php

use yii\db\Schema;
use yii\db\Migration;

class m160121_080733_add_index_mmttree extends Migration {

 public function up(){
   $SQL = <<<SQL
       CREATE INDEX mmttree_index_gist ON "MMTTree" USING gist(path);
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       CREATE INDEX mmttree_index_id ON "MMTTree" USING btree(path);
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       CREATE INDEX mmttree_index_name ON "MMTTree" ("name" text_pattern_ops);
SQL;
   $this->execute($SQL);
 }

 public function down() {
   $SQL = <<<SQL
       DROP INDEX IF EXISTS mmttree_index_gist;
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       DROP INDEX IF EXISTS mmttree_index_id;
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       DROP INDEX IF EXISTS mmttree_index_name;
SQL;
   $this->execute($SQL);
    return true;
 }
}
