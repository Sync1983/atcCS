<?php

use yii\db\Migration;

class m160419_072234_alter_status_table extends Migration{

 public function up(){
   $this->dropColumn('Status', 'time');
   $this->addColumn('Status', 'time' , 'TIMESTAMP');
   $this->alterColumn('Status', 'status' , 'SMALLINT');
   $SQL = "ALTER TABLE \"Status\" ALTER COLUMN \"time\" SET DEFAULT NOW()";
   $this->execute($SQL);
   $SQL = "ALTER TABLE \"Status\" ALTER COLUMN \"status\" SET DEFAULT 0";
   $this->execute($SQL);
   //$this->addForeignKey("status_id_control", "Status", 'status', "StatusText", 'id', 'RESTRICT', 'CASCADE');
 }

 public function down() {
     return true;
 }
}

